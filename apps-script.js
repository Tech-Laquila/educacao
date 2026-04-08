// Cole este código no Google Apps Script (script.google.com)
// vinculado à sua planilha do Google Sheets.
//
// Depois: Implantar → Nova implantação → Tipo: App da Web
//   - Executar como: Eu (sua conta)
//   - Quem tem acesso: Qualquer pessoa
// Copie a URL gerada e cole em APPS_SCRIPT_URL no HTML.

const SHEET_NAME = 'Leads'; // nome da aba na planilha

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
                  || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalho se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora', 'Cliente', 'Escritório', 'WhatsApp',
        'Contratos/mês', 'Faturamento Atual', 'Meta Contratos',
        'Meta Faturamento', 'Ticket Médio', 'Perda Mensal Estimada',
        'Potencial 6 Meses', 'Dores Marcadas', 'Pilares Ativados'
      ]);
    }

    sheet.appendRow([
      data.timestamp,
      data.cliente,
      data.escritorio,
      data.whatsapp,
      data.contratos,
      data.faturamento,
      data.metaContratos,
      data.metaFaturamento,
      data.ticketMedio,
      data.perdaMensal,
      data.potencial,
      data.dores,
      data.pilares
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
