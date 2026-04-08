export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return res.status(500).json({ error: 'URL não configurada' });
  }

  try {
    const body = req.body;

    // Envia como form-urlencoded — Apps Script recebe via e.parameter
    const params = new URLSearchParams();
    Object.entries(body).forEach(([k, v]) => params.append(k, v));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      redirect: 'follow',
    });

    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    console.error('[salvar] erro:', err.message);
    return res.status(500).json({ error: 'Falha ao salvar', message: err.message });
  }
}
