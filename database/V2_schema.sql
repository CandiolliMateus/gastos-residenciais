CREATE TABLE IF NOT EXISTS "Pessoas" (
    "Id"    SERIAL PRIMARY KEY,
    "Nome"  VARCHAR(200) NOT NULL,
    "Idade" INTEGER      NOT NULL
);

CREATE TABLE IF NOT EXISTS "Categorias" (
    "Id"         SERIAL PRIMARY KEY,
    "Descricao"  VARCHAR(400) NOT NULL,
    "Finalidade" INTEGER     NOT NULL CHECK ("Finalidade" IN (1, 2, 3)),
    "IsDeleted"  BOOLEAN     NOT NULL DEFAULT FALSE
);

-- índice único para Descricao considerando apenas categorias não deletadas (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS "UX_Categorias_Descricao_Active"
    ON "Categorias"(lower("Descricao"))
    WHERE "IsDeleted" = FALSE;

CREATE TABLE IF NOT EXISTS "Transacoes" (
    "Id"          SERIAL PRIMARY KEY,
    "Descricao"   VARCHAR(400)   NOT NULL,
    "Valor"       NUMERIC(18, 2) NOT NULL CHECK ("Valor" > 0),
    "Tipo"        INTEGER        NOT NULL CHECK ("Tipo" IN (1, 2)),
    "CategoriaId" INTEGER        NOT NULL,
    "PessoaId"    INTEGER        NOT NULL,
    "Data"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "IsDeleted"   BOOLEAN        NOT NULL DEFAULT FALSE,

    CONSTRAINT "FK_Transacoes_Pessoas"
        FOREIGN KEY ("PessoaId")
        REFERENCES "Pessoas" ("Id")
        ON DELETE CASCADE,

    CONSTRAINT "FK_Transacoes_Categorias"
        FOREIGN KEY ("CategoriaId")
        REFERENCES "Categorias" ("Id")
        ON DELETE RESTRICT
);

-- índices para performance em consultas que filtram por pessoa/categoria e IsDeleted
CREATE INDEX IF NOT EXISTS "IX_Transacoes_PessoaId_IsDeleted" ON "Transacoes" ("PessoaId", "IsDeleted");
CREATE INDEX IF NOT EXISTS "IX_Transacoes_CategoriaId_IsDeleted" ON "Transacoes" ("CategoriaId", "IsDeleted");
CREATE INDEX IF NOT EXISTS "IX_Transacoes_Data" ON "Transacoes" ("Data");
