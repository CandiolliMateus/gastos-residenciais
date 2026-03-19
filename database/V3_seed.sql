-- Inserindo pessoas
INSERT INTO "Pessoas" ("Nome", "Idade") VALUES
('Mateus', 28),
('Ana', 32),
('Carlos', 45);

-- Inserindo categorias
INSERT INTO "Categorias" ("Descricao", "Finalidade") VALUES
('Alimentação', 1),
('Transporte', 2),
('Lazer', 3);

-- Inserindo transações
INSERT INTO "Transacoes" ("Descricao", "Valor", "Tipo", "CategoriaId", "PessoaId", "Data") VALUES
('Supermercado', 250.00, 1, 1, 1, '2026-03-01T10:00:00'),
('Uber para reunião', 35.50, 2, 2, 2, '2026-03-02T14:30:00'),
('Cinema', 50.00, 1, 3, 3, '2026-03-05T20:00:00');
