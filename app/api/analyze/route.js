import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { formData, marketPulse } = await request.json()

    // Build the full Investment Committee prompt
    const prompt = buildFullPrompt(formData, marketPulse)

    // Call Claude API with extended token limit for comprehensive analysis
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16384,
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

function buildFullPrompt(formData, marketPulse) {
  const hasPotentials = formData.potentialsText && formData.potentialsText.trim().length > 0

  return `# TheMoneyProgram — Investment Committee Analysis
## UK Full Mode — Graham • Buffett • Munger • Howard Marks • Peter Lynch

You are an AI Investment Committee applying the Five Pillars framework to make disciplined investment decisions.

**Design goal:** Every buy/sell decision must be *readable, auditable, and explainable in plain English*.

---

# EDUCATION-ONLY DISCLAIMER
This is educational decision-support, not regulated advice. The user makes the final decision and bears all risk.

---

# THE FIVE PILLARS DOCTRINE

## PILLAR 1: GRAHAM — Margin of Safety (MoS)
- Must articulate a Margin of Safety: Valuation MoS, Balance-sheet MoS, or Structural MoS
- **Graham's 7 Tests:** Adequate size, Strong financial condition (CR≥2), Earnings stability (5yr), Dividend record (10yr), Earnings growth (33% over 10yr), Moderate P/E (≤15), Moderate P/B (≤1.5), Graham Number (P/E × P/B ≤22.5)
- If MoS cannot be stated plainly → must be SATELLITE or rejected

## PILLAR 2: BUFFETT — Quality & Compounding
Before any CORE or single-stock buy, confirm:
1. Understandability (explain in 2 sentences)
2. Moat type (switching costs / network effects / brand / cost advantage / regulation / scale)
3. Pricing power evidence
4. Capital efficiency (ROIC > WACC)
5. Free cash flow quality
6. Owner-oriented management
7. Reinvestment runway

## PILLAR 3: MUNGER — Inversion, Discipline, and "Don't Die"
Every candidate must include:
- **Inversion Test:** "How could this permanently impair capital?"
- **Seductive Story Check:** what's likely misleading
- **Base-rate Check:** what typically happens to similar assets
- **Overconfidence Check:** what we're underestimating
**Default action = inaction.** Any trade must justify why doing nothing is inferior this month.

## PILLAR 4: MARKS — Cycles & Second-Level Thinking
- Cycle positioning: risk appetite / credit conditions / breadth
- What's priced in?
- Second-level question: "What do I believe that the market doesn't?"
- Risk control: "How are we avoiding being forced sellers?"

## PILLAR 5: LYNCH — Know What You Own
- **Lynch Label:** Stalwart / Fast Grower / Cyclic / Turnaround / Asset Play / Slow Grower
- Plain-English driver of earnings/FCF
- What must go right? What would show we're wrong early?

---

## DIVIDEND INCOME CRITERIA (When "Seek dividend income" = Yes)
If the user is seeking dividend income, prioritise quality dividend stocks with:
- **Dividend Track Record:** 10+ years of consistent dividends (ideally growing)
- **Dividend Cover:** Earnings per share ≥ 2x dividend per share
- **Payout Ratio:** Sustainable payout ratio (<70% for most sectors, <90% for REITs/utilities)
- **Yield Quality:** Current yield vs 5-year average (prefer fair/undervalued yields)
- **Sector Diversification:** Spread across defensive sectors (utilities, consumer staples, healthcare)
- **Growth + Income:** Favour "dividend growers" over highest yielders (dividend aristocrats concept)
- **Graham's Test #4:** Dividend record of 10+ consecutive years weighs heavily

When seeking dividends, recommend a mix of:
1. **UK Dividend ETFs:** VHYL, IUKD, or similar
2. **Individual Dividend Aristocrats:** Quality UK companies with long dividend histories
3. **High-yield defensive stocks:** Utilities, telecoms, consumer staples with sustainable yields

---

# INPUTS FOR THIS MONTH

| Input | Value |
|-------|-------|
| Month | ${formData.month} |
| Monthly contribution | £${formData.contribution} |
| Account wrapper | ${formData.wrapper} |
| Broker | ${formData.broker} |
| Time horizon | ${formData.timeHorizon} years |
| Core/Satellite target | ${formData.coreSatSplit} |
| Drawdown trigger | ${formData.drawdownTrigger}% |
| User sentiment | ${formData.marketSentiment}/10 |
| US assets permitted | ${formData.usPermitted ? 'Yes' : 'No'} |
| Seek dividend income | ${formData.seekDividends ? 'Yes - prioritise quality dividend stocks' : 'No'} |

**Market Pulse:**
- UK: ${marketPulse.uk.score}/10 (${marketPulse.uk.label})
- US: ${marketPulse.us.score}/10 (${marketPulse.us.label})

---

# CURRENT HOLDINGS

${formData.holdingsText || 'No holdings provided - this appears to be a new portfolio.'}

---

${hasPotentials ? `# STOCKS TO INVESTIGATE (Run Deep Analysis)

${formData.potentialsText}

For each stock above, run the STOCK INVESTIGATION PROTOCOL:
1. Company Snapshot (sector, market cap, business description)
2. Lynch Classification with justification
3. Graham's 7 Tests with scores
4. Buffett Quality Checklist (moat, pricing power, ROIC, FCF, management)
5. Munger Inversion Analysis (3 scenarios of permanent capital impairment)
6. Marks Second-Level Thinking (what's priced in, cycle positioning)
7. Valuation Summary (multiple methods)
8. Star Rating (⭐ to ⭐⭐⭐⭐⭐) based on weighted score
9. Final Verdict with price targets

---` : ''}

# REQUIRED OUTPUT

## PART A — TRIGGER SCAN + MODE SELECTION

**Trigger Status:**
- **L1 (Drawdown >${formData.drawdownTrigger}%):** Yes/No — [Justification]
- **L2 (User anxious):** Yes/No — Based on sentiment ${formData.marketSentiment}/10
- **L3 (Near-term cash need):** Yes/No — [Justification]
- **A1 (Equities down ≥10% from 52-week high):** Yes/No — [Justification]
- **A2 (Portfolio at ATH + 3 months consistent):** Yes/No — [Justification]

**Sentiment/Pendulum assessment:** Where are we on fear-greed spectrum? (1-10)
**Mode this month:** Aggressive / Balanced / Low Risk
**Munger Inversion:** "The biggest risk this month would be..."

---

## PART B — HOLDINGS REVIEW

For each holding, provide:

**[Holding Name] ([Ticker])**
- Current %: X%
- Category: CORE / SATELLITE
- Lynch Label: [Stalwart/Fast Grower/Cyclic/etc.]
- Doctrine Fit: Strong / Moderate / Weak
- Still Meets Mandate: Yes / No
- Red Flags: [List any concerns or "None"]
- Action: HOLD / SELL / ADD

[Repeat for each holding...]

**Summary:** X reviewed. Y flagged. Z recommended for exit.

---

${hasPotentials ? `## PART C — STOCK INVESTIGATIONS

For each potential stock, provide:

### [TICKER] — [Company Name]

**Company Snapshot:**
- Sector/Industry: ...
- Market Cap: ...
- Business (2 sentences): ...

**Lynch Classification:** [Label] — [Justification]

**Graham's 7 Tests:**
1. **Adequate Size** (Revenue >£250m): [Actual] — Pass/Fail
2. **Financial Condition** (Current Ratio ≥2.0): [Actual] — Pass/Fail
3. **Earnings Stability** (Positive EPS 5yr): [Actual] — Pass/Fail
4. **Dividend Record** (10+ years): [Actual] — Pass/Fail
5. **Earnings Growth** (≥33% over 10yr): [Actual] — Pass/Fail
6. **Moderate P/E** (≤15): [Actual] — Pass/Fail
7. **Moderate P/B** (≤1.5): [Actual] — Pass/Fail
8. **Graham Number** (P/E × P/B ≤22.5): [Actual] — Pass/Fail

**Graham Score: X/7**

**Buffett Quality Check:**
- Moat: [Type] — [Strength: Strong/Moderate/Weak]
- Pricing Power: [Evidence]
- ROIC vs WACC: ...
- FCF Quality: ...
- Management: ...

**Munger Inversion (How could this go to zero?):**
1. [Scenario 1]
2. [Scenario 2]
3. [Scenario 3]

**Marks Analysis:**
- What consensus believes: ...
- What's priced in: ...
- Cycle position: ...

**Valuation:**
- Graham Number: £...
- Current Price: £...
- Margin of Safety: ...%

**VERDICT:**
- Graham (Value): X/10
- Buffett (Quality): X/10
- Munger (Risk): X/10
- Marks (Timing): X/10
- Lynch (Clarity): X/10
- **Overall: X/10**

**Star Rating:** ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐ / ⭐⭐⭐ / ⭐⭐ / ⭐
**Action:** Add to Shortlist / Watchlist / Pass
**Suitable as:** CORE / SATELLITE / Neither

---` : ''}

## PART D — THREE COMMITTEE POSITIONS

### AGGRESSIVE POSITION
**Execution Plan:**
- Trade(s): ...
- Amounts: ...
- Rationale (citing doctrine): ...

### BALANCED POSITION
**Execution Plan:**
- Trade(s): ...
- Amounts: ...
- Rationale (citing doctrine): ...

### LOW RISK POSITION
**Execution Plan:**
- Trade(s): ...
- Amounts: ...
- Rationale (citing doctrine): ...

---

## PART E — MUNGER VETO CHECK

- **V1: Cap compliance** — Pass/Fail — [Evidence]
- **V2: Thesis articulation** — Pass/Fail — [Evidence]
- **V3: Single stock due diligence** — Pass/Fail/N/A — [Evidence]
- **V4: Inversion check** — Pass/Fail — [Evidence]
- **V5: Circle of competence** — Pass/Fail — [Evidence]

---

## PART F — CHAIR SYNTHESIS

**Pre-Flight Checklist:**
- [ ] Wrapper confirmed + limits tracked
- [ ] Trades within cost rule (1-2 max)
- [ ] Position/sector limits checked
- [ ] Core vs satellite respected
- [ ] Doctrine check complete
- [ ] Munger veto passed

**FINAL PLAN — "This month we will:"**

- **Trade 1:** [Ticker] — £[Amount] — CORE/SATELLITE
- **Trade 2 (if any):** [Ticker] — £[Amount] — CORE/SATELLITE
- **Gold (if applicable):** SGLN/PHAU — £[Amount] — Buy/No

**Total deployed:** £...

**What I'm NOT Doing This Month + Why:**
- [2-3 lines referencing doctrine/cost/limits]

**Why This Wins (vs other positions):**
- vs Aggressive: ...
- vs Low Risk: ...

**Red Team (How this could fail):**
1. ...
2. ...
3. ...

---

## PART G — DECISION JOURNAL ENTRY

- **Month/date:** ${formData.month}
- **Mode:** [Selected mode]
- **Trades executed:** [List]
- **Gold:** Buy / No
- **Dividend focus:** Yes / No
- **1-sentence thesis:** "[Your thesis]"
- **Risks:**
  1. [Risk 1]
  2. [Risk 2]
- **What changes my mind:** [Trigger]
- **Watch next month:**
  1. [Item 1]
  2. [Item 2]
- **Confidence:** Low / Medium / High
- **Munger Veto Status:** All Pass / [List failures]

---

## PART H — STRUCTURED DATA (REQUIRED)

**IMPORTANT: You MUST include this JSON block at the very end of your response. This is used for parsing and displaying the results.**

\`\`\`json
{
  "mode": "Balanced",
  "summary": "This month we deploy £500 into VWRL (£350) and VMID (£150), maintaining our 85/15 Core/Satellite split...",
  "triggers": [
    { "id": "L1", "name": "Drawdown >8%", "status": false, "justification": "No existing positions to measure drawdown" },
    { "id": "L2", "name": "User anxious", "status": false, "justification": "Sentiment 5/10 is neutral territory" },
    { "id": "L3", "name": "Near-term cash need", "status": false, "justification": "10-year horizon confirmed" },
    { "id": "A1", "name": "Equities down ≥10%", "status": false, "justification": "Markets near highs" },
    { "id": "A2", "name": "Portfolio at ATH", "status": false, "justification": "New portfolio starting" }
  ],
  "sentimentScore": 7,
  "sentimentAssessment": "Markets bullish but user sentiment moderate - warrants balanced approach",
  "mungerInversion": "The biggest risk this month would be chasing momentum at market peaks without adequate margin of safety",
  "trades": [
    {
      "ticker": "VWRL",
      "name": "Vanguard FTSE All-World UCITS ETF",
      "amount": "350",
      "action": "BUY",
      "category": "CORE",
      "wrapper": "ISA",
      "rationale": [
        "Graham: Global diversification provides margin of safety through broad market exposure",
        "Buffett: Quality via access to world's best companies at 0.22% fee",
        "Lynch: Understandable - own a piece of the global economy"
      ]
    }
  ],
  "holdingsReview": {
    "totalReviewed": 5,
    "flagged": 1,
    "recommendedForExit": 0,
    "holdings": [
      {
        "name": "Vanguard FTSE All-World",
        "ticker": "VWRL",
        "currentPercent": "60%",
        "category": "CORE",
        "lynchLabel": "Index",
        "doctrineFit": "Strong",
        "meetsMandate": true,
        "redFlags": [],
        "action": "HOLD"
      }
    ]
  },
  "mungerVeto": [
    { "id": "V1", "name": "Cap compliance", "status": "Pass", "evidence": "Within £1200 monthly limit" },
    { "id": "V2", "name": "Thesis articulation", "status": "Pass", "evidence": "Clear dividend-focused strategy" },
    { "id": "V3", "name": "Single stock due diligence", "status": "N/A", "evidence": "ETFs only this month" },
    { "id": "V4", "name": "Inversion check", "status": "Pass", "evidence": "Identified key risk of overpaying" },
    { "id": "V5", "name": "Circle of competence", "status": "Pass", "evidence": "Broad-based ETFs within understanding" }
  ],
  "decisionJournal": {
    "month": "${formData.month}",
    "mode": "Balanced",
    "tradesExecuted": "VWRL £350, VMID £150",
    "goldAction": "No",
    "dividendFocus": true,
    "thesis": "Build core global equity exposure with growth tilt via UK mid-caps",
    "risks": ["Market timing risk at current valuations", "Currency exposure in global ETF"],
    "whatChanges": "Significant market correction would trigger more aggressive deployment",
    "watchNextMonth": ["UK inflation data", "Fed rate decision impact"],
    "confidence": "Medium",
    "vetoStatus": "All Pass"
  },
  "chairDecision": "Deploy full £500 contribution into core global equity exposure, maintaining defensive posture given current market conditions.",
  "pillarReminder": "Graham: 'In the short run, the market is a voting machine but in the long run it is a weighing machine.' Stay disciplined.",
  "totalDeployed": "500",
  "confidence": "Medium"
}
\`\`\`

Replace ALL example values with your actual analysis. The JSON must be valid and parseable. Include ALL triggers, ALL holdings, ALL veto checks, and ALL recommended trades. IMPORTANT: The "rationale" field MUST be an array of strings referencing relevant pillars (Graham, Buffett, Munger, Marks, or Lynch).

---

Be specific, practical, and tie everything back to the Five Pillars framework. Use real data where possible and mark assumptions as **NEEDS CHECK**.`
}

function parseResponse(responseText) {
  // First, try to extract structured JSON data (most reliable)
  const jsonData = extractJsonData(responseText)

  const result = {
    mode: jsonData?.mode || extractMode(responseText),
    summary: jsonData?.summary || extractSummary(responseText),
    trades: jsonData?.trades || extractTrades(responseText),
    // New structured data from JSON
    triggers: jsonData?.triggers || null,
    sentimentScore: jsonData?.sentimentScore || null,
    sentimentAssessment: jsonData?.sentimentAssessment || null,
    mungerInversion: jsonData?.mungerInversion || null,
    holdingsReviewData: jsonData?.holdingsReview || null,
    mungerVetoData: jsonData?.mungerVeto || null,
    decisionJournalData: jsonData?.decisionJournal || null,
    // Keep formatted versions for backwards compatibility
    holdingsReview: jsonData?.holdingsReview ? formatHoldingsReview(jsonData.holdingsReview) : (extractSection(responseText, 'PART B', 'PART C') || extractSection(responseText, 'HOLDINGS REVIEW', 'PART C')),
    chairDecision: jsonData?.chairDecision || null,
    pillarReminder: jsonData?.pillarReminder || null,
    totalDeployed: jsonData?.totalDeployed || null,
    confidence: jsonData?.confidence || null,
    // Raw text sections as fallback
    triggerScan: extractSection(responseText, 'PART A', 'PART B') || extractSection(responseText, 'TRIGGER SCAN', 'PART B'),
    investigations: extractSection(responseText, 'STOCK INVESTIGATIONS', 'PART D') || extractSection(responseText, 'PART C', 'PART D'),
    committeePositions: extractSection(responseText, 'PART D', 'PART E') || extractSection(responseText, 'THREE COMMITTEE POSITIONS', 'PART E'),
    mungerVeto: extractSection(responseText, 'PART E', 'PART F') || extractSection(responseText, 'MUNGER VETO', 'PART F'),
    chairSynthesis: extractSection(responseText, 'PART F', 'PART G') || extractSection(responseText, 'CHAIR SYNTHESIS', 'PART G'),
    decisionJournal: extractSection(responseText, 'PART G', 'PART H') || extractSection(responseText, 'DECISION JOURNAL', 'PART H'),
    fullAnalysis: responseText
  }

  return result
}

// Extract JSON data block from response
function extractJsonData(text) {
  try {
    // Look for JSON code block
    const jsonMatch = text.match(/```json\s*\n?([\s\S]*?)\n?```/i)
    if (jsonMatch && jsonMatch[1]) {
      const jsonStr = jsonMatch[1].trim()
      const data = JSON.parse(jsonStr)
      console.log('Successfully parsed JSON data:', data)
      return data
    }
  } catch (error) {
    console.error('Failed to parse JSON data:', error.message)
  }
  return null
}

// Format holdings review from JSON to display string
function formatHoldingsReview(holdingsData) {
  if (!holdingsData) return null

  let text = `**Holdings Review Summary:**\n`
  text += `- Total Reviewed: ${holdingsData.totalReviewed || 0}\n`
  text += `- Flagged: ${holdingsData.flagged || 0}\n`
  text += `- Recommended for Exit: ${holdingsData.recommendedForExit || 0}\n\n`

  if (holdingsData.holdings && holdingsData.holdings.length > 0) {
    text += `| Holding | % | Category | Lynch Label | Doctrine Fit | Action |\n`
    text += `|---------|---|----------|-------------|--------------|--------|\n`
    for (const h of holdingsData.holdings) {
      text += `| ${h.ticker} | ${h.currentPercent} | ${h.category} | ${h.lynchLabel} | ${h.doctrineFit} | ${h.action} |\n`
    }
  }

  return text
}

function extractMode(text) {
  // Look for mode in various formats
  const modePatterns = [
    /Mode this month:\s*(Aggressive|Balanced|Low Risk)/i,
    /\*\*Mode\*\*[:\s]*(Aggressive|Balanced|Low Risk)/i,
    /Mode[:\s]*(Aggressive|Balanced|Low Risk)/i,
    /(AGGRESSIVE|BALANCED|LOW RISK)\s*MODE/i
  ]

  for (const pattern of modePatterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
    }
  }
  return 'Balanced'
}

function extractSummary(responseText) {
  // Try to get the chair synthesis final plan or executive summary
  const chairMatch = responseText.match(/This month we will:[\s\S]*?(?=\*\*What I'm NOT|What I'm NOT|---|\n\n\*\*)/i)
  if (chairMatch) {
    return chairMatch[0].trim()
  }

  // Fallback to first substantial paragraph
  const paragraphs = responseText.split('\n\n').filter(p => p.length > 100)
  return paragraphs[0]?.substring(0, 500) || 'Analysis complete. Review full report below.'
}

function extractSection(text, startMarker, endMarker) {
  const startPatterns = [
    new RegExp(`## ${startMarker}[\\s\\S]*?(?=## ${endMarker}|$)`, 'i'),
    new RegExp(`### ${startMarker}[\\s\\S]*?(?=### ${endMarker}|## ${endMarker}|$)`, 'i'),
    new RegExp(`${startMarker}[\\s\\S]*?(?=${endMarker}|$)`, 'i')
  ]

  for (const pattern of startPatterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }
  return null
}

function extractTrades(text) {
  const trades = []

  // Look for the final plan table
  const finalPlanMatch = text.match(/This month we will:[\s\S]*?\|[\s\S]*?\|[\s\S]*?(?=\*\*Total|\n\n)/i)

  if (finalPlanMatch) {
    const tableLines = finalPlanMatch[0].split('\n').filter(line => line.includes('|') && !line.includes('---'))

    for (const line of tableLines) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c)
      if (cells.length >= 3 && cells[1] && !cells[0].toLowerCase().includes('item') && !cells[0].toLowerCase().includes('ticker')) {
        const amountMatch = cells[2]?.match(/£([\d,]+)/)
        if (amountMatch || cells[1].match(/[A-Z]{2,5}/)) {
          trades.push({
            ticker: cells[1],
            name: cells[0],
            amount: amountMatch ? amountMatch[1].replace(',', '') : '0',
            rationale: cells[3] || ''
          })
        }
      }
    }
  }

  // Also look for **TICKER** format
  const tickerMatches = text.matchAll(/\*\*([A-Z0-9]{2,6})\*\*\s*[-–—]\s*([^\n]+)/g)
  for (const match of tickerMatches) {
    const existingTrade = trades.find(t => t.ticker === match[1])
    if (!existingTrade) {
      const amountLine = text.substring(match.index, match.index + 500)
      const amountMatch = amountLine.match(/Amount:\s*£([\d,]+)/i)
      const rationaleMatch = amountLine.match(/Rationale:\s*([^\n]+)/i)

      trades.push({
        ticker: match[1],
        name: match[2].trim(),
        amount: amountMatch ? amountMatch[1].replace(',', '') : '0',
        rationale: rationaleMatch ? rationaleMatch[1].trim() : ''
      })
    }
  }

  return trades.filter(t => t.ticker && t.ticker !== 'Ticker' && t.ticker !== '...')
}
