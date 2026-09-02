"use client"

import { useEffect, useState } from "react"

const links = [
  { href: "#collection", label: "Collection" },
  { href: "#story", label: "House" },
  { href: "#spotlight", label: "Icon" },
  { href: "#contact", label: "Contact" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#1a130c]/85 backdrop-blur-md py-4" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="font-serif text-xl tracking-[0.35em] text-[#f6f1e9] pl-1">
          THE CLIVIET
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.25em] text-[#e2d8c8]/80 transition-colors hover:text-[#d9bd7e]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#collection"
            className="border border-[#d9bd7e]/50 px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#d9bd7e] transition-all hover:bg-[#d9bd7e] hover:text-[#1a130c]"
          >
            Shop
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-px w-6 bg-[#f6f1e9] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-[#f6f1e9] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-[#f6f1e9] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-[#1a130c]/95 backdrop-blur-md transition-all duration-500 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-6 px-6 py-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.25em] text-[#e2d8c8]"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
