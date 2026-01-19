import './globals.css'

export const metadata = {
  title: 'AI Investment Committee',
  description: 'Make disciplined investment decisions using the wisdom of Graham, Buffett, Munger, Marks & Lynch.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
