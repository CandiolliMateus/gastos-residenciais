using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GastosResidenciais.Data;
using GastosResidenciais.DTOs;
using Microsoft.Extensions.DependencyInjection;

namespace GastosResidenciais.Tests.Integration;

/// <summary>
/// Testes de integração para o TransacoesController.
/// Testam as regras de negócio mais críticas do sistema:
/// - Menor de 18 anos só pode ter despesas
/// - Categoria incompatível com o tipo da transação
/// </summary>
public class TransacoesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public TransacoesControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private void ResetDatabase()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task<PessoaResponse> CriarPessoa(string nome, int idade)
    {
        var request = new PessoaRequest { Nome = nome, Idade = idade };
        var response = await _client.PostAsJsonAsync("/api/pessoas", request);
        return (await response.Content.ReadFromJsonAsync<PessoaResponse>())!;
    }

    private async Task<CategoriaResponse> CriarCategoria(string descricao, int finalidade)
    {
        var request = new CategoriaRequest { Descricao = descricao, Finalidade = finalidade };
        var response = await _client.PostAsJsonAsync("/api/categorias", request);
        return (await response.Content.ReadFromJsonAsync<CategoriaResponse>())!;
    }

    // ── GET /api/transacoes ───────────────────────────────────────────────────

    [Fact]
    public async Task GET_Transacoes_DeveRetornar200()
    {
        ResetDatabase();

        var response = await _client.GetAsync("/api/transacoes");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    // ── POST /api/transacoes ──────────────────────────────────────────────────

    [Fact]
    public async Task POST_Transacoes_QuandoDadosValidos_DeveRetornar201()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("João Silva", 25);
        var categoria = await CriarCategoria("Alimentação", 1); // Despesa

        var request = new TransacaoRequest
        {
            Descricao = "Supermercado",
            Valor = 150,
            Tipo = 1, // Despesa
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoMenorDeIdadeTentaReceita_DeveRetornar400()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("João Menor", 16);
        var categoria = await CriarCategoria("Salário", 2); // Receita

        var request = new TransacaoRequest
        {
            Descricao = "Mesada",
            Valor = 100,
            Tipo = 2, // Receita
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoMenorDeIdadeCriaDespesa_DeveRetornar201()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("João Menor", 16);
        var categoria = await CriarCategoria("Alimentação", 1); // Despesa

        var request = new TransacaoRequest
        {
            Descricao = "Lanche",
            Valor = 20,
            Tipo = 1, // Despesa
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoCategoriaIncompativel_DeveRetornar400()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("Maria Santos", 30);
        var categoria = await CriarCategoria("Salário", 2); // Receita

        var request = new TransacaoRequest
        {
            Descricao = "Teste incompatível",
            Valor = 100,
            Tipo = 1, // Despesa — incompatível com categoria Receita
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoCategoriaAmbas_DevePermitirQualquerTipo()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("Carlos Lima", 35);
        var categoria = await CriarCategoria("Geral", 3); // Ambas

        var requestDespesa = new TransacaoRequest
        {
            Descricao = "Despesa Geral",
            Valor = 100,
            Tipo = 1,
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var requestReceita = new TransacaoRequest
        {
            Descricao = "Receita Geral",
            Valor = 200,
            Tipo = 2,
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var responseDespesa = await _client.PostAsJsonAsync("/api/transacoes", requestDespesa);
        var responseReceita = await _client.PostAsJsonAsync("/api/transacoes", requestReceita);

        responseDespesa.StatusCode.Should().Be(HttpStatusCode.Created);
        responseReceita.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoValorZero_DeveRetornar400()
    {
        ResetDatabase();

        var pessoa = await CriarPessoa("Ana Lima", 28);
        var categoria = await CriarCategoria("Transporte", 1);

        var request = new TransacaoRequest
        {
            Descricao = "Teste",
            Valor = 0, // inválido
            Tipo = 1,
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Transacoes_QuandoPessoaNaoExiste_DeveRetornar400()
    {
        ResetDatabase();

        var categoria = await CriarCategoria("Alimentação", 1);

        var request = new TransacaoRequest
        {
            Descricao = "Teste",
            Valor = 100,
            Tipo = 1,
            PessoaId = 99999, // não existe
            CategoriaId = categoria.Id
        };

        var response = await _client.PostAsJsonAsync("/api/transacoes", request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
