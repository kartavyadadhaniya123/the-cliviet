const words = [
  "Fine Leather",
  "Gold Hardware",
  "Hand Finished",
  "Timeless Design",
  "Crafted for Legacy",
]

export function Marquee() {
  const items = [...words, ...words]
  return (
    <div className="overflow-hidden border-y border-[#d9bd7e]/30 bg-[#1a130c] py-5">
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-serif text-lg italic text-[#d9bd7e]">{w}</span>
            <span className="text-[#d9bd7e]/50">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
