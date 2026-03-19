// src/api.ts
import axios from "axios";
import type { Pessoa, Categoria, Transacao, RelatorioPessoa } from "./types";

const api = axios.create({
  baseURL: "http://localhost:5077/api", // https://localhost:7018/api
});

// Pessoas
export const getPessoas = () => api.get<Pessoa[]>("/pessoas");
export const getPessoaById = (id: number) => api.get<Pessoa>(`/pessoas/${id}`);
export const createPessoa = (pessoa: Omit<Pessoa, "id">) => api.post<Pessoa>("/pessoas", pessoa);
export const updatePessoa = (id: number, pessoa: Pessoa) => api.put<Pessoa>(`/pessoas/${id}`, pessoa);
export const deletePessoa = (id: number) => api.delete(`/pessoas/${id}`);

// Categorias
export const getCategorias = () => api.get<Categoria[]>("/Categorias");
export const getCategoria = (id: number) => api.get<Categoria>(`/Categorias/${id}`);
export const createCategoria = (payload: { descricao: string; finalidade: number }) =>
  api.post<Categoria>("/Categorias", payload);
export const updateCategoria = (id: number, payload: { descricao: string; finalidade: number }) =>
  api.put<Categoria>(`/Categorias/${id}`, payload);

// soft delete
export const deleteCategoria = (id: number) => api.delete(`/Categorias/${id}`);

// Transações
export const getTransacoes = () => api.get<Transacao[]>("/transacoes");
export const getTransacaoById = (id: number) => api.get<Transacao>(`/transacoes/${id}`); // <-- novo
export const createTransacao = (transacao: Omit<Transacao, "id">) => api.post("/transacoes", transacao);
export const updateTransacao = (id: number, transacao: Omit<Transacao, "id">) => api.put(`/transacoes/${id}`, transacao); // <-- novo
export const deleteTransacao = (id: number) => api.delete(`/transacoes/${id}`);
export const restoreTransacao = (id: number) => api.post(`/admin/transacoes/${id}/restore`);

// Relatórios
export const getRelatorioPorPessoa = () => api.get<RelatorioPessoa[]>("/relatorios/pessoas");
export const getRelatorioPorCategoria = () => api.get("/relatorios/categoria");
