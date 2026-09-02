"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { HeroCanvas } from "./hero-canvas"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.6 })
      tl.fromTo(
        ".hero-kicker",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      )
        .fromTo(
          ".hero-word span",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 },
          "-=0.6",
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6",
        )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-[#1a130c]">
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a130c]/30 via-transparent to-[#1a130c]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <p className="hero-kicker mb-6 text-xs uppercase tracking-[0.5em] text-[#d9bd7e] opacity-0">
          Crafted for Legacy — Est. 2024
        </p>
        <h1 className="font-serif text-[#f6f1e9] leading-[0.95]">
          <span className="reveal-line hero-word block text-[clamp(3rem,12vw,10rem)] font-light">
            <span>Luxury,</span>
          </span>
          <span className="reveal-line hero-word block text-[clamp(3rem,12vw,10rem)] italic text-[#d9bd7e]">
            <span>Redefined.</span>
          </span>
        </h1>
        <p className="hero-sub mt-8 max-w-md text-base leading-relaxed text-[#e2d8c8]/80 opacity-0">
          A house of fine leather goods, where every stitch carries intention. Timeless silhouettes for those who
          collect moments, not things.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap items-center gap-5 opacity-0">
          <a
            href="#collection"
            className="bg-[#d9bd7e] px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#1a130c] transition-transform hover:-translate-y-1"
          >
            Explore the Collection
          </a>
          <a
            href="#story"
            className="text-xs uppercase tracking-[0.25em] text-[#e2d8c8] underline-offset-8 hover:underline"
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-[#e2d8c8]/50">
        Scroll to discover
      </div>
    </section>
  )
}
