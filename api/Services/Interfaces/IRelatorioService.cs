using GastosResidenciais.DTOs;

namespace GastosResidenciais.Services.Interfaces;

public interface IRelatorioService
{
    Task<RelatorioResponse> TotaisPorPessoaAsync(CancellationToken cancellationToken = default);
    Task<RelatorioResponse> TotaisPorCategoriaAsync(CancellationToken cancellationToken = default);
}
