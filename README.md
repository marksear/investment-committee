# AI Investment Committee

Make disciplined investment decisions using the wisdom of Graham, Buffett, Munger, Marks & Lynch.

## Features

- **Market Pulse**: Live sentiment aggregated from 40 UK and US financial sources
- **Five Pillars Framework**: Systematic analysis using proven investment principles
- **Three Committee Positions**: Aggressive, Balanced, and Low Risk perspectives
- **Personalised Recommendations**: Based on your holdings, goals, and risk tolerance

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Claude API (Anthropic)
- Vercel (deployment)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/investment-committee.git
cd investment-committee
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your-api-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy!

## Disclaimer

**Educational tool only.** This is not financial advice. You make all final investment decisions. Past performance does not guarantee future results.

## License

MIT
