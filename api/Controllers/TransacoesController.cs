using GastosResidenciais.DTOs;
using GastosResidenciais.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Listar()
    {
        var resposta = await _transacaoService.ListarAsync();
        return Ok(resposta);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Criar([FromBody] TransacaoRequest request)
    {
        var resposta = await _transacaoService.CriarAsync(request);
        return CreatedAtAction(nameof(Listar), new { id = resposta.Id }, resposta);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TransacaoResponse>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        var resposta = await _transacaoService.BuscarPorIdAsync(id, cancellationToken);
        if (resposta is null) return NotFound(new { erro = "Transação não encontrada." });
        return Ok(resposta);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TransacaoResponse>> Atualizar(int id, [FromBody] TransacaoRequest request, CancellationToken cancellationToken)
    {
        var resposta = await _transacaoService.AtualizarAsync(id, request, cancellationToken);
        return Ok(resposta);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Deletar(int id, CancellationToken cancellationToken)
    {
        await _transacaoService.DeletarAsync(id, cancellationToken);
        return NoContent();
    }
}
