import crypto from 'crypto';

const PIXEL_ID = '1246267002971555';

function hashValue(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).toLowerCase().trim()).digest('hex');
}

async function sendCAPI(payload, req) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;

  const phone = payload.whatsapp ? payload.whatsapp.replace(/\D/g, '') : '';

  const eventData = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: payload.sourceUrl || req.headers.referer || '',
      action_source: 'website',
      user_data: {
        ph:  phone  ? [hashValue('+55' + phone)]  : undefined,
        fbc: payload.fbc  || undefined,
        fbp: payload.fbp  || undefined,
        client_ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
        client_user_agent: payload.userAgent || req.headers['user-agent'] || undefined,
      },
      custom_data: {
        content_name: 'Diagnóstico Laquila',
        content_category: 'Lead',
        value: 0,
        currency: 'BRL',
      },
    }],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) }
    );
    const json = await res.json().catch(() => null);
    console.log('[CAPI] resposta:', JSON.stringify(json));
  } catch (err) {
    console.error('[CAPI] erro:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return res.status(500).json({ error: 'URL do Apps Script não configurada' });
  }

  // Dispara CAPI em background (não bloqueia resposta)
  sendCAPI(req.body, req);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow',
    });

    const result = await response.json().catch(() => null) || await response.text();
    return res.status(200).json({ success: true, backend_response: result });

  } catch (err) {
    console.error('[salvar] erro:', err.message);
    return res.status(500).json({ error: 'Falha ao conectar com o Google Sheets', message: err.message });
  }
}
