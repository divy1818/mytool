import './globals.css';

export const metadata = {
  title: 'Next.js Background Remover',
  description: 'Remove the background from any image.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Background Remover</h1>
          {children}
        </main>
      </body>
    </html>
  )
}
