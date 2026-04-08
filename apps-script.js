// Cole este código no Google Apps Script (script.google.com)
// vinculado à sua planilha do Google Sheets.
//
// Depois: Implantar → Nova implantação → Tipo: App da Web
//   - Executar como: Eu (sua conta)
//   - Quem tem acesso: Qualquer pessoa
// Copie a URL gerada e cole como variável de ambiente APPS_SCRIPT_URL no Vercel.

const SHEET_NAME = 'Leads'; // nome da aba na planilha

function doPost(e) {
  try {
    const p = e.parameter; // recebe form-urlencoded

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
      p.timestamp,
      p.cliente,
      p.escritorio,
      p.whatsapp,
      p.contratos,
      p.faturamento,
      p.metaContratos,
      p.metaFaturamento,
      p.ticketMedio,
      p.perdaMensal,
      p.potencial,
      p.dores,
      p.pilares
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
