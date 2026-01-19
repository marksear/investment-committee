import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { formData, marketPulse } = await request.json()

    // Build the prompt
    const prompt = buildPrompt(formData, marketPulse)

    // Call Claude API
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Parse the response
    const responseText = message.content[0].text
    const result = parseResponse(responseText)

    return Response.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    )
  }
}

function buildPrompt(formData, marketPulse) {
  return `You are an AI Investment Committee applying the Five Pillars framework (Graham, Buffett, Munger, Marks, Lynch) to make disciplined investment decisions.

## CONTEXT

**Month:** ${formData.month}
**New Contribution:** £${formData.contribution}
**Account:** ${formData.wrapper} at ${formData.broker}
**Time Horizon:** ${formData.timeHorizon} years
**Core/Satellite Target:** ${formData.coreSatSplit}
**Drawdown Trigger:** ${formData.drawdownTrigger}%
**User Sentiment:** ${formData.marketSentiment}/10 (${formData.marketSentiment <= 4 ? 'Cautious' : formData.marketSentiment <= 6 ? 'Balanced' : 'Aggressive'})
**US Assets Permitted:** ${formData.usPermitted ? 'Yes' : 'No'}
**Bitcoin Permitted:** ${formData.btcPermitted ? 'Yes' : 'No'}
**Build Gold:** ${formData.buildGold ? 'Yes' : 'No'}

**Market Pulse:**
- UK: ${marketPulse.uk.score}/10 (${marketPulse.uk.label})
- US: ${marketPulse.us.score}/10 (${marketPulse.us.label})

**Current Holdings:**
${formData.holdingsText || 'No holdings provided'}

**Stocks to Investigate:**
${formData.potentialsText || 'None specified'}

**Physical Gold Value:** £${formData.goldValue}
**Bitcoin Value:** £${formData.btcValue}

## YOUR TASK

1. **Determine Mode**: Based on triggers and sentiment, are we in LOW_RISK, BALANCED, or AGGRESSIVE mode?

2. **Review Holdings**: For each holding, assess doctrine fit (Graham value, Buffett quality, Munger risk, Marks timing, Lynch clarity)

3. **Investigate Potentials**: If stocks to investigate were provided, run a mini-analysis on each using the Five Pillars

4. **Make Recommendations**: Provide specific trade recommendations with:
   - Exact amounts in £
   - Rationale tied to doctrine
   - What we're NOT doing and why

5. **One-Line Thesis**: Summarise the month's strategy in one sentence

## OUTPUT FORMAT

Please structure your response as follows:

### MODE
[State the mode and why]

### EXECUTIVE SUMMARY
[2-3 sentences summarising what to do this month]

### RECOMMENDED TRADES
For each trade:
- **[TICKER]** - [Name]
- Amount: £[amount]
- Rationale: [why, tied to doctrine]

### WHAT WE'RE NOT DOING
[List things we're avoiding and why]

### HOLDINGS REVIEW
[Brief doctrine check on each existing holding]

### INVESTIGATIONS
[If potentials provided, mini Five Pillars analysis on each]

### DECISION JOURNAL ENTRY
- Mode: [mode]
- Confidence: [Low/Medium/High]
- One-line thesis: "[thesis]"

Be specific, practical, and tie everything back to the Five Pillars framework.`
}

function parseResponse(responseText) {
  // Extract key sections from the response
  const result = {
    mode: extractSection(responseText, 'MODE') || 'Balanced',
    summary: extractSection(responseText, 'EXECUTIVE SUMMARY') || responseText.substring(0, 500),
    trades: extractTrades(responseText),
    fullAnalysis: responseText
  }

  return result
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`### ${sectionName}\\s*([\\s\\S]*?)(?=###|$)`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractTrades(text) {
  const trades = []
  const tradesSection = extractSection(text, 'RECOMMENDED TRADES')
  
  if (tradesSection) {
    // Simple extraction - look for ticker patterns and amounts
    const lines = tradesSection.split('\n')
    let currentTrade = null
    
    for (const line of lines) {
      // Look for ticker line (e.g., "**VWRP** - Vanguard...")
      const tickerMatch = line.match(/\*\*([A-Z0-9]+)\*\*\s*[-–]\s*(.+)/)
      if (tickerMatch) {
        if (currentTrade) trades.push(currentTrade)
        currentTrade = {
          ticker: tickerMatch[1],
          name: tickerMatch[2].trim(),
          amount: 0,
          rationale: ''
        }
      }
      
      // Look for amount
      const amountMatch = line.match(/Amount:\s*£([\d,]+)/)
      if (amountMatch && currentTrade) {
        currentTrade.amount = amountMatch[1].replace(',', '')
      }
      
      // Look for rationale
      const rationaleMatch = line.match(/Rationale:\s*(.+)/)
      if (rationaleMatch && currentTrade) {
        currentTrade.rationale = rationaleMatch[1].trim()
      }
    }
    
    if (currentTrade) trades.push(currentTrade)
  }
  
  return trades
}
