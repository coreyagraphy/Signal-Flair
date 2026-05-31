'use client'

const items = [
  { text: 'Indianapolis Colts', highlight: true  },
  { text: 'Horsepower Theme Campaign', highlight: false },
  { text: 'Louis Vuitton AI Contest Win', highlight: true  },
  { text: 'Red Print Magazine Cover', highlight: false },
  { text: '#17 of 8,500+ AI Creators', highlight: true  },
  { text: 'A Few Good Men · National Tour', highlight: false },
  { text: 'AEO · llms.txt · AI Bot Access', highlight: true  },
  { text: 'Seedance 2.0 Production', highlight: false },
]

const allItems = [...items, ...items]

export default function TickerSection() {
  return (
    <div className="bg-feature border-y border-yellow/10 py-3.5 overflow-hidden">
      <div className="flex gap-0 animate-ticker whitespace-nowrap" style={{ willChange: 'transform' }}>
        {allItems.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-5 px-5 font-display text-sm tracking-[0.1em] flex-shrink-0
              ${item.highlight ? 'text-on-feature/60' : 'text-on-feature/25'}`}
          >
            {item.text}
            <span className="w-1 h-1 rounded-full bg-orange flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
