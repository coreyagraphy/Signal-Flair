'use client'

const serviceLinks = ['AI Visibility Scan', 'llms.txt Build', 'AI Bot Audit', 'UGC Production', 'Landing Pages', 'Meta Ad Creative']
const companyLinks = ['About', 'Work', 'Pricing', 'Signal Flare System', 'Contact']
const connectLinks = ['LinkedIn', 'Instagram', 'TikTok', 'YouTube']

export default function FooterSection() {
  return (
    <footer className="bg-feature-2 border-t border-on-feature/8 px-6 md:px-12 pt-12 pb-8">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-14 mb-10">
          <div className="col-span-2 md:col-span-1">
            <a href="#hero" className="font-display text-[22px] text-on-feature tracking-wide block mb-2">
              MENTAL<span className="text-orange">VISION</span>
            </a>
            <p className="font-mono text-[8px] text-on-feature/25 tracking-[0.18em] uppercase leading-[1.9] mb-4">
              AI Visibility + Cinematic Creative<br/>
              Indianapolis, Indiana · Est. 2024<br/>
              #17 of 8,500+ AI Creators · Skool Community
            </p>
            <a href="mailto:create@mentalvision.ai"
               className="font-mono text-[9px] text-orange/60 hover:text-orange tracking-[0.1em] transition-colors">
              create@mentalvision.ai
            </a>
          </div>
          {[
            { head: 'Services', links: serviceLinks },
            { head: 'Company',  links: companyLinks },
            { head: 'Connect',  links: connectLinks },
          ].map(({ head, links }) => (
            <div key={head}>
              <div className="font-mono text-[7px] text-on-feature/20 tracking-[0.3em] uppercase mb-3.5 pb-2.5 border-b border-on-feature/8">
                {head}
              </div>
              {links.map(l => (
                <a key={l} href="#" className="block text-[13px] text-on-feature/30 font-light mb-2 hover:text-on-feature transition-colors">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-5 border-t border-on-feature/8">
          <div className="font-mono text-[8px] text-on-feature/20 tracking-[0.12em]">
            © 2026 Mental Vision Corp · All rights reserved · Indianapolis, IN
          </div>
          <div className="font-mono text-[8px] text-on-feature/15 tracking-[0.1em]">
            AI Visibility + Cinematic Creative · Signal Flare System v3.0
          </div>
        </div>
      </div>
    </footer>
  )
}
