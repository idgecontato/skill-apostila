# skill-apostila

Skill para o Claude Code que orquestra o fluxo completo de revisão e produção de apostilas profissionalizantes.

## O que faz

- **Fase 1a** — Auditoria de qualidade: elimina redundâncias, corrige imprecisões técnicas, aprofunda conteúdo
- **Fase 1b** — Enriquecimento: adiciona exemplos práticos, exercícios, atividades e marcadores de imagem
- **Fase 2** — Catálogo de imagens: compila todos os marcadores, gera prompts para DALL-E e planilha Excel
- **Fase 3** — Geração de imagens: chama a OpenAI API automaticamente (ou instrui o processo manual)
- **Fase 4** — Pacote de handoff: prepara tudo para a diagramação no Claude Design

## Instalação

Copie `apostila.md` para `~/.claude/commands/`:

**Windows:**
```powershell
Copy-Item apostila.md "$env:USERPROFILE\.claude\commands\apostila.md"
```

**Mac/Linux:**
```bash
cp apostila.md ~/.claude/commands/apostila.md
```

## Uso

```
/apostila "caminho/para/apostila.pdf"   → inicia ou retoma o fluxo
/apostila status                         → exibe o status de todas as apostilas
/apostila fase2 "caminho/da/pasta"       → força execução de uma fase específica
/apostila handoff "caminho/da/pasta"     → cria pacote de handoff para diagramação
```

## Dependências opcionais

- **Node.js** — para geração automática do Excel (`generate_excel.js`)
- **OpenAI API Key** (`OPENAI_API_KEY`) — para geração automática de imagens na Fase 3

## Contexto

Desenvolvido para o projeto **Jovem Empreendedor PE em Ação** — 9 cursos profissionalizantes, 5 municípios, 570 vagas.
