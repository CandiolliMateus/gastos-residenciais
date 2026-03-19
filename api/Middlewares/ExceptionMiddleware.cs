using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace GastosResidenciais.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        } catch (FluentValidation.ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed: {Message}", ex.Message);
            await EscreverValidationProblemAsync(context, ex);
        } catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Argumento inválido: {Message}", ex.Message);
            await EscreverProblemAsync(context, HttpStatusCode.BadRequest, "Bad request", ex.Message);
        } catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Recurso não encontrado: {Message}", ex.Message);
            await EscreverProblemAsync(context, HttpStatusCode.NotFound, "Resource not found", ex.Message);
        }  catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Regra de negócio violada: {Message}", ex.Message);
            await EscreverProblemAsync(context, HttpStatusCode.UnprocessableEntity, "Invalid operation", ex.Message);
        } catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado: {Message}", ex.Message);
            await EscreverProblemAsync(context, HttpStatusCode.InternalServerError, "An unexpected error occurred", "Ocorreu um erro interno no servidor.");
        }
    }

    private static async Task EscreverValidationProblemAsync(HttpContext context, FluentValidation.ValidationException ex)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

        var errors = ex.Errors
            .GroupBy(e => string.IsNullOrWhiteSpace(e.PropertyName) ? "global" : e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        var validationProblem = new ValidationProblemDetails(errors)
        {
            Title = "Validation failed",
            Status = (int)HttpStatusCode.BadRequest,
            Detail = "One or more validation errors occurred."
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(validationProblem, options));
    }

    private static async Task EscreverProblemAsync(HttpContext context, HttpStatusCode statusCode, string title, string detail)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)statusCode;

        var problem = new ProblemDetails
        {
            Title = title,
            Status = (int)statusCode,
            Detail = detail
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(problem, options));
    }
}
