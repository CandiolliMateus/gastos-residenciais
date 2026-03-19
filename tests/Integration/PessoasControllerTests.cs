using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GastosResidenciais.DTOs;
using GastosResidenciais.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace GastosResidenciais.Tests.Integration;

/// <summary>
/// Testes de integração para o PessoasController.
/// Cada teste roda isolado: o banco em memória é recriado antes de cada execução.
/// </summary>
public class PessoasControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public PessoasControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    /// <summary>
    /// Recria o banco em memória antes de cada teste.
    /// </summary>
    private void ResetDatabase()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }

    // ── GET /api/pessoas ──────────────────────────────────────────────────────

    [Fact]
    public async Task GET_Pessoas_DeveRetornar200()
    {
        ResetDatabase();

        var response = await _client.GetAsync("/api/pessoas");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GET_Pessoas_DeveRetornarListaVazia_QuandoNaoHaPessoas()
    {
        ResetDatabase();

        var response = await _client.GetAsync("/api/pessoas");
        var pessoas = await response.Content.ReadFromJsonAsync<List<PessoaResponse>>();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        pessoas.Should().NotBeNull();
        pessoas.Should().BeEmpty();
    }

    // ── POST /api/pessoas ─────────────────────────────────────────────────────

    [Fact]
    public async Task POST_Pessoas_QuandoDadosValidos_DeveRetornar201()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "João Silva", Idade = 25 };
        var response = await _client.PostAsJsonAsync("/api/pessoas", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task POST_Pessoas_QuandoDadosValidos_DeveRetornarPessoaCriada()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "Maria Santos", Idade = 30 };
        var response = await _client.PostAsJsonAsync("/api/pessoas", request);
        var pessoa = await response.Content.ReadFromJsonAsync<PessoaResponse>();

        pessoa.Should().NotBeNull();
        pessoa!.Nome.Should().Be("Maria Santos");
        pessoa.Idade.Should().Be(30);
        pessoa.Id.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task POST_Pessoas_QuandoNomeVazio_DeveRetornar400()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "", Idade = 25 };
        var response = await _client.PostAsJsonAsync("/api/pessoas", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Pessoas_QuandoIdadeZero_DeveRetornar400()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "Teste", Idade = 0 };
        var response = await _client.PostAsJsonAsync("/api/pessoas", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // ── GET /api/pessoas/{id} ─────────────────────────────────────────────────

    [Fact]
    public async Task GET_PessoaPorId_QuandoExiste_DeveRetornar200()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "Carlos Lima", Idade = 40 };
        var createResponse = await _client.PostAsJsonAsync("/api/pessoas", request);
        var criada = await createResponse.Content.ReadFromJsonAsync<PessoaResponse>();

        var response = await _client.GetAsync($"/api/pessoas/{criada!.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GET_PessoaPorId_QuandoNaoExiste_DeveRetornar404()
    {
        ResetDatabase();

        var response = await _client.GetAsync("/api/pessoas/99999");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/pessoas/{id} ──────────────────────────────────────────────

    [Fact]
    public async Task DELETE_Pessoa_QuandoExiste_DeveRetornar204()
    {
        ResetDatabase();

        var request = new PessoaRequest { Nome = "Pedro Costa", Idade = 35 };
        var createResponse = await _client.PostAsJsonAsync("/api/pessoas", request);
        var criada = await createResponse.Content.ReadFromJsonAsync<PessoaResponse>();

        var response = await _client.DeleteAsync($"/api/pessoas/{criada!.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DELETE_Pessoa_QuandoNaoExiste_DeveRetornar404()
    {
        ResetDatabase();

        var response = await _client.DeleteAsync("/api/pessoas/99999");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── PUT /api/pessoas/{id} ─────────────────────────────────────────────────

    [Fact]
    public async Task PUT_Pessoa_QuandoExiste_DeveRetornar200()
    {
        ResetDatabase();

        var createRequest = new PessoaRequest { Nome = "Ana Lima", Idade = 28 };
        var createResponse = await _client.PostAsJsonAsync("/api/pessoas", createRequest);
        var criada = await createResponse.Content.ReadFromJsonAsync<PessoaResponse>();

        var updateRequest = new PessoaUpdateRequest { Id = criada!.Id, Nome = "Ana Lima Atualizada", Idade = 29 };
        var response = await _client.PutAsJsonAsync($"/api/pessoas/{criada.Id}", updateRequest);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task PUT_Pessoa_QuandoNaoExiste_DeveRetornar404()
    {
        ResetDatabase();

        var request = new PessoaUpdateRequest { Id = 99999, Nome = "Teste", Idade = 25 };
        var response = await _client.PutAsJsonAsync("/api/pessoas/99999", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DEBUG_VerificarErroInterno()
    {
        ResetDatabase();

        var response = await _client.GetAsync("/api/pessoas");
        var content = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"Status: {response.StatusCode}");
        Console.WriteLine($"Body: {content}");

        content.Should().NotBeNull();
    }
}
