using GastosResidenciais.DTOs;

namespace GastosResidenciais.Services.Interfaces;

public interface IPessoaService
{
    Task<IEnumerable<PessoaResponse>> ListarAsync(CancellationToken cancellationToken = default);
    Task<PessoaResponse?> BuscarPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<PessoaResponse> CriarAsync(PessoaRequest request, CancellationToken cancellationToken = default);
    Task<PessoaResponse> AtualizarAsync(int id, PessoaUpdateRequest request, CancellationToken cancellationToken = default);
    Task DeletarAsync(int id, CancellationToken cancellationToken = default);
}
