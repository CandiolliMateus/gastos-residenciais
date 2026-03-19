using FluentValidation;
using GastosResidenciais.DTOs;
using GastosResidenciais.Repositories.Interfaces;

namespace GastosResidenciais.Validators;

public class CategoriaRequestValidator : AbstractValidator<CategoriaRequest>
{
    public CategoriaRequestValidator(ICategoriaRepository categoriaRepository)
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória.")
            .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres.")
            .MustAsync(async (descricao, ct) =>
            {
                // validação de unicidade simples; para update a service faz checagem adicional
                return !await categoriaRepository.ExisteCategoriaComDescricaoAsync(descricao, null, ct);
            }).WithMessage("Já existe uma categoria cadastrada com esta descrição.");

        RuleFor(x => x.Finalidade)
            .InclusiveBetween(1, 3).WithMessage("Finalidade inválida. Use 1 (Despesa), 2 (Receita) ou 3 (Ambas).");
    }
}
