using FluentValidation;
using GastosResidenciais.DTOs;
using GastosResidenciais.Repositories;
using GastosResidenciais.Repositories.Interfaces;

namespace GastosResidenciais.Validators;

public class PessoaUpdateRequestValidator : AbstractValidator<PessoaUpdateRequest>
{
    private readonly IPessoaRepository _pessoaRepository;

    public PessoaUpdateRequestValidator(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;

        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id inválido.");

        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.")
            .MustAsync(async (model, nome, ct) =>
            {
                if (string.IsNullOrWhiteSpace(nome)) return true;
                return !await _pessoaRepository.ExistePorNomeAsync(nome, ct);
            }).WithMessage("Já existe uma pessoa cadastrada com este nome.");

        RuleFor(x => x.Idade)
            .GreaterThan(0).WithMessage("Idade deve ser maior que zero.");

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
