export default async function handler(req, res) {
  const { message } = req.body;
  
  const response = await fetch(
    https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    }
  );
  
  const data = await response.json();
  res.json({ response: data.candidates[0].content.parts[0].text });
}
