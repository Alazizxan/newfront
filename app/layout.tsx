import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Code Mentor',
  description: 'AI yordamida kod yozishni o‘rgatuvchi platforma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
