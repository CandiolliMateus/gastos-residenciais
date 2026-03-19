using FluentValidation;
using GastosResidenciais.DTOs;
using GastosResidenciais.Repositories.Interfaces;

namespace GastosResidenciais.Validators;

public class PessoaRequestValidator : AbstractValidator<PessoaRequest>
{
    public PessoaRequestValidator(IPessoaRepository pessoaRepository)
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.")
            .MustAsync(async (nome, ct) =>
            {
                return !await pessoaRepository.ExistePorNomeAsync(nome, ct);
            }).WithMessage("Já existe uma pessoa cadastrada com este nome.");

        RuleFor(x => x.Idade)
            .GreaterThan(0).WithMessage("Idade deve ser maior que zero.");
    }
}
