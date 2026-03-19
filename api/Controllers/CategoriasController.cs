using GastosResidenciais.DTOs;
using GastosResidenciais.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Listar()
    {
        var resposta = await _categoriaService.ListarAsync();
        return Ok(resposta);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Criar([FromBody] CategoriaRequest request)
    {
        var resposta = await _categoriaService.CriarAsync(request);
        return CreatedAtAction(nameof(Listar), new { id = resposta.Id }, resposta);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CategoriaResponse>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        var resposta = await _categoriaService.BuscarPorIdAsync(id, cancellationToken);
        if (resposta is null) return NotFound(new { erro = "Categoria não encontrada." });
        return Ok(resposta);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CategoriaResponse>> Atualizar(int id, [FromBody] CategoriaUpdateRequest request, CancellationToken cancellationToken)
    {
        var resposta = await _categoriaService.AtualizarAsync(id, request, cancellationToken);
        return Ok(resposta);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Deletar(int id, CancellationToken cancellationToken)
    {
        await _categoriaService.DeletarAsync(id, cancellationToken);
        return NoContent();
    }
}
