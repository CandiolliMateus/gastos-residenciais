using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.DTOs;

public class TransacaoRequest
{
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(400, ErrorMessage = "Descrição deve ter no máximo 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser positivo.")]
    public decimal Valor { get; set; }

    [Range(1, 2, ErrorMessage = "Tipo inválido. Use 1 (Despesa) ou 2 (Receita).")]
    public int Tipo { get; set; }

    [Required(ErrorMessage = "Categoria é obrigatória.")]
    public int CategoriaId { get; set; }

    [Required(ErrorMessage = "Pessoa é obrigatória.")]
    public int PessoaId { get; set; }
}

public class TransacaoResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int Tipo { get; set; }
    public string TipoLabel { get; set; } = string.Empty;
    public int CategoriaId { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
    public int PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
}

public class TransacaoDto
{
    public int Id { get; set; }
    public string? Descricao { get; set; }
    public decimal Valor { get; set; }
    public int Tipo { get; set; }
    public int CategoriaId { get; set; }
    public string? CategoriaDescricao { get; set; }
    public int PessoaId { get; set; }
    public string? PessoaNome { get; set; }
}

public class TransacoesPorPessoaDto
{
    public int PessoaId { get; set; }
    public string? PessoaNome { get; set; }
    public List<TransacaoDto> Transacoes { get; set; } = new();
}
