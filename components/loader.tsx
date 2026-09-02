"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function Loader() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    })
    tl.fromTo(markRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, "-=0.3")
      .to([markRef.current, barRef.current?.parentElement ?? null], {
        opacity: 0,
        y: -16,
        duration: 0.6,
        ease: "power2.in",
      })
      .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1")
    return () => {
      tl.kill()
    }
  }, [])

  if (done) return null

  return (
    <div ref={rootRef} className="loader">
      <div ref={markRef} className="loader-mark">
        THE CLIVIET
      </div>
      <div className="loader-bar">
        <span ref={barRef} />
      </div>
    </div>
  )
}
