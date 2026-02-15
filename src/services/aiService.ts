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

  const prompt = `You are Nyxer, an AI product prototyping assistant. Generate a complete prototype specification for:

${productIdea}

Respond with ONLY a JSON object (no markdown, no code blocks) with this exact structure:
{
  "content": "Brief description of what we're building",
  "code": [
    { "name": "filename.ext", "content": "full code content", "language": "javascript/python/c/arduino/cpp/etc" }
  ],
  "diagrams": [
    { "name": "diagram name", "content": "mermaid diagram code" }
  ],
  "instructions": [
    "Step 1: Do this...",
    "Step 2: Do that..."
  ],
  "parts": [
    { "name": "Component name", "quantity": 1, "description": "What it does" }
  ],
  "modelType": "simple/custom/hardware/robot/display/sensor"
}

IMPORTANT DIAGRAM GUIDELINES:
- For hardware projects: Create multiple diagrams including:
  1. System Architecture (flowchart showing data flow)
  2. Circuit Diagram (if applicable, show component connections)
  3. Component Layout (physical arrangement)
- For software projects: Create:
  1. Architecture Diagram (system components)
  2. Data Flow Diagram
  3. User Flow (if applicable)
- Use Mermaid syntax properly:
  - flowchart TD/LR for flowcharts
  - graph TD/LR for general graphs
  - sequenceDiagram for sequences
  - Use clear, descriptive node labels
  - Show connections with arrows and labels

For 3D model type:
- "simple" = basic geometric shapes
- "custom" = creative use of primitives
- "hardware" = circuit board/component style
- "robot" = robotic character with expressive features
- "display" = screen/monitor/device
- "sensor" = sensor module with indicator lights

For CODE:
- Provide complete, working code
- Include comments explaining key parts
- For Arduino/ESP32: include full setup() and loop()
- For Python: include imports and main execution
- Make it production-ready

Make it real, detailed, and immediately actionable.`

  if (provider === 'anthropic') {
    return generateWithAnthropic(apiKey, prompt, productIdea)
  } else if (provider === 'openai') {
    return generateWithOpenAI(apiKey, prompt, productIdea)
  } else {
    throw new Error(`Provider ${provider} not yet implemented`)
  }
}

async function generateWithAnthropic(apiKey: string, prompt: string, productIdea: string): Promise<GenerationResponse> {
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
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return parseResponse(data.content[0].text, productIdea)
}

async function generateWithOpenAI(apiKey: string, prompt: string, productIdea: string): Promise<GenerationResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
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
    // Try to find JSON in the response if it's wrapped in markdown or other text
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const parsed = JSON.parse(jsonStr)
    
    // Ensure the response isn't just echoing the prompt
    if (parsed.content === productIdea || (parsed.instructions && parsed.instructions.length === 0)) {
      throw new Error('AI returned empty or echoing response')
    }
    
    return {
      content: parsed.content || `Building: ${productIdea}`,
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
    content: `Generating prototype for: ${productIdea}`,
    code: [
      {
        id: `code-0-${Date.now()}`,
        name: 'prototype.js',
        content: `// ${productIdea}\n// Generated by Nyxer_\n\nconst config = {\n  product: "${productIdea}",\n  version: "1.0.0",\n  features: []\n};\n\nexport default config;`,
        type: 'code',
        language: 'javascript'
      }
    ],
    diagrams: [
      {
        id: `diagram-0-${Date.now()}`,
        name: 'System Overview',
        content: `graph TD\n    A[Input] --> B[Processing] --> C[Output]`,
        type: 'diagram'
      }
    ],
    instructions: [
      'Set up your development environment',
      'Copy the generated code',
      'Customize for your needs',
      'Deploy and test'
    ],
    parts: [
      { name: 'Microcontroller', quantity: 1, description: 'Main processing unit' },
      { name: 'Power Supply', quantity: 1, description: '5V USB or battery' }
    ],
    modelType: 'simple'
  }
}
