// Market Pulse API - Generates sentiment scores from financial source analysis
// In production, this would fetch real data from financial news APIs

export async function GET() {
  try {
    const marketPulse = generateMarketPulse()
    return Response.json(marketPulse)
  } catch (error) {
    console.error('Market pulse error:', error)
    return Response.json(
      { error: 'Failed to fetch market pulse' },
      { status: 500 }
    )
  }
}

function generateMarketPulse() {
  // UK Sources - Financial publications and platforms
  const ukSources = [
    { name: 'Financial Times', baseScore: 6 },
    { name: 'The Times', baseScore: 5 },
    { name: 'The Guardian', baseScore: 4 },
    { name: 'Telegraph', baseScore: 6 },
    { name: 'BBC Business', baseScore: 5 },
    { name: 'Sky News Business', baseScore: 6 },
    { name: 'Reuters UK', baseScore: 6 },
    { name: 'Bloomberg UK', baseScore: 7 },
    { name: 'Investors Chronicle', baseScore: 5 },
    { name: 'Shares Magazine', baseScore: 6 },
    { name: 'This Is Money', baseScore: 5 },
    { name: 'MoneyWeek', baseScore: 7 },
    { name: 'AJ Bell', baseScore: 6 },
    { name: 'Hargreaves Lansdown', baseScore: 6 },
    { name: 'Interactive Investor', baseScore: 5 },
    { name: 'Citywire', baseScore: 6 },
    { name: 'Trustnet', baseScore: 5 },
    { name: 'Morningstar UK', baseScore: 6 },
    { name: 'CNBC Europe', baseScore: 6 },
    { name: 'MarketWatch UK', baseScore: 5 },
  ]

  // US Sources - Financial publications and platforms
  const usSources = [
    { name: 'Wall Street Journal', baseScore: 7 },
    { name: 'New York Times', baseScore: 6 },
    { name: 'Bloomberg', baseScore: 8 },
    { name: 'CNBC', baseScore: 7 },
    { name: 'Reuters', baseScore: 7 },
    { name: 'MarketWatch', baseScore: 7 },
    { name: 'Barrons', baseScore: 8 },
    { name: 'Forbes', baseScore: 7 },
    { name: 'Financial Times US', baseScore: 6 },
    { name: 'Yahoo Finance', baseScore: 7 },
    { name: 'Investors Business Daily', baseScore: 8 },
    { name: 'Seeking Alpha', baseScore: 7 },
    { name: 'Motley Fool', baseScore: 7 },
    { name: 'Kiplinger', baseScore: 6 },
    { name: 'CNN Business', baseScore: 7 },
    { name: 'Fox Business', baseScore: 8 },
    { name: 'The Street', baseScore: 7 },
    { name: 'Benzinga', baseScore: 8 },
    { name: 'Zacks', baseScore: 7 },
    { name: 'Morningstar US', baseScore: 6 },
  ]

  // Headlines that vary based on sentiment
  const ukHeadlines = {
    bullish: [
      'FTSE 100 rallies on rate cut optimism',
      'UK stocks attract foreign investment',
      'Sterling strengthens amid positive data',
      'London market outperforms expectations',
      'British equities show resilience',
    ],
    neutral: [
      'FTSE 100 holds gains amid uncertainty',
      'UK economy shows mixed signals',
      'Markets await BoE decision',
      'Investors cautious on UK outlook',
      'FTSE treads water in quiet session',
    ],
    bearish: [
      'FTSE 100 slips on growth concerns',
      'UK stocks face headwinds',
      'Sterling weakness weighs on markets',
      'Recession fears hit UK equities',
      'London market underperforms peers',
    ],
  }

  const usHeadlines = {
    bullish: [
      'S&P 500 eyes new record highs',
      'Tech rally drives market gains',
      'Bull market extends into new territory',
      'Wall Street optimism at multi-year high',
      'AI boom fuels equity rally',
    ],
    neutral: [
      'Markets mixed ahead of Fed decision',
      'S&P 500 consolidates recent gains',
      'Investors weigh growth vs inflation',
      'Wall Street awaits earnings clarity',
      'US stocks tread carefully',
    ],
    bearish: [
      'S&P 500 retreats on rate concerns',
      'Tech selloff weighs on markets',
      'Valuation concerns hit Wall Street',
      'US stocks face correction fears',
      'Market breadth narrows sharply',
    ],
  }

  // Generate scores with slight randomness around base
  const generateSourceData = (sources, headlines) => {
    return sources.map(source => {
      // Add randomness: -2 to +2 from base score, clamped to 1-10
      const variance = Math.floor(Math.random() * 5) - 2
      const sentiment = Math.max(1, Math.min(10, source.baseScore + variance))

      // Select headline based on sentiment
      let headlineSet
      if (sentiment >= 7) headlineSet = headlines.bullish
      else if (sentiment >= 4) headlineSet = headlines.neutral
      else headlineSet = headlines.bearish

      const headline = headlineSet[Math.floor(Math.random() * headlineSet.length)]

      return {
        name: source.name,
        sentiment,
        headline,
      }
    })
  }

  const ukSourceData = generateSourceData(ukSources, ukHeadlines)
  const usSourceData = generateSourceData(usSources, usHeadlines)

  // Calculate average scores
  const ukScore = ukSourceData.reduce((sum, s) => sum + s.sentiment, 0) / ukSourceData.length
  const usScore = usSourceData.reduce((sum, s) => sum + s.sentiment, 0) / usSourceData.length

  // Generate change values (simulating daily movement)
  const ukChange = (Math.random() * 1.2 - 0.4).toFixed(1)
  const usChange = (Math.random() * 1.2 - 0.4).toFixed(1)

  // Determine labels based on score
  const getLabel = (score) => {
    if (score <= 2) return 'Very Bearish'
    if (score <= 3.5) return 'Bearish'
    if (score <= 4.5) return 'Slightly Bearish'
    if (score <= 5.5) return 'Neutral'
    if (score <= 6.5) return 'Cautiously Optimistic'
    if (score <= 8) return 'Bullish'
    return 'Very Bullish'
  }

  // Format timestamp
  const now = new Date()
  const hours = now.getHours()
  const lastUpdated = hours < 12 ? 'This morning' : hours < 17 ? 'This afternoon' : 'This evening'

  return {
    uk: {
      score: Math.round(ukScore * 10) / 10,
      label: getLabel(ukScore),
      change: (parseFloat(ukChange) >= 0 ? '+' : '') + ukChange,
      changeDirection: parseFloat(ukChange) >= 0 ? 'up' : 'down',
      lastUpdated,
      sources: ukSourceData,
    },
    us: {
      score: Math.round(usScore * 10) / 10,
      label: getLabel(usScore),
      change: (parseFloat(usChange) >= 0 ? '+' : '') + usChange,
      changeDirection: parseFloat(usChange) >= 0 ? 'up' : 'down',
      lastUpdated,
      sources: usSourceData,
    },
  }
}
