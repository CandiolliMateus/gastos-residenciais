using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.DTOs;

public class PessoaRequest
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Idade deve ser maior que zero.")]
    public int Idade { get; set; }
}

public class PessoaUpdateRequest
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Idade deve ser maior que zero.")]
    public int Idade { get; set; }
}

public class PessoaResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}
