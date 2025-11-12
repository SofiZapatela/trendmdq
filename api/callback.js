/*export default async function handler(req, res) {
  const { code } = req.query;

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const data = await response.json();

  if (data.access_token) {
    // 🔥 importante: redirigir al CMS con el token
    //res.redirect(`/admin/cms.html#access_token=${data.access_token}`);
    res.redirect(`/admin/#access_token=${data.access_token}`);
  } else {
    console.error('OAuth failed', data);
    res.status(400).json({ error: 'OAuth failed', details: data });
  }
}*/

// /api/callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();
    console.log("GitHub OAuth response:", data);

    if (data.access_token) {
      // Redirigir correctamente al CMS
      res.redirect(`/admin/#access_token=${data.access_token}`);
    } else {
      res.status(400).json({ error: 'OAuth failed', details: data });
    }
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}

