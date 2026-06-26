/**
 * generate_excel.js
 * Lê os arquivos .md em revisao/ de uma apostila, extrai marcadores [IMAGEM: ...],
 * gera prompts ChatGPT e cria a planilha Excel de rastreamento de imagens.
 *
 * Uso: node generate_excel.js "D:\Caminho\Para\Apostila"
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// ─── Argumentos ──────────────────────────────────────────────────────────────
const apostilaDir = process.argv[2];
if (!apostilaDir) {
  console.error('Uso: node generate_excel.js "<caminho da pasta da apostila>"');
  process.exit(1);
}
if (!fs.existsSync(apostilaDir)) {
  console.error(`Diretório não encontrado: ${apostilaDir}`);
  process.exit(1);
}

const revisaoDir = path.join(apostilaDir, 'revisao');
if (!fs.existsSync(revisaoDir)) {
  console.error(`Pasta "revisao/" não encontrada em: ${apostilaDir}`);
  console.error('Execute a Fase 1 primeiro para gerar os arquivos de conteúdo.');
  process.exit(1);
}

// ─── Regex para marcadores de imagem ─────────────────────────────────────────
// [IMAGEM: ID | TIPO | descrição | nome_arquivo.png]
const IMAGEM_REGEX = /\[IMAGEM:\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^\]]+?)\s*\]/g;

// ─── Leitura dos módulos ──────────────────────────────────────────────────────
const mdFiles = fs.readdirSync(revisaoDir)
  .filter(f => f.endsWith('.md'))
  .sort();

const imagens = [];

for (const mdFile of mdFiles) {
  const filePath = path.join(revisaoDir, mdFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Determina o título do módulo (primeira linha que começa com #)
  const tituloLinha = lines.find(l => l.startsWith('#'));
  const tituloModulo = tituloLinha
    ? tituloLinha.replace(/^#+\s*/, '').trim()
    : mdFile.replace('.md', '');

  let match;
  IMAGEM_REGEX.lastIndex = 0;

  while ((match = IMAGEM_REGEX.exec(content)) !== null) {
    const id = match[1].trim();
    const tipo = match[2].trim().toUpperCase();
    const descricao = match[3].trim();
    const nomeArquivo = match[4].trim().replace(/\.(png|jpg|jpeg|webp)$/i, '');

    // Contexto: texto das 2 linhas antes do marcador
    const posicao = content.lastIndexOf('\n', match.index);
    const trecho = content.substring(Math.max(0, posicao - 200), posicao).split('\n').slice(-2).join(' ').trim();
    const contexto = trecho.length > 120 ? trecho.substring(0, 117) + '...' : trecho;

    imagens.push({
      id,
      tipo,
      descricao,
      nomeArquivo,
      modulo: tituloModulo,
      contexto,
    });
  }
}

if (imagens.length === 0) {
  console.log('Nenhum marcador [IMAGEM: ...] encontrado nos arquivos de revisão.');
  console.log('Verifique se a Fase 1b foi concluída.');
  process.exit(0);
}

// ─── Geração de prompts ───────────────────────────────────────────────────────
function gerarPrompt(tipo, descricao) {
  if (tipo === 'FOTO') {
    return (
      `Fotografia profissional, alta resolução, estilo editorial brasileiro. ` +
      `${descricao}. ` +
      `Iluminação natural ou de estúdio, sem sombras duras. ` +
      `Formato horizontal 16:9. ` +
      `Sem texto, sem letras, sem marcas d'água na imagem.`
    );
  } else {
    // INFO — infográfico
    return (
      `Infográfico flat design, visual limpo e profissional. ` +
      `${descricao}. ` +
      `Cores vibrantes mas harmoniosas, fundo claro ou branco. ` +
      `Sem texto interno, sem legendas escritas, sem rótulos. ` +
      `Se precisar identificar elementos distintos, usar apenas números grandes e legíveis (1, 2, 3...) ` +
      `— sem texto ao lado dos números. ` +
      `Formato horizontal 16:9.`
    );
  }
}

// ─── Detecção da sigla ────────────────────────────────────────────────────────
function detectarSigla() {
  if (imagens.length > 0) {
    const primeiroId = imagens[0].id;
    const partes = primeiroId.split('_');
    if (partes.length >= 2) return partes[0].toUpperCase();
  }
  const nomePasta = path.basename(apostilaDir);
  return nomePasta.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() || 'APO';
}

const sigla = detectarSigla();

// ─── Criação do Excel ─────────────────────────────────────────────────────────
const cabecalho = [
  'Status',
  'ID',
  'Nome do Arquivo',
  'Módulo',
  'Tipo',
  'Prompt Completo',
  'Contexto (resumo)',
  'Orientação',
  'Observações',
];

const linhas = imagens.map(img => [
  'Pendente',
  img.id,
  img.nomeArquivo,
  img.modulo,
  img.tipo,
  gerarPrompt(img.tipo, img.descricao),
  img.contexto,
  '16:9',
  '',
]);

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet([cabecalho, ...linhas]);

// Larguras das colunas
ws['!cols'] = [
  { wch: 12 },  // Status
  { wch: 16 },  // ID
  { wch: 32 },  // Nome do Arquivo
  { wch: 36 },  // Módulo
  { wch: 8  },  // Tipo
  { wch: 80 },  // Prompt
  { wch: 40 },  // Contexto
  { wch: 10 },  // Orientação
  { wch: 30 },  // Observações
];

xlsx.utils.book_append_sheet(wb, ws, 'Imagens');

const excelPath = path.join(apostilaDir, `imagens_${sigla}.xlsx`);
xlsx.writeFile(wb, excelPath);

// ─── Criação do .md de catálogo ───────────────────────────────────────────────
let mdCatalogo = `# Catálogo de Imagens — ${path.basename(apostilaDir)}\n\n`;
mdCatalogo += `**Total de imagens:** ${imagens.length}\n`;
mdCatalogo += `**Sigla:** ${sigla}\n\n---\n\n`;

for (const img of imagens) {
  mdCatalogo += `## ID: ${img.id}\n`;
  mdCatalogo += `- **Módulo:** ${img.modulo}\n`;
  mdCatalogo += `- **Tipo:** ${img.tipo}\n`;
  mdCatalogo += `- **Nome do arquivo:** ${img.nomeArquivo}\n`;
  mdCatalogo += `- **Contexto:** ${img.contexto || '(início do módulo)'}\n`;
  mdCatalogo += `- **Prompt ChatGPT:**\n  ${gerarPrompt(img.tipo, img.descricao)}\n\n`;
}

const mdPath = path.join(apostilaDir, `imagens_${sigla}.md`);
fs.writeFileSync(mdPath, mdCatalogo, 'utf8');

// ─── Resumo ───────────────────────────────────────────────────────────────────
console.log(`\n✓ ${imagens.length} imagens encontradas`);
console.log(`✓ Excel gerado: ${excelPath}`);
console.log(`✓ Catálogo .md gerado: ${mdPath}`);
console.log(`\nFotos: ${imagens.filter(i => i.tipo === 'FOTO').length}`);
console.log(`Infográficos: ${imagens.filter(i => i.tipo === 'INFO').length}`);
