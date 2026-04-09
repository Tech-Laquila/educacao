// Cole este código no Google Apps Script (script.google.com)
// vinculado à sua planilha do Google Sheets.
//
// Depois: Implantar → Nova implantação → Tipo: App da Web
//   - Executar como: Eu (sua conta)
//   - Quem tem acesso: Qualquer pessoa
// Copie a URL gerada e cole como variável de ambiente APPS_SCRIPT_URL no Vercel.

const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    let data;
    
    // Tenta ler como JSON primeiro (mais robusto para Vercel -> Google)
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("Não foi possível encontrar a planilha ativa. Certifique-se de que o script foi criado através do menu Extensões > Apps Script dentro da planilha.");
    }
    
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getSheets()[0]; // Usa a primeira aba se não achar 'Leads'
    }

    // Cria cabeçalho se a planilha estiver vazia ou se a primeira linha não for compatível
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora', 'Cliente', 'Escritório', 'WhatsApp',
        'Contratos/mês', 'Faturamento Atual', 'Meta Contratos',
        'Meta Faturamento', 'Ticket Médio', 'Perda Mensal Estimada',
        'Potencial 6 Meses', 'Dores Marcadas', 'Pilares Ativados'
      ]);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.cliente || '',
      data.escritorio || '',
      data.whatsapp || '',
      data.contratos || 0,
      data.faturamento || 0,
      data.metaContratos || 0,
      data.metaFaturamento || 0,
      data.ticketMedio || 0,
      data.perdaMensal || 0,
      data.potencial || 0,
      data.dores || '',
      data.pilares || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Salvo com sucesso' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('Erro no doPost:', err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
