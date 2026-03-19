using GastosResidenciais.DTOs;
using GastosResidenciais.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> BuscarPorId(int id)
    {
        var resposta = await _pessoaService.BuscarPorIdAsync(id);
        if (resposta is null) 
            return NotFound(new { erro = "Pessoa não encontrada." });

        return Ok(resposta);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Criar([FromBody] PessoaRequest request)
    {
        var resposta = await _pessoaService.CriarAsync(request);
        return CreatedAtAction(nameof(BuscarPorId), new { id = resposta.Id }, resposta);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Atualizar(int id, [FromBody] PessoaUpdateRequest request)
    {
        var resposta = await _pessoaService.AtualizarAsync(id, request);
        return Ok(resposta);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Deletar(int id)
    {
        await _pessoaService.DeletarAsync(id);
        return NoContent();
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Listar()
    {
        var resposta = await _pessoaService.ListarAsync();
        return Ok(resposta);
    }
}
