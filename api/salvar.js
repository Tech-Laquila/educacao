export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return res.status(500).json({ error: 'URL do Apps Script não configurada nas variáveis de ambiente' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow', // Importante para o Google Apps Script
    });

    const result = await response.json().catch(() => null) || await response.text();
    
    // Repassa o status do Apps Script para facilitar debug
    return res.status(200).json({ 
      success: true, 
      backend_response: result 
    });
    
  } catch (err) {
    console.error('[salvar] erro:', err.message);
    return res.status(500).json({ error: 'Falha ao conectar com o Google Sheets', message: err.message });
  }
}
