import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Branded title reveal — the first Content OS Remotion composition.
 * Props are fully editable (text, colors); render is deterministic
 * (no Date.now/Math.random). Works over a transparent background so the
 * ProRes 4444 render drops onto any timeline.
 */
export const TitleReveal = ({
  title = "TITLE REVEAL",
  subtitle = "",
  accentColor = "#ff5a1f",
  textColor = "#ffffff",
  backgroundColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const barWidth = interpolate(slide, [0, 1], [0, 100]);
  const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(slide, [0, 1], [40, 0]);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            height: 8,
            width: `${barWidth}%`,
            minWidth: 0,
            maxWidth: 560,
            margin: "0 auto 28px",
            backgroundColor: accentColor,
            borderRadius: 4,
          }}
        />
        <h1
          style={{
            color: textColor,
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: "0.02em",
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow: "0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              color: accentColor,
              fontSize: 44,
              fontWeight: 600,
              marginTop: 18,
              opacity: titleOpacity,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
