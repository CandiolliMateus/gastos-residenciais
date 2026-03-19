using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.DTOs;

public class CategoriaRequest
{
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(400, ErrorMessage = "Descrição deve ter no máximo 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Range(1, 3, ErrorMessage = "Finalidade inválida. Use 1 (Despesa), 2 (Receita) ou 3 (Ambas).")]
    public int Finalidade { get; set; }
}

public class CategoriaUpdateRequest
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(400, ErrorMessage = "Descrição deve ter no máximo 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Range(1, 3, ErrorMessage = "Finalidade inválida. Use 1 (Despesa), 2 (Receita) ou 3 (Ambas).")]
    public int Finalidade { get; set; }
}

public class CategoriaResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Finalidade { get; set; }
    public string FinalidadeLabel { get; set; } = string.Empty;
}
