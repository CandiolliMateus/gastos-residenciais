using GastosResidenciais.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly IRelatorioService _relatorioService;

    public RelatoriosController(IRelatorioService relatorioService)
    {
        _relatorioService = relatorioService;
    }

    [HttpGet("pessoas")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> TotaisPorPessoa()
    {
        var resposta = await _relatorioService.TotaisPorPessoaAsync();
        return Ok(resposta);
    }

    [HttpGet("categoria")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> TotaisPorCategoria()
    {
        var resposta = await _relatorioService.TotaisPorCategoriaAsync();
        return Ok(resposta);
    }
}
