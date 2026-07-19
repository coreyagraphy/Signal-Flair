import React from "react";
import { Composition } from "remotion";
import { TitleReveal } from "./TitleReveal.jsx";

export const RemotionRoot = () => (
  <>
    <Composition
      id="TitleReveal"
      component={TitleReveal}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "TITLE REVEAL",
        subtitle: "",
        accentColor: "#ff5a1f",
        textColor: "#ffffff",
        backgroundColor: "transparent",
      }}
    />
    <Composition
      id="TitleRevealVertical"
      component={TitleReveal}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: "TITLE REVEAL",
        subtitle: "",
        accentColor: "#ff5a1f",
        textColor: "#ffffff",
        backgroundColor: "transparent",
      }}
    />
  </>
);
