namespace GastosResidenciais.DTOs;

public class TotaisItem
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Receitas { get; set; }
    public decimal Despesas { get; set; }
    public decimal Saldo { get; set; }
}

public class RelatorioResponse
{
    public IEnumerable<TotaisItem> Itens { get; set; } = new List<TotaisItem>();
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal SaldoLiquido { get; set; }
}
