using GastosResidenciais.DTOs;

namespace GastosResidenciais.Services.Interfaces;

public interface ITransacaoService
{
    Task<IEnumerable<TransacoesPorPessoaDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<TransacaoResponse> CriarAsync(TransacaoRequest request, CancellationToken cancellationToken = default);
    Task<TransacaoResponse?> BuscarPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<TransacaoResponse> AtualizarAsync(int id, TransacaoRequest request, CancellationToken cancellationToken = default);
    Task DeletarAsync(int id, CancellationToken cancellationToken = default);
}
