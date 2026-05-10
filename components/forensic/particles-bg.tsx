"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { ISourceOptions } from "@tsparticles/engine"

const particleConfig: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: {
      value: 80,
      density: { enable: true },
    },
    color: { value: ["#3a8fe8", "#38bdf8", "#818cf8", "#1a2640"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.05, max: 0.4 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 1, max: 2.5 },
      animation: { enable: true, speed: 1.5, sync: false },
    },
    links: {
      enable: true,
      distance: 130,
      color: "#3a8fe8",
      opacity: 0.12,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      outModes: { default: "bounce" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: false },
    },
    modes: {
      grab: { distance: 160, links: { opacity: 0.3 } },
    },
  },
  detectRetina: true,
}

export function ParticlesBg() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Particles
      id="tsparticles"
      options={particleConfig}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
