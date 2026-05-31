'use client'

const findings = [
  { name: 'AI bot access (GPTBot)', status: 'BLOCKED', type: 'bad' },
  { name: 'llms.txt file',          status: 'MISSING', type: 'bad' },
  { name: 'Schema markup',          status: 'ABSENT',  type: 'bad' },
  { name: 'LLM citations — 4 platforms', status: '0 FOUND', type: 'bad' },
  { name: 'Google rating',          status: '4.8 ★ STRONG', type: 'ok' },
  { name: 'Social presence',        status: 'WEAK',    type: 'warn' },
]

export default function ScanDemo() {
  return (
    <div className="bg-surface-2 border border-ink/10 rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink/10">
        <span className="font-mono text-[8px] text-ink/40 tracking-[0.2em] uppercase">Live AI Visibility Scan</span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] text-pink tracking-[0.1em]">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          Scanning
        </span>
      </div>
      <div className="px-5 py-3.5 flex flex-col gap-1.5">
        {findings.map(({ name, status, type }) => (
          <div
            key={name}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-[3px] border
              ${type === 'bad'  ? 'border-l-2 border-l-pink/40 border-ink/10 bg-pink/[0.04]'   : ''}
              ${type === 'ok'   ? 'border-l-2 border-l-teal/40 border-ink/10 bg-teal/[0.04]'   : ''}
              ${type === 'warn' ? 'border-ink/10 bg-surface' : ''}
            `}
          >
            <span className="text-sm font-body text-ink/90">{name}</span>
            <span className={`font-mono text-[8px] font-bold px-2 py-1 rounded-[2px]
              ${type === 'bad'  ? 'bg-pink/12 text-pink'   : ''}
              ${type === 'ok'   ? 'bg-teal/12 text-teal'   : ''}
              ${type === 'warn' ? 'bg-orange/12 text-orange' : ''}
            `}>
              {status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-4 border-t border-ink/10">
        <div>
          <div className="font-mono text-[7px] text-ink/30 tracking-[0.2em] uppercase">AI Visibility Score</div>
          <div className="font-display text-[44px] text-pink leading-none">23</div>
        </div>
        <div className="flex-1 h-1 bg-ink/10 rounded-full mx-4 overflow-hidden">
          <div className="h-full w-[23%] rounded-full" style={{ background: 'linear-gradient(90deg, #FF1177, #FF7A45)' }} />
        </div>
        <div className="font-mono text-[8px] text-ink/35 italic">Recoverable in 7 days →</div>
      </div>
    </div>
  )
}
