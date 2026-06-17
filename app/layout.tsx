import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cys Gaming World',
  description: "Cyrus's Arcade — original games built from scratch",
  icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text y="32" font-size="32">🎮</text></svg>' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="scanlines" aria-hidden />
        <div className="vignette" aria-hidden />
        {children}
      </body>
    </html>
  )
}
