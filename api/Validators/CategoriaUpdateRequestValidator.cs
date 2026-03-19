using FluentValidation;
using GastosResidenciais.DTOs;
using GastosResidenciais.Repositories.Interfaces;

namespace GastosResidenciais.Validators;

// <summary>
/// Validador para atualização de categorias.
/// Regras:
/// - Id deve ser válido (> 0).
/// - Descrição obrigatória, até 400 caracteres, e única entre categorias ativas (ignora soft delete).
/// - Finalidade deve ser 1 (Despesa), 2 (Receita) ou 3 (Ambas).
/// - Id informado no body deve coincidir com o Id da rota.
/// </summary>
public class CategoriaUpdateRequestValidator : AbstractValidator<CategoriaUpdateRequest>
{
    private readonly ICategoriaRepository _categoriaRepository;

    public CategoriaUpdateRequestValidator(ICategoriaRepository categoriaRepository)
    {
        _categoriaRepository = categoriaRepository;

        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id inválido.");

        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória.")
            .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres.")
            .MustAsync(async (model, descricao, ct) =>
            {
                if (string.IsNullOrWhiteSpace(descricao)) return true;

                // Busca a categoria atual para permitir atualização sem erro de duplicidade
                var atual = await _categoriaRepository.BuscarPorIdAsync(model.Id, ct);
                if (atual != null && string.Equals(atual.Descricao?.Trim(), descricao.Trim(), StringComparison.OrdinalIgnoreCase))
                    return true;

                // Verifica se já existe outra categoria ativa com a mesma descrição
                return !await _categoriaRepository.ExisteCategoriaComDescricaoAsync(descricao, model.Id, ct);
            })
            .WithMessage("Já existe uma categoria cadastrada com esta descrição.");

        RuleFor(x => x.Finalidade)
            .InclusiveBetween(1, 3).WithMessage("Finalidade inválida. Use 1 (Despesa), 2 (Receita) ou 3 (Ambas).");

        // Regra que compara route id com body.Id via RootContextData
        RuleFor(x => x).Custom((request, context) =>
        {
            if (context.RootContextData.TryGetValue("routeId", out var routeIdObj)
                && routeIdObj is int routeId)
            {
                if (request.Id != routeId)
                {
                    context.AddFailure("Id", "Id do recurso e do body divergem.");
                }
            }
        });
    }
}
