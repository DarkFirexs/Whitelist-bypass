export default async function handler(req, res) {
  const GITHUB_URL = "https://raw.githubusercontent.com/DarkFirexs/Whitelist-bypass/refs/heads/main/Whitelist";

  try {
    const response = await fetch(GITHUB_URL);
    const data = await response.text();
    const base64Data = Buffer.from(data).toString('base64');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(base64Data);
  } catch (error) {
    res.status(500).send("Error");
  }
}

