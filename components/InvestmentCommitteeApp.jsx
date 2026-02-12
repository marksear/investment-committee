'use client'

import React, { useState, useEffect } from 'react'
import {
  Upload, FileText, TrendingUp, Shield, Brain, ChevronRight, ChevronLeft,
  Check, AlertCircle, Loader2, BarChart3, PieChart, BookOpen, Star,
  AlertTriangle, Download, Share2, ChevronDown, Target, Scale, Eye,
  Lightbulb, XCircle, TrendingDown, ArrowUpRight, ShieldAlert, Zap,
  Rocket, Globe, Newspaper, BarChart2, RefreshCw, CheckCircle, X
} from 'lucide-react'

// Render trigger status from JSON data
const TriggerSection = ({ triggers, sentimentScore, sentimentAssessment, mungerInversion, mode }) => {
  if (!triggers) return null

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">Trigger Status</h3>
      <div className="grid gap-2">
        {triggers.map((trigger) => (
          <div key={trigger.id} className={`flex items-start gap-3 p-3 rounded-lg ${trigger.status ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${trigger.status ? 'bg-amber-500 text-white' : 'bg-gray-300 text-white'}`}>
              {trigger.status ? <AlertTriangle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{trigger.id}: {trigger.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${trigger.status ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>
                  {trigger.status ? 'TRIGGERED' : 'Clear'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{trigger.justification}</p>
            </div>
          </div>
        ))}
      </div>

      {sentimentScore && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-900">Sentiment/Pendulum Assessment</span>
            <span className="text-2xl font-bold text-blue-700">{sentimentScore}/10</span>
          </div>
          <p className="text-sm text-blue-800">{sentimentAssessment}</p>
        </div>
      )}

      {mode && (
        <div className={`p-4 rounded-lg ${mode === 'AGGRESSIVE' ? 'bg-green-50 border border-green-200' : mode === 'LOW_RISK' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
          <span className="text-sm font-medium text-gray-600">Mode this month:</span>
          <span className={`ml-2 text-lg font-bold ${mode === 'AGGRESSIVE' ? 'text-green-700' : mode === 'LOW_RISK' ? 'text-amber-700' : 'text-blue-700'}`}>{mode}</span>
        </div>
      )}

      {mungerInversion && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-red-900">Munger Inversion:</span>
              <p className="text-sm text-red-800 mt-1">"{mungerInversion}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Render holdings review from JSON data
const HoldingsReviewSection = ({ holdingsData }) => {
  if (!holdingsData) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Holdings Review</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">Reviewed: <strong>{holdingsData.totalReviewed}</strong></span>
          <span className="text-amber-600">Flagged: <strong>{holdingsData.flagged}</strong></span>
          <span className="text-red-600">Exit: <strong>{holdingsData.recommendedForExit}</strong></span>
        </div>
      </div>

      <div className="space-y-3">
        {holdingsData.holdings?.map((holding, idx) => (
          <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{holding.name || holding.ticker}</span>
                  <span className="text-sm text-gray-500">({holding.ticker})</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${holding.category === 'CORE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {holding.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Weight: <strong>{holding.currentPercent}</strong></span>
                  <span>Lynch: <strong>{holding.lynchLabel}</strong></span>
                  <span>Fit: <strong className={holding.doctrineFit === 'Strong' ? 'text-green-600' : holding.doctrineFit === 'Weak' ? 'text-red-600' : 'text-amber-600'}>{holding.doctrineFit}</strong></span>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  holding.action === 'HOLD' ? 'bg-gray-200 text-gray-700' :
                  holding.action === 'SELL' ? 'bg-red-100 text-red-700' :
                  holding.action === 'ADD' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {holding.action}
                </span>
                <div className="mt-1">
                  {holding.meetsMandate ? (
                    <span className="text-xs text-green-600 flex items-center gap-1 justify-end"><CheckCircle className="w-3 h-3" /> Meets mandate</span>
                  ) : (
                    <span className="text-xs text-red-600 flex items-center gap-1 justify-end"><X className="w-3 h-3" /> Mandate concern</span>
                  )}
                </div>
              </div>
            </div>
            {holding.redFlags && holding.redFlags.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>Red Flags:</strong> {holding.redFlags.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Render Munger veto checks from JSON data
const MungerVetoSection = ({ vetoData }) => {
  if (!vetoData) return null

  const allPass = vetoData.every(v => v.status === 'Pass' || v.status === 'N/A')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Munger Veto Check</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${allPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {allPass ? 'All Pass' : 'Review Required'}
        </span>
      </div>

      <div className="grid gap-2">
        {vetoData.map((veto) => (
          <div key={veto.id} className={`flex items-center gap-3 p-3 rounded-lg ${
            veto.status === 'Pass' ? 'bg-green-50 border border-green-200' :
            veto.status === 'Fail' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              veto.status === 'Pass' ? 'bg-green-500 text-white' :
              veto.status === 'Fail' ? 'bg-red-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              {veto.status === 'Pass' ? <Check className="w-4 h-4" /> :
               veto.status === 'Fail' ? <X className="w-4 h-4" /> :
               <span className="text-xs">N/A</span>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{veto.id}: {veto.name}</span>
              </div>
              <p className="text-sm text-gray-600">{veto.evidence}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Render decision journal from JSON data
const DecisionJournalSection = ({ journal }) => {
  if (!journal) return null

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">Decision Journal Entry</h3>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">Month</dt>
            <dd className="font-medium text-gray-900">{journal.month}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Mode</dt>
            <dd className="font-medium text-gray-900">{journal.mode}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Trades Executed</dt>
            <dd className="font-medium text-gray-900">{journal.tradesExecuted}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Gold Action</dt>
            <dd className="font-medium text-gray-900">{journal.goldAction}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Dividend Focus</dt>
            <dd className="font-medium text-gray-900">{journal.dividendFocus ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Confidence</dt>
            <dd className={`font-medium ${journal.confidence === 'High' ? 'text-green-600' : journal.confidence === 'Low' ? 'text-red-600' : 'text-amber-600'}`}>{journal.confidence}</dd>
          </div>
        </dl>

        <div className="mt-4 pt-4 border-t border-amber-200">
          <dt className="text-gray-500 text-sm">1-Sentence Thesis</dt>
          <dd className="font-medium text-gray-900 mt-1">"{journal.thesis}"</dd>
        </div>

        {journal.risks && journal.risks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <dt className="text-gray-500 text-sm mb-2">Risks</dt>
            <dd>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {journal.risks.map((risk, idx) => <li key={idx}>{risk}</li>)}
              </ul>
            </dd>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-amber-200">
          <dt className="text-gray-500 text-sm">What Changes My Mind</dt>
          <dd className="text-sm text-gray-700 mt-1">{journal.whatChanges}</dd>
        </div>

        {journal.watchNextMonth && journal.watchNextMonth.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <dt className="text-gray-500 text-sm mb-2">Watch Next Month</dt>
            <dd>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {journal.watchNextMonth.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </dd>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-amber-200">
          <dt className="text-gray-500 text-sm">Munger Veto Status</dt>
          <dd className={`font-medium ${journal.vetoStatus === 'All Pass' ? 'text-green-600' : 'text-red-600'}`}>{journal.vetoStatus}</dd>
        </div>
      </div>
    </div>
  )
}

export default function InvestmentCommitteeApp() {
  const [step, setStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)
  const [activeReportTab, setActiveReportTab] = useState('summary')
  const [expandedStock, setExpandedStock] = useState(null)
  
  const [formData, setFormData] = useState({
    month: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    contribution: '500',
    wrapper: 'ISA',
    broker: 'AJ Bell',
    holdingsText: '',
    potentialsText: '',
    coreSatSplit: '85/15',
    timeHorizon: '10',
    marketSentiment: 5,
    drawdownTrigger: '8',
    usPermitted: true,
    seekDividends: false,
    investmentStyle: 'both',  // 'equities' | 'funds' | 'both'
    stockFocus: 'balanced',  // 'defensive' | 'balanced' | 'cyclical'
  })

  const [holdingsFileName, setHoldingsFileName] = useState('')
  const [potentialsFileName, setPotentialsFileName] = useState('')

  // CSV parsing function
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) return ''

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows = lines.slice(1)

    return rows.map(row => {
      const values = row.split(',').map(v => v.trim())
      const obj = {}
      headers.forEach((h, i) => {
        obj[h] = values[i] || ''
      })

      // Format as: Name, Ticker, Value (or Name, Ticker for potentials)
      const name = obj.investment || obj.name || obj.company || values[0] || ''
      const ticker = obj.ticker || obj.symbol || values[1] || ''
      const value = obj['value (£)'] || obj.value || obj.amount || values[2] || ''

      if (value) {
        return `${name}, ${ticker}, ${value}`
      }
      return `${name}, ${ticker}`
    }).filter(line => line.trim()).join('\n')
  }

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const parsed = parseCSV(text)

      if (type === 'holdings') {
        setFormData({ ...formData, holdingsText: parsed })
        setHoldingsFileName(file.name)
      } else {
        setFormData({ ...formData, potentialsText: parsed })
        setPotentialsFileName(file.name)
      }
    }
    reader.readAsText(file)
  }

  const sentimentScenarios = [
    { id: 'cautious', value: 2, icon: ShieldAlert, title: 'Hold back', description: 'Markets feel expensive or uncertain' },
    { id: 'normal', value: 5, icon: Target, title: 'Stick to plan', description: 'Normal month, follow the strategy' },
    { id: 'opportunistic', value: 7, icon: Zap, title: 'Lean in', description: 'I see some value emerging' },
    { id: 'aggressive', value: 9, icon: Rocket, title: 'Deploy more', description: 'Real opportunities here' },
  ]

  const getSentimentLabel = (value) => {
    if (value <= 2) return { label: 'Very Cautious', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
    if (value <= 4) return { label: 'Cautious', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
    if (value <= 6) return { label: 'Balanced', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    if (value <= 8) return { label: 'Opportunistic', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    return { label: 'Aggressive', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' }
  }

  const getSentimentDescription = (value) => {
    if (value <= 2) return "Committee will favour cash, apply stricter quality filters"
    if (value <= 4) return "Committee will be selective, prefer quality over quantity"
    if (value <= 6) return "Standard balanced approach to allocation"
    if (value <= 8) return "Committee will look for opportunities to deploy more"
    return "Maximum deployment posture, accept higher risk"
  }

  // Market Pulse Data - fetched from Yahoo Finance API
  const [marketPulseData, setMarketPulseData] = useState(null)
  const [marketPulseLoading, setMarketPulseLoading] = useState(true)
  const [marketPulseError, setMarketPulseError] = useState(null)

  // Fetch market pulse data
  const fetchMarketPulse = async () => {
    setMarketPulseLoading(true)
    setMarketPulseError(null)
    try {
      const response = await fetch('/api/market-pulse')
      if (response.ok) {
        const data = await response.json()
        setMarketPulseData(data)
      } else {
        setMarketPulseError('Failed to fetch market data')
      }
    } catch (error) {
      console.error('Failed to fetch market pulse:', error)
      setMarketPulseError('Failed to connect to market data')
    } finally {
      setMarketPulseLoading(false)
    }
  }

  // Fetch market pulse on component mount
  useEffect(() => {
    fetchMarketPulse()
  }, [])

  const getMarketSentimentColor = (score) => {
    if (score <= 3) return { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-100' }
    if (score <= 4.5) return { text: 'text-orange-600', bg: 'bg-orange-500', light: 'bg-orange-100' }
    if (score <= 5.5) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-100' }
    if (score <= 7) return { text: 'text-lime-600', bg: 'bg-lime-500', light: 'bg-lime-100' }
    return { text: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-100' }
  }

  const getMarketSentimentLabel = (score) => {
    if (score <= 2) return 'Very Bearish'
    if (score <= 3.5) return 'Bearish'
    if (score <= 4.5) return 'Slightly Bearish'
    if (score <= 5.5) return 'Neutral'
    if (score <= 6.5) return 'Cautiously Optimistic'
    if (score <= 8) return 'Bullish'
    return 'Very Bullish'
  }

  const steps = [
    { title: 'Welcome', icon: BookOpen },
    { title: 'Holdings', icon: Upload },
    { title: 'This Month', icon: FileText },
    { title: 'Preferences', icon: Shield },
    { title: 'Review', icon: Check },
    { title: 'Analysis', icon: Brain },
  ]

  const analysisSteps = [
    'Reading portfolio data...',
    'Scanning market conditions...',
    'Checking trigger status (L1-L3, A1-A2)...',
    'Reviewing existing holdings...',
    'Applying Graham criteria...',
    'Running Buffett quality checks...',
    'Performing Munger inversion...',
    'Analyzing Marks cycle positioning...',
    'Applying Lynch classification...',
    'Building committee positions...',
    'Chair synthesis in progress...',
    'Running Munger veto checks...',
    'Generating final recommendations...',
  ]

  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0)

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setCurrentAnalysisStep(0)
    setAnalysisError(null)
    
    // Animate through steps while waiting for API
    const interval = setInterval(() => {
      setCurrentAnalysisStep(prev => {
        if (prev >= analysisSteps.length - 1) return prev
        return prev + 1
      })
    }, 800)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          marketPulse: {
            uk: {
              score: marketPulseData?.uk?.score || 5,
              label: marketPulseData?.uk?.label || 'Neutral',
              regime: marketPulseData?.uk?.regime || 'Unknown',
              aboveMa50: marketPulseData?.uk?.aboveMa50,
              aboveMa200: marketPulseData?.uk?.aboveMa200
            },
            us: {
              score: marketPulseData?.us?.score || 5,
              label: marketPulseData?.us?.label || 'Neutral',
              regime: marketPulseData?.us?.regime || 'Unknown',
              aboveMa50: marketPulseData?.us?.aboveMa50,
              aboveMa200: marketPulseData?.us?.aboveMa200
            }
          }
        })
      })

      clearInterval(interval)

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
      setCurrentAnalysisStep(analysisSteps.length - 1)
      
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 500)

    } catch (error) {
      clearInterval(interval)
      setAnalysisError(error.message)
      setIsAnalyzing(false)
    }
  }

  // Star rating component
  const StarRating = ({ rating, max = 5 }) => (
    <div className="flex gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">The Investment Program</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Make disciplined investment decisions using the wisdom of Graham, Buffett, Munger, Marks & Lynch.
              </p>
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto pt-4">
                {['Graham', 'Buffett', 'Munger', 'Marks', 'Lynch'].map((name) => (
                  <div key={name} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-1 flex items-center justify-center text-lg font-bold text-gray-700">
                      {name[0]}
                    </div>
                    <span className="text-xs text-gray-500">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Pulse Section - Live Yahoo Finance Data */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Market Pulse</h2>
                    <p className="text-gray-400 text-sm">Live data from Yahoo Finance</p>
                  </div>
                </div>
                <button
                  onClick={fetchMarketPulse}
                  disabled={marketPulseLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${marketPulseLoading ? 'animate-spin' : ''}`} />
                  {marketPulseLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {marketPulseLoading && !marketPulseData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="ml-3 text-gray-400">Fetching live market data...</span>
                </div>
              ) : marketPulseError && !marketPulseData ? (
                <div className="bg-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-300">{marketPulseError}</p>
                  <button onClick={fetchMarketPulse} className="mt-2 text-sm underline">Try again</button>
                </div>
              ) : marketPulseData && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* UK Market */}
                <div className="bg-white rounded-xl text-gray-900 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇬🇧</span>
                        <span className="font-bold">{marketPulseData.uk.index || 'FTSE 100'}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        marketPulseData.uk.regime === 'Trending Up' ? 'bg-green-100 text-green-700' :
                        marketPulseData.uk.regime === 'Trending Down' ? 'bg-red-100 text-red-700' :
                        marketPulseData.uk.regime === 'Volatile' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {marketPulseData.uk.regime}
                      </span>
                    </div>
                    {marketPulseData.uk.price && (
                      <p className="text-xs text-gray-500 mt-1">{marketPulseData.uk.price.toLocaleString()} pts</p>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`text-2xl font-bold ${getMarketSentimentColor(marketPulseData.uk.score).text}`}>
                          {marketPulseData.uk.score?.toFixed(1) || '—'}
                        </p>
                        <p className="text-xs text-gray-500">{marketPulseData.uk.label}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${marketPulseData.uk.changeDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {marketPulseData.uk.changeDirection === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {marketPulseData.uk.changePercent || marketPulseData.uk.change}
                      </div>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-amber-500 to-green-500">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-5 bg-white border-2 border-gray-800 rounded-sm shadow-lg"
                        style={{ left: `calc(${((marketPulseData.uk.score || 5) / 10) * 100}% - 8px)` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      <span>Bearish</span>
                      <span>Bullish</span>
                    </div>
                    {marketPulseData.uk.aboveMa50 !== null && (
                      <div className="flex gap-2 mt-3 text-xs">
                        <span className={`px-2 py-0.5 rounded ${marketPulseData.uk.aboveMa50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {marketPulseData.uk.aboveMa50 ? '↑' : '↓'} 50MA
                        </span>
                        <span className={`px-2 py-0.5 rounded ${marketPulseData.uk.aboveMa200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {marketPulseData.uk.aboveMa200 ? '↑' : '↓'} 200MA
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* US Market */}
                <div className="bg-white rounded-xl text-gray-900 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇺🇸</span>
                        <span className="font-bold">{marketPulseData.us.index || 'S&P 500'}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        marketPulseData.us.regime === 'Trending Up' ? 'bg-green-100 text-green-700' :
                        marketPulseData.us.regime === 'Trending Down' ? 'bg-red-100 text-red-700' :
                        marketPulseData.us.regime === 'Volatile' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {marketPulseData.us.regime}
                      </span>
                    </div>
                    {marketPulseData.us.price && (
                      <p className="text-xs text-gray-500 mt-1">{marketPulseData.us.price.toLocaleString()} pts</p>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`text-2xl font-bold ${getMarketSentimentColor(marketPulseData.us.score).text}`}>
                          {marketPulseData.us.score?.toFixed(1) || '—'}
                        </p>
                        <p className="text-xs text-gray-500">{marketPulseData.us.label}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${marketPulseData.us.changeDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {marketPulseData.us.changeDirection === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {marketPulseData.us.changePercent || marketPulseData.us.change}
                      </div>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-amber-500 to-green-500">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-5 bg-white border-2 border-gray-800 rounded-sm shadow-lg"
                        style={{ left: `calc(${((marketPulseData.us.score || 5) / 10) * 100}% - 8px)` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      <span>Bearish</span>
                      <span>Bullish</span>
                    </div>
                    {marketPulseData.us.aboveMa50 !== null && (
                      <div className="flex gap-2 mt-3 text-xs">
                        <span className={`px-2 py-0.5 rounded ${marketPulseData.us.aboveMa50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {marketPulseData.us.aboveMa50 ? '↑' : '↓'} 50MA
                        </span>
                        <span className={`px-2 py-0.5 rounded ${marketPulseData.us.aboveMa200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {marketPulseData.us.aboveMa200 ? '↑' : '↓'} 200MA
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Educational tool only.</strong> Not financial advice. You make all final decisions.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Current Holdings</h2>
            <p className="text-gray-600">Upload a CSV or enter your portfolio holdings manually</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Holdings</label>

              {/* CSV Upload */}
              <div className="mb-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {holdingsFileName || 'Upload CSV file'}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, 'holdings')}
                    className="hidden"
                  />
                </label>
                {holdingsFileName && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Loaded: {holdingsFileName}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-2 text-center">— or enter manually —</p>

              <textarea
                value={formData.holdingsText}
                onChange={(e) => setFormData({ ...formData, holdingsText: e.target.value })}
                placeholder="Example:
Vanguard FTSE All-World, VWRP, £649
HSBC Holdings, HSBA, £370
Physical Gold, GOLD, £500
Cash, CASH, £176"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stocks to Investigate (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">Add stocks for deep Five Pillars analysis with Graham's 7 tests, Buffett quality checks, and Munger inversion</p>

              {/* CSV Upload for Potentials */}
              <div className="mb-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {potentialsFileName || 'Upload CSV file'}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, 'potentials')}
                    className="hidden"
                  />
                </label>
                {potentialsFileName && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Loaded: {potentialsFileName}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-2 text-center">— or enter manually —</p>

              <textarea
                value={formData.potentialsText}
                onChange={(e) => setFormData({ ...formData, potentialsText: e.target.value })}
                placeholder="Example:
Diageo, DGE
Marks & Spencer, MKS"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• CSV should have columns: Investment/Name, Ticker, Value (£)</li>
                <li>• Include all holdings: stocks, ETFs, gold, and cash</li>
                <li>• Use GOLD for physical gold holdings</li>
                <li>• Potentials will receive full investigation with Graham's 7 tests, Buffett quality checks, Munger inversion analysis, and star ratings</li>
              </ul>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">This Month's Inputs</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input
                  type="text"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contribution (£)</label>
                <input
                  type="number"
                  value={formData.contribution}
                  onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 -mt-2">
              <strong>Note:</strong> The contribution amount influences which investments are recommended. Smaller amounts may focus on fewer, higher-conviction picks to minimise trading costs, while larger amounts allow for more diversification.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Wrapper</label>
                <select
                  value={formData.wrapper}
                  onChange={(e) => setFormData({ ...formData, wrapper: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="ISA">ISA</option>
                  <option value="SIPP">SIPP</option>
                  <option value="GIA">GIA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
                <input
                  type="text"
                  value={formData.broker}
                  onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Compact Inline Market Pulse */}
            {marketPulseData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Current Market Sentiment</label>
              <div className="flex gap-3 mb-6">
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🇬🇧 {marketPulseData.uk.index || 'FTSE'}</span>
                    <span className={`text-lg font-bold ${getMarketSentimentColor(marketPulseData.uk.score).text}`}>
                      {marketPulseData.uk.score?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-700 rounded-full"
                      style={{ left: `calc(${((marketPulseData.uk.score || 5) / 10) * 100}% - 6px)` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{marketPulseData.uk.label}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🇺🇸 {marketPulseData.us.index || 'S&P'}</span>
                    <span className={`text-lg font-bold ${getMarketSentimentColor(marketPulseData.us.score).text}`}>
                      {marketPulseData.us.score?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-700 rounded-full"
                      style={{ left: `calc(${((marketPulseData.us.score || 5) / 10) * 100}% - 6px)` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{marketPulseData.us.label}</p>
                </div>
              </div>
            </div>
            )}

            {/* User Sentiment Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How do you feel about the markets this month?</label>
              <p className="text-xs text-gray-500 mb-3">This helps the committee calibrate its recommendations</p>
              
              <div className="space-y-2">
                <div
                  className="relative h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const percentage = x / rect.width
                    const value = Math.round(percentage * 10)
                    setFormData({ ...formData, marketSentiment: Math.max(0, Math.min(10, value)) })
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full shadow cursor-grab"
                    style={{ left: `calc(${(formData.marketSentiment / 10) * 100}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Cautious</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {(() => {
                const info = getSentimentLabel(formData.marketSentiment)
                return (
                  <div className={`mt-3 rounded-lg p-3 ${info.bg} border ${info.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${info.color}`}>{info.label}</p>
                        <p className="text-xs text-gray-600">{getSentimentDescription(formData.marketSentiment)}</p>
                      </div>
                      <div className={`text-2xl font-bold ${info.color}`}>{formData.marketSentiment}</div>
                    </div>
                  </div>
                )
              })()}
            </div>

          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Core/Satellite Split Target</label>
              <select
                value={formData.coreSatSplit}
                onChange={(e) => setFormData({ ...formData, coreSatSplit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="90/10">90% Core / 10% Satellite (Conservative)</option>
                <option value="85/15">85% Core / 15% Satellite (Balanced)</option>
                <option value="70/30">70% Core / 30% Satellite (Growth)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Time Horizon (Years)</label>
              <div
                className="relative h-2 rounded-full bg-gray-300 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const percentage = x / rect.width
                  const value = Math.round(1 + percentage * 29)
                  setFormData({ ...formData, timeHorizon: String(Math.max(1, Math.min(30, value))) })
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full shadow cursor-grab"
                  style={{ left: `calc(${((formData.timeHorizon - 1) / 29) * 100}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1 year</span>
                <span className="font-medium text-amber-600">{formData.timeHorizon} years</span>
                <span>30 years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drawdown Trigger</label>
              <div className="grid grid-cols-2 gap-2">
                {['8', '12'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFormData({ ...formData, drawdownTrigger: val })}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.drawdownTrigger === val
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{val}%</span>
                    <span className="text-sm text-gray-500 block">{val === '8' ? 'Standard' : 'Relaxed'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Permissions & Goals</label>
              {[
                { key: 'usPermitted', label: 'US assets permitted' },
                { key: 'seekDividends', label: 'Seek dividend income stocks', description: 'Prioritise quality dividend payers for income' },
              ].map(({ key, label, description }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-gray-700">{label}</span>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Investment Style</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'equities', icon: TrendingUp, title: 'Equities Only', description: 'Individual stocks (HSBA, DGE, ULVR)', detail: 'More control, higher risk/reward' },
                  { id: 'funds', icon: PieChart, title: 'Funds Only', description: 'ETFs & funds (VWRL, VHYL, IUKD)', detail: 'Diversified, lower fees' },
                  { id: 'both', icon: BarChart3, title: 'Both', description: 'Mix of equities and funds', detail: 'Balanced approach (Recommended)' },
                ].map(({ id, icon: Icon, title, description, detail }) => (
                  <button
                    key={id}
                    onClick={() => setFormData({ ...formData, investmentStyle: id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.investmentStyle === id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      formData.investmentStyle === id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`font-medium ${formData.investmentStyle === id ? 'text-amber-700' : 'text-gray-900'}`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Stock Focus</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'defensive', icon: Shield, title: 'Defensive Focus', description: 'Utilities, healthcare, staples', detail: 'Stable, less volatile' },
                  { id: 'balanced', icon: Scale, title: 'Balanced', description: 'Mix based on conditions', detail: 'Adapt to market (Recommended)' },
                  { id: 'cyclical', icon: Zap, title: 'Cyclical Focus', description: 'Financials, industrials, discretionary', detail: 'Higher growth potential' },
                ].map(({ id, icon: Icon, title, description, detail }) => (
                  <button
                    key={id}
                    onClick={() => setFormData({ ...formData, stockFocus: id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.stockFocus === id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      formData.stockFocus === id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`font-medium ${formData.stockFocus === id ? 'text-amber-700' : 'text-gray-900'}`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Inputs</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Month</span>
                  <p className="font-medium">{formData.month}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Contribution</span>
                  <p className="font-medium">£{formData.contribution}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Wrapper</span>
                  <p className="font-medium">{formData.wrapper}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Broker</span>
                  <p className="font-medium">{formData.broker}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Holdings</span>
                  <p className="font-medium flex items-center gap-1">
                    {formData.holdingsText ? (
                      <><Check className="w-4 h-4 text-green-500" /> Entered</>
                    ) : (
                      <><AlertCircle className="w-4 h-4 text-amber-500" /> None entered</>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Potentials</span>
                  <p className="font-medium flex items-center gap-1">
                    {formData.potentialsText ? (
                      <><Check className="w-4 h-4 text-green-500" /> Entered</>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Market Sentiment</span>
                  <p className="font-medium">{formData.marketSentiment}/10 — {getSentimentLabel(formData.marketSentiment).label}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Time Horizon</span>
                  <p className="font-medium">{formData.timeHorizon} years</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Investment Style</span>
                  <p className="font-medium capitalize">{formData.investmentStyle === 'both' ? 'Equities & Funds' : formData.investmentStyle === 'equities' ? 'Equities Only' : 'Funds Only'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Dividend Focus</span>
                  <p className="font-medium">{formData.seekDividends ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stock Focus</span>
                  <p className="font-medium capitalize">{formData.stockFocus === 'balanced' ? 'Balanced' : formData.stockFocus === 'defensive' ? 'Defensive' : 'Cyclical'}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                What happens next?
              </h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Trigger scan to determine risk mode</li>
                <li>• Holdings review with doctrine checks</li>
                {formData.potentialsText && <li>• Deep investigation of potential stocks</li>}
                <li>• Three committee positions (Aggressive/Balanced/Low Risk)</li>
                <li>• Chair synthesis with final recommendation</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        if (isAnalyzing) {
          return (
            <div className="text-center py-8 space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                <Brain className="absolute inset-0 m-auto w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis in Progress</h2>
              
              <div className="max-w-md mx-auto text-left bg-gray-50 rounded-xl p-4">
                <div className="space-y-2">
                  {analysisSteps.map((stepText, i) => (
                    <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      i < currentAnalysisStep ? 'text-green-600' : 
                      i === currentAnalysisStep ? 'text-amber-600 font-medium' : 
                      'text-gray-300'
                    }`}>
                      {i < currentAnalysisStep ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : i === currentAnalysisStep ? (
                        <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        if (analysisError) {
          return (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Failed</h2>
              <p className="text-gray-600">{analysisError}</p>
              <button
                onClick={runAnalysis}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )
        }

        if (analysisComplete && analysisResult) {
          return (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-amber-900 to-orange-800 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-amber-200 text-sm">The Investment Program Report</p>
                    <h1 className="text-2xl font-bold mt-1">{formData.month}</h1>
                    <p className="text-amber-300 mt-2">
                      {formData.wrapper} • £{formData.contribution}/month • {analysisResult.mode || 'Balanced'} Mode
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                    <p className="text-amber-200 text-xs text-center">Committee Stance</p>
                    <p className={`text-lg font-bold text-center ${
                      analysisResult.mode === 'AGGRESSIVE' ? 'text-green-400' :
                      analysisResult.mode === 'LOW_RISK' ? 'text-amber-400' :
                      'text-amber-300'
                    }`}>{analysisResult.mode || 'Balanced'}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                    <p className="text-amber-200 text-xs text-center">Trades Recommended</p>
                    <p className="text-lg font-bold text-center">{analysisResult.trades?.length || 0}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
                    <p className="text-amber-200 text-xs text-center">Market Regime</p>
                    <p className={`text-lg font-bold text-center ${
                      marketPulseData?.uk?.regime === 'Trending Up' ? 'text-green-400' :
                      marketPulseData?.uk?.regime === 'Trending Down' ? 'text-red-400' :
                      marketPulseData?.uk?.regime === 'Volatile' ? 'text-orange-400' :
                      marketPulseData?.uk?.regime === 'Choppy' ? 'text-amber-400' :
                      'text-amber-300'
                    }`}>{marketPulseData?.uk?.regime || 'Analyzing...'}</p>
                  </div>
                </div>
              </div>

              {/* Report Tabs */}
              <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {[
                  { id: 'summary', label: 'Summary' },
                  { id: 'trades', label: 'Recommended Trades' },
                  { id: 'holdings', label: 'Holdings Review' },
                  { id: 'full', label: 'Full Report' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveReportTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeReportTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeReportTab === 'summary' && (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {analysisResult.summary || 'Analysis complete. Review your recommendations below.'}
                      </p>
                    </div>
                  </div>

                  {/* Chair's Decision */}
                  {analysisResult.chairDecision && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Chair's Synthesis</h3>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
                          {analysisResult.chairDecision}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Pillar Reminder */}
                  {analysisResult.pillarReminder && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="font-medium text-amber-900 mb-2">Wisdom from the Masters</h3>
                      <p className="text-amber-800 italic whitespace-pre-wrap">{analysisResult.pillarReminder}</p>
                    </div>
                  )}
                </div>
              )}

              {activeReportTab === 'trades' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Recommended Trades</h2>
                    {analysisResult.totalDeployed && (
                      <p className="text-sm text-gray-500 mt-1">Total to deploy: £{analysisResult.totalDeployed}</p>
                    )}
                  </div>

                  {analysisResult.trades && analysisResult.trades.length > 0 ? (
                    <div>
                      {analysisResult.trades.map((trade, index) => {
                        const tradeKey = `${trade.ticker}-${index}`
                        const isExpanded = expandedStock === tradeKey
                        return (
                          <div key={tradeKey} className="border-b border-gray-100 last:border-b-0">
                            <button
                              onClick={() => setExpandedStock(isExpanded ? null : tradeKey)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${
                                  trade.action === 'BUY' ? 'bg-green-600' :
                                  trade.action === 'SELL' ? 'bg-red-600' :
                                  trade.action === 'HOLD' ? 'bg-amber-500' :
                                  'bg-green-600'
                                } rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                                  {trade.action === 'BUY' ? 'B' : trade.action === 'SELL' ? 'S' : trade.action === 'HOLD' ? 'H' : 'B'}
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-gray-900">{trade.ticker}</p>
                                  <p className="text-sm text-gray-500">{trade.name}</p>
                                </div>
                                {trade.category && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    trade.category === 'CORE' ? 'bg-blue-100 text-blue-700' :
                                    trade.category === 'SATELLITE' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {trade.category}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">£{trade.amount}</p>
                                  <p className="text-sm text-gray-500">{trade.action || 'BUY'}</p>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </button>

                            {/* Expanded trade details */}
                            {isExpanded && (
                              <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Amount</p>
                                    <p className="font-bold text-gray-900">£{trade.amount}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Action</p>
                                    <p className="font-bold text-gray-900">{trade.action || 'BUY'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Category</p>
                                    <p className="font-bold text-gray-900">{trade.category || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Wrapper</p>
                                    <p className="font-bold text-gray-900">{trade.wrapper || formData.wrapper}</p>
                                  </div>
                                </div>
                                {trade.rationale && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase mb-2">Investment Rationale</p>
                                    <div className="bg-white p-4 rounded-lg space-y-3">
                                      {(Array.isArray(trade.rationale)
                                        ? trade.rationale
                                        : trade.rationale.split(/[.!?](?:\s|$)/).filter(s => s.trim())
                                      ).map((point, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                          <span className="text-amber-500 mt-0.5 text-lg leading-none">•</span>
                                          <p className="text-sm text-gray-700 leading-relaxed">{typeof point === 'string' ? point.trim() : point}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No specific trades recommended this month.</p>
                      <p className="text-sm mt-2">Check the Full Report for detailed analysis.</p>
                    </div>
                  )}
                </div>
              )}

              {activeReportTab === 'holdings' && (
                <div className="space-y-6">
                  {/* Holdings Review - Structured */}
                  {analysisResult.holdingsReviewData ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <HoldingsReviewSection holdingsData={analysisResult.holdingsReviewData} />
                    </div>
                  ) : analysisResult.holdingsReview ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Current Holdings Review</h3>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
                        {analysisResult.holdingsReview}
                      </pre>
                    </div>
                  ) : null}

                  {/* Committee Positions */}
                  {analysisResult.committeePositions && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Committee Positions</h3>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
                        {analysisResult.committeePositions}
                      </pre>
                    </div>
                  )}

                  {!analysisResult.holdingsReviewData && !analysisResult.holdingsReview && !analysisResult.committeePositions && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                      <p>No holdings review available.</p>
                      <p className="text-sm mt-2">Check the Full Report for detailed analysis.</p>
                    </div>
                  )}
                </div>
              )}

              {activeReportTab === 'full' && (
                <div className="space-y-6 overflow-auto max-h-[800px]">
                  {/* Trigger Scan - Structured */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Part A — Trigger Scan + Mode Selection</h2>
                    <TriggerSection
                      triggers={analysisResult.triggers}
                      sentimentScore={analysisResult.sentimentScore}
                      sentimentAssessment={analysisResult.sentimentAssessment}
                      mungerInversion={analysisResult.mungerInversion}
                      mode={analysisResult.mode}
                    />
                  </div>

                  {/* Holdings Review - Structured */}
                  {analysisResult.holdingsReviewData && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Part B — Holdings Review</h2>
                      <HoldingsReviewSection holdingsData={analysisResult.holdingsReviewData} />
                    </div>
                  )}

                  {/* Munger Veto - Structured */}
                  {analysisResult.mungerVetoData && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Part E — Munger Veto Check</h2>
                      <MungerVetoSection vetoData={analysisResult.mungerVetoData} />
                    </div>
                  )}

                  {/* Chair Decision */}
                  {analysisResult.chairDecision && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Part F — Chair Synthesis</h2>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-gray-800">{analysisResult.chairDecision}</p>
                      </div>
                      {analysisResult.pillarReminder && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 italic">{analysisResult.pillarReminder}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Decision Journal - Structured */}
                  {analysisResult.decisionJournalData && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Part G — Decision Journal Entry</h2>
                      <DecisionJournalSection journal={analysisResult.decisionJournalData} />
                    </div>
                  )}

                  {/* Raw Report Fallback */}
                  {!analysisResult.triggers && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Full Analysis Report</h3>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
                        {analysisResult.fullAnalysis || 'No detailed analysis available.'}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Start Over */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(0)
                    setAnalysisComplete(false)
                    setAnalysisResult(null)
                    setActiveReportTab('summary')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Start New Analysis
                </button>
              </div>
            </div>
          )
        }

        // Fallback - analysis should auto-start when reaching step 5
        return (
          <div className="text-center py-12 space-y-6">
            <Brain className="w-16 h-16 text-amber-500 mx-auto" />
            <p className="text-gray-600">Starting analysis...</p>
            <button
              onClick={runAnalysis}
              className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className={`mx-auto ${analysisComplete ? 'max-w-4xl' : 'max-w-2xl'}`}>
        {/* Progress Steps */}
        {step > 0 && step < 5 && (
          <div className="flex items-center justify-between mb-8">
            {steps.slice(1, 5).map((s, i) => (
              <React.Fragment key={s.title}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i + 1 < step
                        ? 'bg-green-500 text-white'
                        : i + 1 === step
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i + 1 < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">{s.title}</span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        {!isAnalyzing && !analysisComplete && (
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 5 && (
              <button
                onClick={() => {
                  if (step === 4) {
                    // Skip the "Ready to Run" screen - go directly to step 5 and start analysis
                    setStep(5)
                    runAnalysis()
                  } else {
                    setStep(step + 1)
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                {step === 0 ? 'Get Started' : step === 4 ? 'Run Analysis' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {analysisComplete && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setStep(0)
                setAnalysisComplete(false)
                setAnalysisResult(null)
                setActiveReportTab('summary')
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Start New Analysis
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>The Investment Program • Educational Tool Only • Not Financial Advice</p>
        </div>
      </div>
    </div>
  )
}
