import type { Metadata } from 'next'
import { Manrope, DM_Mono, DM_Serif_Display, Bebas_Neue } from 'next/font/google'
import Script from 'next/script'
import { Providers } from './providers'
import { GA_ID } from '@shared/lib/analytics'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Loans Portal — Investment Products',
  description: 'Portal de contratación de productos de inversión',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${dmMono.variable} ${dmSerif.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme — also syncs data-theme attr */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var t=s?JSON.parse(s).state?.theme:'dark';if(t!=='light'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}})()`,
          }}
        />
      </head>
      <body className={manrope.className} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0c0c0a] focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <Providers>{children}</Providers>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>
      </body>
    </html>
  )
}
