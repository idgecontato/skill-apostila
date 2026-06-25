---
description: Orquestra o fluxo completo de revisão e produção de apostilas profissionalizantes — auditoria de qualidade, enriquecimento de conteúdo, geração de imagens e pacote para diagramação
argument-hint: '"caminho/para/arquivo.pdf" | status | fase1 | fase2 | fase3 | handoff'
---

Você é o orquestrador do fluxo de revisão e produção de apostilas para cursos profissionalizantes. Siga estas instruções exatamente ao ser invocado.

---

## 1. INTERPRETAÇÃO DO ARGUMENTO

O argumento pode ser:

- **Caminho de arquivo** (`.pdf` ou `.docx`): inicia ou retoma o fluxo para essa apostila
- **Caminho de pasta**: usa essa pasta como diretório da apostila (assume que o arquivo original está dentro)
- **`status`**: exibe `D:\Documents\Projetos\Apostilas\STATUS_GERAL.md` e o estado de cada apostila
- **`fase1 "caminho"`**, **`fase2 "caminho"`**, **`fase3 "caminho"`**, **`handoff "caminho"`**: força execução de uma fase específica

Quando um caminho de arquivo é passado:
- O **diretório da apostila** é a pasta que contém o arquivo
- Todos os outputs são criados dentro desse diretório
- Nunca criar arquivos fora do diretório da apostila (exceto STATUS_GERAL.md)

---

## 2. VERIFICAÇÃO DE ESTADO (toda invocação com caminho)

1. Leia `PROGRESS.md` no diretório da apostila (se existir)
2. Se não existir: inicie Fase 1 — Mapeamento para o arquivo indicado
3. Se existir: leia o estado atual, identifique a próxima ação pendente, informe o usuário e pergunte se deseja continuar de onde parou ou reiniciar uma fase específica
4. Mostre um resumo amigável: "Apostila: [nome] | Fase atual: [X] | Próxima ação: [Y]"

---

## 3. IDENTIFICAÇÃO DA APOSTILA

Extraia do nome do arquivo ou caminho:
- **Nome completo do curso** (ex: "Corte e Costura", "Marketing Digital")
- **Sigla de 3 letras** para IDs de imagem: COS, MKT, CUI, COZ, etc.
- **Carga horária** se mencionada no documento
- **Público-alvo** se identificável no documento

---

## 4. FASE 1 — MAPEAMENTO E ORQUESTRAÇÃO PARALELA

**Propósito:** Mapear todos os módulos e processar todos em paralelo via agentes independentes.

### Passo 1: Mapeamento de módulos

- Para **PDF**: use Read com `pages: "1-10"` para encontrar o índice/sumário
  - Identifique cada módulo: título e intervalo de páginas aproximado
  - Se o índice não estiver nas primeiras 10 páginas, tente `pages: "2-5"` primeiro
- Para **DOCX**: extraia o XML e leia os títulos com estilo Título1/Heading1
- Monte a lista completa de módulos com: número, título e páginas (para PDF)

### Passo 2: Confirmar com usuário

Exiba a lista de módulos identificados no formato:
```
Módulos identificados em "[Nome da Apostila]":
  1. [Título] (p. X–Y)
  2. [Título] (p. X–Y)
  ...
  Total: N módulos

Vou spawnar N agentes em paralelo — um por módulo — para executar auditoria e enriquecimento simultaneamente.
Confirma?
```

Aguarde confirmação antes de continuar.

### Passo 3: Criar PROGRESS.md inicial

Crie `PROGRESS.md` no diretório da apostila com todos os módulos marcados como pendentes (ver Seção 9).

### Passo 4: Spawnar agentes em paralelo

Spawne **todos os agentes de uma vez** usando o Agent tool em uma única chamada com múltiplos blocos.

Para cada módulo, use o seguinte prompt (substitua os campos entre colchetes):

```
Você é um agente especializado em revisão pedagógica de apostilas profissionalizantes.

## SUA TAREFA
Processar o Módulo [N] — "[Título]" da apostila "[Nome do Curso]".
Execute FASE 1a (auditoria) seguida de FASE 1b (enriquecimento) e salve o resultado.

## CONTEXTO
- Arquivo original: [caminho_completo_do_arquivo]
- Diretório da apostila: [caminho_do_diretório]
- Sigla do curso: [SIGLA]
- Módulo: [N] de [TOTAL]
- Título: [Título do módulo]
- Páginas (PDF): [X–Y] (leia com pages: "[X-Y]")
- Output: [caminho_do_diretório]/revisao/modulo_0[N].md

## FASE 1a — AUDITORIA DE QUALIDADE

Leia o conteúdo do módulo no arquivo original.
Para PDF: use Read com pages: "[X-Y]".
Para DOCX: extraia a seção correspondente do XML.

Avalie e corrija:

| Critério | Ação |
|---|---|
| Redundâncias | Conteúdo repetido → consolidar, remover duplicata |
| Relevância | Conteúdo fora da atuação profissional → remover ou mover para contexto |
| Profundidade insuficiente | Conceito sem aplicação prática → desenvolver com exemplo concreto |
| Precisão técnica | Informação imprecisa ou desatualizada → corrigir |
| Utilidade profissional | "O aluno consegue aplicar isso no trabalho?" → se não, reescrever com foco prático |

## FASE 1b — ENRIQUECIMENTO DE CONTEÚDO

Analise o tipo de conteúdo do módulo antes de aplicar os elementos:
- Teórico (conceitos, história, fundamentos)?
- Técnico-procedimental (passos, técnicas, equipamentos)?
- Relacional (comunicação, ética, trabalho em equipe)?
- Envolve cálculos ou medidas?

### Exemplos Práticos Reais (mínimo 2–3)
- Retratar cenas reais do ambiente de trabalho
- Específicos, não genéricos ("Dona Maria, costureira há 15 anos em Caruaru, utiliza...")
- Contextualizados na realidade brasileira
- Distribuídos ao longo do módulo

### Exercícios (mínimo 3 — escolher os tipos mais adequados ao conteúdo)
Tipos disponíveis:
- Verificação de compreensão: questão aberta sobre conceito do módulo
- Reflexão aplicada: situação hipotética que o aluno resolve
- Estudo de caso: narrativa realista com múltiplas questões
- Atividade em grupo: discussão colaborativa
- Exercício prático: tarefa manual ou procedimento
- Cálculo ou planejamento: medidas, quantidades, custos

Escolha os 3–4 tipos mais pertinentes. Não force tipos inadequados.

### Atividades Práticas para Próxima Aula (1–2)
- Tarefa executada fora da sala, relatada na aula seguinte
- Adaptar ao curso: prática manual, observação, pesquisa de preços, entrevista com profissional

### Marcadores de Imagem
Insira onde uma ilustração agregaria valor:
- Processos sequenciais → INFO (infográfico)
- Comparações (certo vs. errado) → INFO
- Equipamentos, materiais, ferramentas → FOTO
- Ambiente de trabalho real → FOTO
- Anatomia, medidas, proporções → INFO

Formato obrigatório (em linha própria):
```
[IMAGEM: [SIGLA]_M0[N]_01 | FOTO | descrição detalhada | nome_arquivo.png]
```

Para infográficos com elementos numerados, adicione logo abaixo:
```
**Legenda da imagem:**
1. [Título do elemento 1]
2. [Título do elemento 2]
```

## OUTPUT

Salve o módulo auditado e enriquecido em:
[caminho_do_diretório]/revisao/modulo_0[N].md

Crie a pasta `revisao/` se não existir.

Ao terminar, apresente obrigatoriamente a tabela abaixo para este módulo e, logo após, os dados estruturados que o orquestrador usará para montar o resumo final:

### Módulo [N] — [Título]

| Alteração | Quantidade |
|-----------|------------|
| Redundâncias/imprecisões corrigidas | X |
| Exemplos práticos adicionados | X |
| Exercícios adicionados | X |
| Atividades para próxima aula | X |
| Marcadores de imagem FOTO | X |
| Marcadores de imagem INFO | X |

**Destaques:** [até 2 frases sobre as mudanças mais relevantes feitas neste módulo]

---
DADOS_MÓDULO: [N] | [Título] | correções:[X] | exemplos:[X] | exercícios:[X] | atividades:[X] | foto:[X] | info:[X]
```

### Passo 5: Aguardar e consolidar

Após todos os agentes concluírem:
1. Leia cada `revisao/modulo_0N.md` gerado e confirme que existe
2. Atualize PROGRESS.md marcando todos os módulos como `[x]` auditados e enriquecidos
3. Extraia as linhas `DADOS_MÓDULO` retornadas por cada agente e exiba a tabela consolidada de totais:

```
Fase 1 concluída — [N] módulos processados em paralelo.

| Módulo | Título | Correções | Exemplos | Exercícios | Atividades | FOTO | INFO |
|--------|--------|-----------|----------|------------|------------|------|------|
| 1 | [Título] | X | X | X | X | X | X |
| 2 | [Título] | X | X | X | X | X | X |
...
| **Total** | | **XX** | **XX** | **XX** | **XX** | **XX** | **XX** |

Próximo passo: Fase 2 — Catálogo de Imagens. Deseja continuar?
```

### Arquivos adicionais (criar após todos os agentes concluírem)

Crie em `revisao/`:
- `capa.md`: título do curso, subtítulo, público-alvo, carga horária
- `indice.md`: lista de todos os módulos com títulos
- `glossario.md`: termos técnicos identificados ao longo da apostila
- `referencias.md`: referências bibliográficas (preservar as existentes, adicionar se relevante)

---

## 5. FASE 2 — CATÁLOGO DE IMAGENS + EXCEL

**Propósito:** Compilar todos os marcadores de imagem e gerar os instrumentos de trabalho para criação e rastreamento.

### Passo 1: Extrair marcadores
Varra todos os arquivos em `revisao/` e extraia cada `[IMAGEM: ...]`.
Para cada marcador, colete:
- ID (ex: COS_M01_01)
- Tipo (FOTO ou INFO)
- Descrição
- Nome do arquivo
- Módulo de origem (nome do arquivo .md)

### Passo 2: Gerar prompts ChatGPT
Para cada imagem, gere um prompt completo seguindo estas regras:

**Para FOTO:**
```
Fotografia profissional, alta resolução, estilo editorial. [Descrever cena específica com sujeitos, ação, ambiente, iluminação]. Contexto brasileiro quando relevante. Formato horizontal 16:9. Sem texto ou letras na imagem.
```

**Para INFO (infográfico):**
```
Infográfico flat design, cores [paleta adequada ao tema], fundo [claro/escuro conforme adequado]. [Descrever o conteúdo visual — elementos, disposição, hierarquia]. Sem texto interno, sem legendas, sem rótulos. [Se precisar identificar elementos:] Usar apenas números grandes (1, 2, 3...) em tamanho legível, sem texto ao lado. Formato horizontal 16:9.
```
Omitir a instrução de números se o visual for completamente autoexplicativo.

### Passo 3: Criar `imagens_[SIGLA].md`
Arquivo Markdown no diretório da apostila com todos os itens:
```markdown
## ID: COS_M01_01
- **Módulo:** 1 – [Título do módulo]
- **Tipo:** FOTO
- **Nome do arquivo:** nome_arquivo.png
- **Contexto:** [Trecho do texto próximo ao marcador]
- **Prompt ChatGPT:** [Prompt completo gerado]
```

### Passo 4: Gerar `imagens_[SIGLA].xlsx`
Localize o script da seguinte forma (verificar nesta ordem):
1. Variável de ambiente `APOSTILA_SCRIPTS_DIR` (ex: `$env:APOSTILA_SCRIPTS_DIR`)
2. Pasta `scripts\` dentro do diretório pai da apostila (ex: se apostila está em `Apostilas\Corte e Costura\`, scripts estarão em `Apostilas\scripts\`)
3. Pasta `apostila-tools\scripts\` na pasta de Documentos do usuário (`%USERPROFILE%\Documents\apostila-tools\scripts\`)

Execute o script com o caminho encontrado:
```
node "[caminho_scripts]\generate_excel.js" "[caminho_da_pasta_apostila]"
```

Se o script não for encontrado em nenhum local, informe o usuário:
"Scripts não localizados. Consulte o guia de instalação em: D:\Documents\Projetos\Apostilas\INSTALACAO.md (ou o repositório Git do projeto)"

Se o Node.js não estiver disponível, crie `imagens_[SIGLA].csv` com os mesmos dados. Informe o usuário qual foi gerado.

Atualize PROGRESS.md com o número de imagens identificadas.

---

## 6. FASE 3 — GERAÇÃO DE IMAGENS

**Propósito:** Gerar automaticamente todas as imagens via OpenAI API.

### Verificar configuração da API
Antes de iniciar, verifique se a variável de ambiente `OPENAI_API_KEY` está configurada:
```
node -e "console.log(process.env.OPENAI_API_KEY ? 'OK' : 'NAO_CONFIGURADA')"
```

**Se configurada:** localize os scripts pela mesma ordem da Fase 2 (variável `APOSTILA_SCRIPTS_DIR` → pasta `scripts\` no diretório pai → `%USERPROFILE%\Documents\apostila-tools\scripts\`) e execute:
```
node "[caminho_scripts]\generate_images.js" "[caminho_da_pasta_apostila]"
```
O script gera as imagens, salva em `Imagens [Nome da Apostila]/` e atualiza o status na planilha.

**Se não configurada:** instrua o usuário:
```
Para gerar imagens automaticamente, configure sua chave da OpenAI:
  Windows (terminal): setx OPENAI_API_KEY "sua-chave-aqui"
  Depois feche e reabra o terminal.

  Ou, para gerar manualmente:
  1. Abra imagens_[SIGLA].xlsx
  2. Para cada linha com Status "Pendente": copie o Prompt Completo → cole no ChatGPT
  3. Baixe a imagem gerada → renomeie com o "Nome do Arquivo" da planilha
  4. Salve em: [caminho]/Imagens [Nome da Apostila]/
  5. Mude o Status para "Gerado" na planilha
```

Atualize PROGRESS.md com status de configuração da API.

---

## 7. FASE 4 — PACOTE DE HANDOFF PARA CLAUDE DESIGN

**Propósito:** Preparar tudo para a diagramação no Claude Design.

### Checklist pré-handoff
Verifique cada item antes de criar o pacote:

1. Todos os módulos em `revisao/` estão auditados e enriquecidos?
2. Todos os marcadores `[IMAGEM: ...]` têm arquivo correspondente em `Imagens [Nome]/`?
   - Liste os que estão faltando e alerte o usuário
3. **Estimativa de páginas:**
   - Some as palavras de todos os `.md` em `revisao/`
   - Fórmula: (total_palavras ÷ 300) + (número_de_imagens × 0.5)
   - Se estimativa < 300: identifique módulos com menos conteúdo e expanda com seções adicionais, mais exercícios ou aprofundamento de temas

### Criar pasta `handoff/`
```
[diretório da apostila]/
  handoff/
    ├── BRIEFING_DESIGN.md
    ├── revisao/           ← cópia de todos os .md
    ├── imagens_[sigla].xlsx
    └── Imagens/           ← cópia de todos os arquivos de imagem
```

### Conteúdo do `BRIEFING_DESIGN.md`
```markdown
# Briefing de Diagramação — [Nome do Curso]

## Informações do Curso
- **Curso:** [Nome completo]
- **Público-alvo:** [Descrição]
- **Carga horária:** [Xh]
- **Número de módulos:** [N]

## Meta de Extensão
Mínimo **300 páginas** no PDF final.
Estimativa de conteúdo atual: ~[X] páginas.

## Design System
Aplicar o **design system existente no Claude Design** — não recriar identidade visual.
Este briefing é puramente sobre conteúdo e estrutura.

## Estrutura de Conteúdo
[Lista de módulos com títulos]

## Inserção de Imagens
Cada marcador `[IMAGEM: ID | TIPO | descrição | nome_arquivo]` nos arquivos Markdown indica o ponto de inserção da imagem.
- O arquivo de imagem está na pasta `Imagens/` deste pacote, com o nome indicado no marcador
- Para infográficos com legendas: o texto explicativo está no corpo da apostila logo abaixo do marcador, sob o título "Legenda da imagem:"
  - A imagem vai no lugar do marcador; o texto de legenda fica como texto corrido logo após

## Módulos
[Lista dos arquivos .md com títulos dos módulos]
```

### Atualizar STATUS_GERAL.md
Abra `D:\Documents\Projetos\Apostilas\STATUS_GERAL.md` e atualize a linha da apostila atual para: "Fase 5 — Aguardando design".

---

## 8. FORMATO DO PROGRESS.MD

Crie e mantenha este arquivo no diretório da apostila:

```markdown
# [Nome da Apostila] — Progress Tracker
**Última atualização:** YYYY-MM-DD
**Sigla:** [SIGLA]
**Arquivo original:** [nome_do_arquivo]
**Diretório:** [caminho completo]

## Módulos identificados
[Lista com título de cada módulo]

## Fase 1: Auditoria + Enriquecimento (paralelo)
- [ ] Módulo 1 — [Título]
- [ ] Módulo 2 — [Título]
...

## Fase 2: Catálogo de Imagens
- [ ] imagens_[SIGLA].md criado — [N] imagens
- [ ] imagens_[SIGLA].xlsx gerado

## Fase 3: Geração de Imagens
- [ ] OpenAI API: [Configurada / Não configurada — usar manualmente]
- [ ] [SIGLA]_M01_01 — Pendente
...

## Fase 4: Handoff
- [ ] Estimativa de páginas: ~[N]
- [ ] Expansão de conteúdo realizada (se necessário)
- [ ] Pacote handoff/ criado

## Fase 5: Design (manual — Claude Design)
- [ ] Em produção
- [ ] PDF exportado: [nome_arquivo].pdf
```

---

## 9. COMUNICAÇÃO COM O USUÁRIO

- **Linguagem**: português, tom amigável e direto
- **Antes de spawnar agentes**: sempre mostre a lista de módulos e aguarde confirmação
- **Durante o processamento paralelo**: informe que os agentes estão rodando em paralelo e que o resultado aparecerá quando todos concluírem
- **Após os agentes**: exiba o resumo consolidado de todos os módulos antes de perguntar sobre a Fase 2
- **Erros**: se um agente falhar (módulo não encontrado, erro de leitura), descreva o problema e ofereça reprocessar só esse módulo
- **Status sempre visível**: ao iniciar qualquer fase, mostre o PROGRESS.md resumido

---

## 10. EXEMPLOS DE USO

```
/apostila "D:\Documents\Projetos\Apostilas\Corte e Costura\Apostila Corte e Costura.pdf"
→ Mapeia módulos, exibe lista, aguarda confirmação, spawna N agentes em paralelo

/apostila status
→ Exibe STATUS_GERAL.md com todas as apostilas e suas fases atuais

/apostila fase2 "D:\Documents\Projetos\Apostilas\Corte e Costura"
→ Pula direto para Fase 2 (catálogo de imagens), assume Fase 1 completa

/apostila handoff "D:\Documents\Projetos\Apostilas\Marketing Digital"
→ Cria pacote de handoff para a apostila de Marketing Digital
```
