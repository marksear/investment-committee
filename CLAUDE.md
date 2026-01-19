# Investment Committee

AI-powered investment analysis tool using the Five Pillars framework (Graham, Buffett, Munger, Marks, Lynch).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Icons**: Lucide React

## Project Structure

```
app/
  api/analyze/route.js   # API endpoint for Claude analysis
  layout.js              # Root layout with metadata
  page.js                # Main page (renders InvestmentCommitteeApp)
  globals.css            # Global styles
components/
  InvestmentCommitteeApp.jsx  # Main multi-step form component
```

## Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Environment Variables

Required in `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

## Architecture

### Frontend Flow
1. Multi-step wizard collecting: holdings, monthly inputs, preferences
2. Market pulse display (hardcoded sentiment data from 40 sources)
3. Analysis triggers API call, shows progress animation
4. Results displayed with executive summary and trade recommendations

### API (`/api/analyze`)
- Receives form data and market pulse
- Builds structured prompt using Five Pillars framework
- Calls Claude (claude-sonnet-4-20250514) for analysis
- Parses response into mode, summary, trades, and full analysis

### Key Data Structures

**Form Data**: month, contribution, wrapper, broker, holdingsText, potentialsText, goldValue, btcValue, coreSatSplit, timeHorizon, marketSentiment, drawdownTrigger, usPermitted, btcPermitted, buildGold

**Analysis Result**: mode, summary, trades[], fullAnalysis

## Investment Framework

The Five Pillars doctrine:
- **Graham**: Value investing, margin of safety
- **Buffett**: Quality companies, competitive moats
- **Munger**: Risk inversion, avoid mistakes
- **Marks**: Market cycles, timing awareness
- **Lynch**: Understand what you own

Modes: LOW_RISK, BALANCED, AGGRESSIVE (based on triggers and sentiment)
