<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationId = 0

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const canvasEl = canvas
  const context = ctx

  const flakes = Array.from({ length: 30 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 0.8 + 0.3,
    drift: Math.random() * 0.6 - 0.3,
  }))

  function resize() {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }

  function draw() {
    context.clearRect(0, 0, canvasEl.width, canvasEl.height)

    const isDark = document.documentElement.classList.contains('dark')

    context.fillStyle = isDark
      ? 'rgba(255, 255, 255, 0.75)'
      : 'rgba(90, 110, 130, 0.35)'

    for (const flake of flakes) {
      context.beginPath()
      context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2)
      context.fill()

      flake.y += flake.speed
      flake.x += flake.drift

      if (flake.y > canvasEl.height) {
        flake.y = -5
        flake.x = Math.random() * canvasEl.width
      }

      if (flake.x > canvasEl.width)
        flake.x = 0

      if (flake.x < 0)
        flake.x = canvasEl.width
    }

    animationId = requestAnimationFrame(draw)
  }

  resize()
  draw()

  window.addEventListener('resize', resize)

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="snow-canvas"
  />
</template>

<style scoped>
.snow-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}
</style>
