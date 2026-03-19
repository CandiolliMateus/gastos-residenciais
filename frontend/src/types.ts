// src/types.ts
export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export type Categoria = {
  id: number;
  descricao: string;
  finalidade: number;
  finalidadeLabel?: string;
  isDeleted?: boolean;
};

export interface RelatorioPessoa {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisItem {
  id: number;
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface RelatorioResponse {
  itens: TotaisItem[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: number;
  categoriaId: number;
  categoriaDescricao?: string;
}

export interface TransacoesPorPessoa {
  pessoaId: number;
  pessoaNome?: string;
  transacoes: Transacao[];
}

export interface TransacaoRequest {
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: number;
  categoriaId: number;
}

export interface TransacaoResponse {
  id: number;
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: number;
  categoriaId: number;
  categoriaDescricao: string;
  pessoaNome: string;
}
