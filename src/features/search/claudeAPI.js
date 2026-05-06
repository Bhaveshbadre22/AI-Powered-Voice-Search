const ENDPOINT = 'https://api.anthropic.com/v1/messages'

export async function searchWithClaudeAPI(products, query) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env')

  const trimmed = products.map(({ id, title, price, category }) => ({
    id,
    title,
    price,
    category,
  }))

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system:
        'You are a product search assistant. Return ONLY a valid JSON array, no markdown, no explanation.',
      messages: [
        {
          role: 'user',
          content:
            `Products: ${JSON.stringify(trimmed)}\n` +
            `Query: "${query}"\n` +
            `Return a JSON array of objects: [{"id": number, "reason": "one sentence why this matches the query"}]\n` +
            `Only include products that genuinely match. If nothing matches return [].`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText)
    throw new Error(`Claude API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data.content[0].text
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error(`No JSON array in Claude response: ${text}`)
  return JSON.parse(match[0])
}
