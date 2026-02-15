import { getDecryptedApiKey } from '../store/aiStore'

interface GenerationResponse {
  content: string
  code: Array<{ id: string; name: string; content: string; type: string; language: string }>
  diagrams: Array<{ id: string; name: string; content: string; type: string }>
  instructions: string[]
  parts?: Array<{ name: string; quantity: number; description: string }>
  modelType?: string
}

export async function generatePrototype(productIdea: string, provider: string): Promise<GenerationResponse> {
  const apiKey = getDecryptedApiKey()
  
  if (!apiKey) {
    throw new Error('API key not configured')
  }

  const systemPrompt = `You are Nyxer, an expert product engineer and architect. 
Your task is to turn a product idea into a complete, tangible prototype specification.
You MUST respond with a valid JSON object and NOTHING ELSE. Do not echo the user's prompt.
Provide deep, technical, and actionable content.`

  const userPrompt = `Generate a complete prototype for this idea: "${productIdea}"

The response must be a JSON object with this structure:
{
  "content": "A professional executive summary of the product architecture and technical approach.",
  "code": [
    { "name": "path/to/file.ext", "content": "Full source code", "language": "programming_language" }
  ],
  "diagrams": [
    { "name": "System Architecture", "content": "mermaid_code" }
  ],
  "instructions": [
    "Detailed step-by-step build guide..."
  ],
  "parts": [
    { "name": "Component", "quantity": 1, "description": "Purpose" }
  ],
  "modelType": "robot | hardware | display | sensor | custom"
}

Guidelines:
1. Code: Provide multiple files if necessary (e.g., main.ino, config.h, utils.cpp). Use realistic file paths.
2. Diagrams: Use Mermaid.js. Include at least a System Architecture flowchart.
3. 3D Model: Choose the most appropriate 'modelType'.
4. Content: Do NOT just repeat the prompt. Explain HOW it works.

Respond ONLY with the JSON object.`

  if (provider === 'anthropic') {
    return generateWithAnthropic(apiKey, systemPrompt, userPrompt, productIdea)
  } else if (provider === 'openai') {
    return generateWithOpenAI(apiKey, systemPrompt, userPrompt, productIdea)
  } else {
    throw new Error(`Provider ${provider} not yet implemented`)
  }
}

async function generateWithAnthropic(apiKey: string, systemPrompt: string, userPrompt: string, productIdea: string): Promise<GenerationResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return parseResponse(data.content[0].text, productIdea)
}

async function generateWithOpenAI(apiKey: string, systemPrompt: string, userPrompt: string, productIdea: string): Promise<GenerationResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4096,
      response_format: { type: "json_object" }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return parseResponse(data.choices[0].message.content, productIdea)
}

function parseResponse(content: string, productIdea: string): GenerationResponse {
  try {
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const parsed = JSON.parse(jsonStr)
    
    return {
      content: parsed.content || `Prototype for: ${productIdea}`,
      code: (parsed.code || []).map((c: any, idx: number) => ({
        id: `code-${idx}-${Date.now()}`,
        name: c.name || `file-${idx}`,
        content: c.content || '',
        type: 'code',
        language: c.language || 'javascript'
      })),
      diagrams: (parsed.diagrams || []).map((d: any, idx: number) => ({
        id: `diagram-${idx}-${Date.now()}`,
        name: d.name || `Diagram ${idx + 1}`,
        content: d.content || '',
        type: 'diagram'
      })),
      instructions: parsed.instructions || [],
      parts: parsed.parts || [],
      modelType: parsed.modelType || 'simple'
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
    return generateFallback(productIdea)
  }
}

function generateFallback(productIdea: string): GenerationResponse {
  return {
    content: `Technical breakdown for: ${productIdea}`,
    code: [
      {
        id: `code-0-${Date.now()}`,
        name: 'main.js',
        content: `// ${productIdea}\n// Generated by Nyxer_\n\nconsole.log("Initializing ${productIdea}...");`,
        type: 'code',
        language: 'javascript'
      }
    ],
    diagrams: [
      {
        id: `diagram-0-${Date.now()}`,
        name: 'System Overview',
        content: `graph TD\n    User[User] --> Input[Input Interface]\n    Input --> Logic[Core Logic]\n    Logic --> Output[Output Action]`,
        type: 'diagram'
      }
    ],
    instructions: [
      'Define the core requirements',
      'Select appropriate hardware/software stack',
      'Implement the logic provided in the code section',
      'Test and iterate'
    ],
    parts: [
      { name: 'Processor', quantity: 1, description: 'Main compute unit' }
    ],
    modelType: 'simple'
  }
}
