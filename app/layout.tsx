import type { Metadata } from "next"
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
})
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
})

export const metadata: Metadata = {
  title: "The Cliviet — Crafted for Legacy",
  description:
    "The Cliviet is a house of fine leather goods. Each handbag is crafted for legacy — timeless silhouettes, gold hardware, and uncompromising materials.",
  keywords: ["luxury handbags", "leather bags", "The Cliviet", "designer bags", "crafted for legacy"],
  openGraph: {
    title: "The Cliviet — Crafted for Legacy",
    description: "A house of fine leather goods. Crafted for legacy.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#1a130c",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} bg-[#1a130c]`}>
      <body>{children}</body>
    </html>
  )
}
