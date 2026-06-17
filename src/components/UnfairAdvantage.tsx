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
  'Every agency talks about rankings. We measure whether ChatGPT, Claude, Perplexity, and Google AI can actually find you — and whether they trust what they find enough to recommend you.';

const BOXES = [
  {
    num: '01',
    numColor: '#ff5a1f',
    title: 'We Start With Proof',
    body: 'Agencies give you decks. We give you a score — 0 to 100, measured the same way across every AI engine making recommendations right now.',
  },
  {
    num: '02',
    numColor: '#00b8a9',
    title: 'Speak AI Fluently',
    body: 'Most businesses don\'t.\nMost agencies can\'t.',
  },
  {
    num: '03',
    numColor: '#fff45f',
    title: 'Future-Proof by Design',
    body: 'New engines come.\nInfrastructure stays.',
  },
  {
    num: '04',
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
          const split1 = splitText(line1El, { chars: true });
          const split2 = splitText(line2El, { chars: true });

          animate(split1.chars, {
            opacity: [0, 1],
            translateY: ['40px', '0px'],
            duration: 900,
            delay: stagger(22),
            ease: 'outExpo',
          });

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
              el.textContent = `0${Math.round(obj.val)}`;
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
            <span className="ua-headline-l1 ua-anim-target">{HEADLINE_LINE1}</span>
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
                {box.body.split('\n').map((line, j) => (
                  <span key={j} className="ua-box-line">
                    {line}
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
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ua-teal);
    margin-bottom: 28px;
    opacity: 0.9;
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
  }

  /* Instrument Serif italic for the question line */
  .ua-accent {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: var(--ua-yellow);
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
    max-width: 900px;
    margin: 0 auto 80px;
    padding: 0 32px;
    gap: 1px;
    background: var(--ua-border);
    border: 1px solid var(--ua-border);
  }

  /* ── Box ─────────────────────────────────────────────────── */
  .ua-box {
    position: relative;
    background: var(--ua-box-bg);
    padding: 48px 44px 52px;
    overflow: hidden;
    opacity: 0; /* animates in */
    clip-path: inset(100% 0% 0% 0%);
    transition: background 0.4s ease;
  }

  .ua-box:hover {
    background: #181818;
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
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-bottom: 20px;
    /* color set inline per box */
  }

  /* Title */
  .ua-box-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(20px, 2.2vw, 26px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--ua-cream);
    margin: 0 0 16px;
  }

  /* Body */
  .ua-box-body {
    font-family: 'Geist Mono', 'Courier New', monospace;
    font-size: clamp(12px, 1.3vw, 14px);
    line-height: 1.75;
    color: rgba(240, 235, 224, 0.5);
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
  }
`;
