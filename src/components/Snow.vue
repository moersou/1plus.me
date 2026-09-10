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

  const flakes = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 0.8 + 0.3,
    drift: Math.random() * 0.6 - 0.3,
  }))

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDark = document.documentElement.classList.contains('dark')

    ctx.fillStyle = isDark
      ? 'rgba(255, 255, 255, 0.75)'
      : 'rgba(90, 110, 130, 0.35)'

    for (const flake of flakes) {
      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2)
      ctx.fill()

      flake.y += flake.speed
      flake.x += flake.drift

      if (flake.y > canvas.height) {
        flake.y = -5
        flake.x = Math.random() * canvas.width
      }

      if (flake.x > canvas.width)
        flake.x = 0

      if (flake.x < 0)
        flake.x = canvas.width
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
