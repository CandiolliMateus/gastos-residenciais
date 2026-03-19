using GastosResidenciais.DTOs;

namespace GastosResidenciais.Services.Interfaces;

public interface ICategoriaService
{
    Task<IEnumerable<CategoriaResponse>> ListarAsync(CancellationToken cancellationToken = default);
    Task<CategoriaResponse> CriarAsync(CategoriaRequest request, CancellationToken cancellationToken = default);
    Task<CategoriaResponse> AtualizarAsync(int id, CategoriaUpdateRequest request, CancellationToken cancellationToken = default);
    Task DeletarAsync(int id, CancellationToken cancellationToken = default);
    Task<CategoriaResponse?> BuscarPorIdAsync(int id, CancellationToken cancellationToken = default);
}
