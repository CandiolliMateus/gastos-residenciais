using FluentValidation;
using GastosResidenciais.DTOs;
using GastosResidenciais.Repositories.Interfaces;

namespace GastosResidenciais.Validators;

public class TransacaoRequestValidator : AbstractValidator<TransacaoRequest>
{
    public TransacaoRequestValidator(IPessoaRepository pessoaRepo, ICategoriaRepository categoriaRepo)
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória.")
            .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres.");

        RuleFor(x => x.Valor)
            .GreaterThan(0).WithMessage("Valor deve ser positivo.");

        RuleFor(x => x.Tipo)
            .InclusiveBetween(1, 2).WithMessage("Tipo inválido. Use 1 (Despesa) ou 2 (Receita).");

        RuleFor(x => x.PessoaId)
            .MustAsync(async (id, ct) =>
            {
                var pessoa = await pessoaRepo.BuscarPorIdAsync(id, ct);
                return pessoa is not null;
            }).WithMessage("Pessoa não encontrada.");

        RuleFor(x => x.CategoriaId)
            .MustAsync(async (id, ct) =>
            {
                var categoria = await categoriaRepo.BuscarPorIdAsync(id, ct);
                return categoria is not null;
            }).WithMessage("Categoria não encontrada.");

        // Regras compostas que dependem de múltiplos campos
        RuleFor(x => x).CustomAsync(async (request, context, ct) =>
        {
            // Verifica pessoa e regra de menor de 18 anos
            var pessoa = await pessoaRepo.BuscarPorIdAsync(request.PessoaId, ct);
            if (pessoa is null)
            {
                // já coberto por RuleFor(PessoaId), mas mantemos a checagem defensiva
                return;
            }

            if (pessoa.Idade < 18 && request.Tipo == 2)
            {
                context.AddFailure("Tipo", "Menores de 18 anos só podem registrar despesas.");
                return;
            }

            // Verifica categoria e compatibilidade com o tipo
            var categoria = await categoriaRepo.BuscarPorIdAsync(request.CategoriaId, ct);
            if (categoria is null)
            {
                // já coberto por RuleFor(CategoriaId)
                return;
            }

            var compativel = categoria.Finalidade == 3
                || (categoria.Finalidade == 1 && request.Tipo == 1)
                || (categoria.Finalidade == 2 && request.Tipo == 2);

            if (!compativel)
            {
                context.AddFailure("CategoriaId",
                    $"A categoria '{categoria.Descricao}' não é compatível com transações do tipo '{(request.Tipo == 1 ? "Despesa" : "Receita")}'.");
            }
        });
    }
}
