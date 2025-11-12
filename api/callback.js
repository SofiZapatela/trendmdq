export default async function handler(req, res) {
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
    const token = data.access_token;

    // 🔥 Enviamos HTML que hace la redirección desde el navegador
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <script>
            // Redirigir desde el navegador, preservando el hash
            window.location.href = "/admin/cms.html#access_token=${token}";
          </script>
        </head>
        <body>
          <p>Redirigiendo al panel...</p>
        </body>
      </html>
    `);
  } else {
    console.error('OAuth failed', data);
    res.status(400).json({ error: 'OAuth failed', details: data });
  }
}
