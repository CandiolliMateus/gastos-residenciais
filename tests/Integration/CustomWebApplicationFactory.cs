using GastosResidenciais.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace GastosResidenciais.Tests.Integration;

/// <summary>
/// Factory customizada para testes de integração.
/// Substitui o banco PostgreSQL por um banco em memória
/// Testes rodam sem dependência de infraestrutura externa.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing"); // força ambiente de teste

        builder.ConfigureServices(services =>
        {
            // Remove qualquer configuração existente do AppDbContext
            services.RemoveAll(typeof(AppDbContext));
            services.RemoveAll(typeof(DbContextOptions<AppDbContext>));

            // Adiciona banco em memória
            var dbName = $"TestDb_{Guid.NewGuid()}";
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase(dbName);
                options.EnableDetailedErrors();
                options.EnableSensitiveDataLogging();
            });

            // Garante que o banco em memória é criado
            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        });
    }
}
