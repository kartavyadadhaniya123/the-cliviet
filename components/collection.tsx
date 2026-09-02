"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    name: "The Marigold",
    tag: "Signature Tote",
    price: "₹8,499",
    img: "/images/orange-floral.png",
    accent: "#e8722a",
  },
  {
    name: "The Azure",
    tag: "Executive Handbag",
    price: "₹7,299",
    img: "/images/blue-executive.png",
    accent: "#7d97b8",
  },
  {
    name: "The Monogram",
    tag: "Quilted Clutch",
    price: "₹6,499",
    img: "/images/black-clutch.png",
    accent: "#c9a56a",
  },
  {
    name: "The Metropolitan",
    tag: "Office Tote",
    price: "₹9,199",
    img: "/images/brown-tote.png",
    accent: "#5a3d2b",
  },
]

export function Collection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".coll-head",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".coll-head", start: "top 85%" },
        },
      )
      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: (i % 2) * 0.12,
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="collection" ref={ref} className="bg-[#f6f1e9] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="coll-head mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#b08d35]">The Collection</p>
            <h2 className="max-w-xl font-serif text-4xl leading-tight text-[#2b2118] md:text-6xl text-balance">
              Objects of quiet <span className="italic text-[#b08d35]">confidence</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#8a7a66]">
            Four silhouettes, each defined by its material and mood. Made in limited runs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {products.map((p) => (
            <article
              key={p.name}
              className="product-card hoverable group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fbf8f2]">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 50% 40%, ${p.accent}22, transparent 70%)` }}
                />
                <Image
                  src={p.img || "/placeholder.svg"}
                  alt={`${p.name} — ${p.tag} by The Cliviet`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <span className="absolute right-5 top-5 bg-[#1a130c]/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#d9bd7e] backdrop-blur-sm">
                  {p.tag}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-[#e2d8c8] py-5">
                <h3 className="font-serif text-2xl text-[#2b2118]">{p.name}</h3>
                <span className="font-sans text-sm tracking-wide text-[#b08d35]">{p.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
