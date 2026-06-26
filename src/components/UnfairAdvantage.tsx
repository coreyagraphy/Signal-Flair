'use client';
// @ts-nocheck
/* eslint-disable */

/**
 * SIGNAL FLAIR — UNFAIR ADVANTAGE SECTION
 * 
 * Drop-in replacement for the existing UNFAIR ADVANTAGE section.
 * 
 * Design system:
 *   Fonts    — Fraunces (display) · Instrument Serif italic (accent) · Geist Mono (mono)
 *   Palette  — yellow #fff45f · orange #ff5a1f · teal #00b8a9 · cream #f0ebe0 · near-black #0a0a0a
 *   Theme    — Cinematic-Brutalism. Dark section.
 * 
 * Animation — Anime.js v4 scroll-triggered. Each box animates on entry.
 *   Headline: chars split + staggered rise from below
 *   Subheadline: word-level fade-slide
 *   Boxes: clip-reveal + number count-up + subtle shimmer on hover
 *   No looping. One shot on scroll entry. Purposeful.
 * 
 * Install:
 *   npm install animejs
 *   Place this file in your components directory.
 *   Import and drop into your page where the old UNFAIR ADVANTAGE section lives.
 */

import { useEffect, useRef } from 'react';

// ─── COPY ────────────────────────────────────────────────────────────────────

const HEADLINE_LINE1 = 'The AI already has an opinion.';
const HEADLINE_LINE2 = 'Do you know what it is?';

const SUBHEADLINE =
  'Most AEO tools hand you a dashboard and a score, then leave the fixing to you. Signal Flair is different: we measure whether ChatGPT, Claude, Perplexity, and Google AI can actually find you — then build the proof layer that closes the gaps.';

const BOXES = [
  {
    num: '1',
    numColor: '#ff5a1f',
    title: 'We Start With Proof',
    body: 'Agencies give you decks. We give you a score — 0 to 100, measured the same way across every AI engine making recommendations right now.',
  },
  {
    num: '2',
    numColor: '#00b8a9',
    title: 'Speak AI Fluently',
    body: 'Most businesses don\'t.\nMost agencies can\'t.',
  },
  {
    num: '3',
    numColor: '#fff45f',
    title: 'Future-Proof by Design',
    body: 'New engines come.\nInfrastructure stays.',
  },
  {
    num: '4',
    numColor: '#ff5a1f',
    title: 'No Lock-In. Ever.',
    body: 'The llms.txt, the schema, the infrastructure — it\'s yours the day we build it. Cancel anytime. You keep everything.',
  },
];

const BOTTOM_LINE1 = 'Copy the pitch all you want.';
const BOTTOM_LINE2 = "You can't copy the system.";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function UnfairAdvantage() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let animeModule: typeof import('animejs') | null = null;

    const runAnimations = async () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      // Respect reduced motion — reveal everything static, skip all animation.
      if (typeof window !== 'undefined' && window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.ua-anim-target, .ua-box, .ua-sub').forEach((el) => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.clipPath = 'none';
          (el as HTMLElement).style.transform = 'none';
        });
        return;
      }

      try {
        animeModule = await import('animejs');
        const { animate, stagger, splitText } = animeModule;

        // ── Headline chars ────────────────────────────────────────────────
        const line1El = document.querySelector('.ua-headline-l1') as HTMLElement;
        const line2El = document.querySelector('.ua-headline-l2') as HTMLElement;

        if (line1El && line2El) {
          // Line 1 animates as a block so the bigger "AI" span isn't split apart.
          animate(line1El, {
            opacity: [0, 1],
            translateY: ['40px', '0px'],
            duration: 900,
            ease: 'outExpo',
          });

          const split2 = splitText(line2El, { chars: true });

          animate(split2.chars, {
            opacity: [0, 1],
            translateY: ['40px', '0px'],
            duration: 900,
            delay: stagger(22, { start: 400 }),
            ease: 'outExpo',
          });
        }

        // ── Subheadline words ─────────────────────────────────────────────
        const subEl = document.querySelector('.ua-sub') as HTMLElement;
        if (subEl) {
          const splitSub = splitText(subEl, { words: true });
          animate(splitSub.words, {
            opacity: [0, 1],
            translateY: ['12px', '0px'],
            duration: 600,
            delay: stagger(28, { start: 800 }),
            ease: 'outCubic',
          });
        }

        // ── Boxes clip-reveal ─────────────────────────────────────────────
        const boxes = document.querySelectorAll('.ua-box');
        animate(boxes, {
          clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
          opacity: [0, 1],
          duration: 800,
          delay: stagger(120, { start: 600 }),
          ease: 'outExpo',
        });

        // ── Box numbers count up ──────────────────────────────────────────
        const numEls = document.querySelectorAll('.ua-box-num');
        numEls.forEach((el, i) => {
          const target = i + 1;
          const obj = { val: 0 };
          animate(obj, {
            val: target,
            duration: 1200,
            delay: 600 + i * 120,
            ease: 'outExpo',
            onUpdate: () => {
              el.textContent = `${Math.round(obj.val)}`;
            },
          });
        });

        // ── Bottom callout lines ──────────────────────────────────────────
        const bottom1 = document.querySelector('.ua-bottom-l1') as HTMLElement;
        const bottom2 = document.querySelector('.ua-bottom-l2') as HTMLElement;

        if (bottom1 && bottom2) {
          animate([bottom1, bottom2], {
            opacity: [0, 1],
            translateY: ['24px', '0px'],
            duration: 800,
            delay: stagger(160, { start: 1200 }),
            ease: 'outExpo',
          });
        }
      } catch (err) {
        // Anime.js failed — elements still visible via CSS fallback
        console.warn('Anime.js animation skipped:', err);
        document.querySelectorAll('.ua-anim-target').forEach((el) => {
          (el as HTMLElement).style.opacity = '1';
        });
      }
    };

    // ── IntersectionObserver — fires once when section enters viewport ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimations();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section ref={sectionRef} className="ua-section">

        {/* ── Ambient texture ── */}
        <div className="ua-grain" aria-hidden="true" />
        <div className="ua-vignette" aria-hidden="true" />

        {/* ── Header block ── */}
        <div className="ua-header">
          <span className="ua-eyebrow">THE UNFAIR ADVANTAGE</span>

          <h2 className="ua-headline">
            <span className="ua-headline-l1 ua-anim-target"><span className="ua-ai">AI</span> already has an opinion.</span>{' '}
            <span className="ua-headline-l2 ua-accent ua-anim-target">{HEADLINE_LINE2}</span>
          </h2>

          <p className="ua-sub ua-anim-target">{SUBHEADLINE}</p>
        </div>

        {/* ── Four boxes ── */}
        <div className="ua-grid">
          {BOXES.map((box, i) => (
            <div key={i} className="ua-box ua-anim-target">
              {/* Shimmer layer — CSS-only on hover */}
              <div className="ua-box-shimmer" aria-hidden="true" />

              <span
                className="ua-box-num"
                style={{ color: box.numColor }}
              >
                {box.num}
              </span>

              <h3 className="ua-box-title">{box.title}</h3>

              <p className="ua-box-body">
                {box.body.split('\n').map((line, j, arr) => (
                  <span key={j} className="ua-box-line">
                    {j < arr.length - 1 ? line + ' ' : line}
                  </span>
                ))}
              </p>

              {/* Bottom border accent — color-coded per box */}
              <div
                className="ua-box-accent-bar"
                style={{ background: box.numColor }}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom callout ── */}
        <div className="ua-bottom">
          <p className="ua-bottom-l1 ua-anim-target">{BOTTOM_LINE1}</p>
          <p className="ua-bottom-l2 ua-anim-target ua-bottom-accent">{BOTTOM_LINE2}</p>
        </div>

      </section>
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = `
  /* ── Tokens ─────────────────────────────────────────────── */
  :root {
    --ua-yellow:     #fff45f;
    --ua-orange:     #ff5a1f;
    --ua-teal:       #00b8a9;
    --ua-cream:      #f0ebe0;
    --ua-black:      #0a0a0a;
    --ua-black-mid:  #111111;
    --ua-box-bg:     #141414;
    --ua-border:     rgba(240, 235, 224, 0.07);
  }

  /* ── Section shell ───────────────────────────────────────── */
  .ua-section {
    position: relative;
    background: var(--ua-black);
    padding: 120px 0 140px;
    overflow: hidden;
  }

  /* Grain texture overlay */
  .ua-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    opacity: 0.028;
    pointer-events: none;
    z-index: 0;
  }

  /* Radial vignette — pulls focus to center */
  .ua-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% 50%,
      transparent 40%,
      rgba(0, 0, 0, 0.55) 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ──────────────────────────────────────────────── */
  .ua-header {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto 80px;
    padding: 0 32px;
    text-align: left;
  }

  .ua-eyebrow {
    display: block;
    font-family: 'Geist Mono', 'Courier New', monospace;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ua-teal);
    margin-bottom: 28px;
    opacity: 1;
  }

  .ua-headline {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0 0 32px;
    padding: 0;
  }

  .ua-headline-l1,
  .ua-headline-l2 {
    display: block;
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(44px, 6.5vw, 88px);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: var(--ua-cream);
    text-shadow: 0 0 36px rgba(240, 235, 224, 0.18);
  }

  /* Instrument Serif italic for the question line */
  .ua-accent {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: var(--ua-yellow);
    text-shadow: 0 0 40px rgba(255, 244, 95, 0.34);
  }

  /* "AI" — robotic/digital: mono font, oversized, with a circuit-tracer sweep */
  .ua-ai {
    font-family: 'Geist Mono', ui-monospace, 'Courier New', monospace;
    font-size: 1.5em;
    font-weight: 800;
    letter-spacing: -0.07em;
    background: linear-gradient(150deg, #bafff6 0%, #00d2bf 30%, #ffffff 50%, #00b8a9 70%, #0a7d72 100%);
    background-size: 240% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 16px rgba(0, 184, 169, 0.6)) drop-shadow(0 0 42px rgba(0, 184, 169, 0.3));
    animation: ua-ai-tracer 2.8s linear infinite;
  }

  @keyframes ua-ai-tracer {
    0% { background-position: 220% 0; }
    100% { background-position: -120% 0; }
  }

  /* Anime.js splits text — preserve layout */
  .ua-headline-l1 .char,
  .ua-headline-l2 .char {
    display: inline-block;
  }

  .ua-sub {
    font-family: 'Geist Mono', 'Courier New', monospace;
    font-size: clamp(13px, 1.5vw, 16px);
    line-height: 1.7;
    color: rgba(240, 235, 224, 0.55);
    max-width: 680px;
    margin: 0;
    opacity: 0; /* animates in */
  }

  /* Anime.js word spans */
  .ua-sub .word {
    display: inline-block;
  }

  /* ── Grid ────────────────────────────────────────────────── */
  .ua-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    max-width: 1080px;
    margin: 0 auto 90px;
    padding: 0 32px;
    gap: 26px;
    perspective: 1600px;
  }

  /* ── Box ─────────────────────────────────────────────────── */
  .ua-box {
    position: relative;
    background: #141210;
    padding: 56px 52px 62px;
    overflow: hidden;
    opacity: 0; /* animates in */
    clip-path: inset(100% 0% 0% 0%);
    border: 1px solid rgba(240, 235, 224, 0.14);
    border-radius: 20px;
    transform-style: preserve-3d;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    box-shadow: 0 34px 70px -30px rgba(0, 0, 0, 0.9), 0 10px 24px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 30px rgba(255, 255, 255, 0.02);
    animation: ua-float 7s ease-in-out infinite;
    transition: border-color 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;
  }

  .ua-box:hover {
    border-color: rgba(240, 235, 224, 0.3);
    box-shadow: 0 52px 96px -28px rgba(0, 0, 0, 0.95), 0 16px 36px -10px rgba(0, 0, 0, 0.7);
    filter: brightness(1.1);
    animation-play-state: paused;
  }

  /* Ombré tint per card — fades from the accent color into deep dark */
  .ua-box:nth-child(1) { background: linear-gradient(155deg, rgba(255, 90, 31, 0.18) 0%, #161310 46%, #0e0c0b 100%); }
  .ua-box:nth-child(2) { background: linear-gradient(155deg, rgba(0, 184, 169, 0.18) 0%, #101615 46%, #0b0d0d 100%); animation-delay: -1.75s; }
  .ua-box:nth-child(3) { background: linear-gradient(155deg, rgba(255, 244, 95, 0.14) 0%, #16150f 46%, #0e0d0a 100%); animation-delay: -3.5s; }
  .ua-box:nth-child(4) { background: linear-gradient(155deg, rgba(255, 90, 31, 0.18) 0%, #161310 46%, #0e0c0b 100%); animation-delay: -5.25s; }

  @keyframes ua-float {
    0%, 100% { transform: translateY(0) rotateX(0deg); }
    50% { transform: translateY(-12px) rotateX(1.5deg); }
  }

  /* Shimmer sweep on hover — CSS only, no JS */
  .ua-box-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255, 255, 255, 0.025) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    pointer-events: none;
  }

  .ua-box:hover .ua-box-shimmer {
    transform: translateX(100%);
  }

  /* Number */
  .ua-box-num {
    display: block;
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(76px, 7vw, 108px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-bottom: 22px;
    /* color set inline per box; glow uses that color via currentColor */
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.35), 0 0 20px currentColor, 0 0 42px currentColor;
  }

  /* Title */
  .ua-box-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(24px, 2.6vw, 33px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--ua-cream);
    margin: 0 0 16px;
  }

  /* Body */
  .ua-box-body {
    font-family: 'Geist Mono', 'Courier New', monospace;
    font-size: clamp(14px, 1.55vw, 17px);
    line-height: 1.72;
    color: rgba(240, 235, 224, 0.8);
    margin: 0;
  }

  .ua-box-line {
    display: block;
  }

  /* Bottom accent bar */
  .ua-box-accent-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .ua-box:hover .ua-box-accent-bar {
    opacity: 1;
  }

  /* ── Bottom callout ──────────────────────────────────────── */
  .ua-bottom {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 32px;
    text-align: left;
  }

  .ua-bottom-l1,
  .ua-bottom-l2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(28px, 4vw, 56px);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0;
    opacity: 0; /* animates in */
  }

  .ua-bottom-l1 {
    color: var(--ua-cream);
  }

  .ua-bottom-accent {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: var(--ua-orange);
  }

  /* ── Responsive ──────────────────────────────────────────── */
  @media (max-width: 700px) {
    .ua-section {
      padding: 80px 0 100px;
    }

    .ua-header,
    .ua-bottom {
      padding: 0 20px;
    }

    .ua-grid {
      grid-template-columns: 1fr;
      padding: 0 20px;
    }

    .ua-box {
      padding: 36px 28px 40px;
    }

    .ua-box-num {
      font-size: 48px;
    }
  }

  /* ── Anime.js not loaded fallback ────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .ua-anim-target,
    .ua-box,
    .ua-sub {
      opacity: 1 !important;
      clip-path: none !important;
      transform: none !important;
    }
    .ua-box, .ua-ai { animation: none !important; }
  }
`;
