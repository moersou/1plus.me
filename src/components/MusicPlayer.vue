<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// ===== 歌单：保留你自己的歌名和路径 =====
const tracks = [
  { title: '灿', src: '/music/旧北乐队 - 灿.mp3' },
  { title: 'We Are the World', src: '/music/The Columbia River Players - We Are the World.mp3' },
  { title: '道别是一件难事', src: '/music/上海彩虹室内合唱团 - 道别是一件难事.mp3' },
]

const audio = ref<HTMLAudioElement | null>(null)
const expanded = ref(false)
const playing = ref(false)
const loading = ref(false)
const error = ref('')
const index = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const track = computed(() => tracks[index.value]!)
let requestId = 0

// ===== 位置与拖动 =====
const STORAGE_KEY = 'neil-music-position'
const SIZE = 80
const HEIGHT = 52
const MARGIN = 12

const viewport = ref({ width: 390, height: 800 })
const position = ref({ x: 298, y: 676 })
const side = ref<'left' | 'right'>('right')
const ready = ref(false)
const dragging = ref(false)

let pointerId: number | null = null
let startX = 0
let startY = 0
let originX = 0
let originY = 0
let suppressClick = false

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, Math.max(min, max)))
}

function maxY() {
  return viewport.value.height - HEIGHT - MARGIN
}

function dockX() {
  return side.value === 'left'
    ? MARGIN
    : Math.max(MARGIN, viewport.value.width - SIZE - MARGIN)
}

function savePosition() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      side: side.value,
      ratio: (position.value.y - MARGIN)
        / Math.max(1, maxY() - MARGIN),
    }))
  }
  catch {
    // 禁用本地存储时，仍可正常拖动和播放
  }
}

function onPointerDown(event: PointerEvent) {
  if (!event.isPrimary || event.button !== 0 || pointerId !== null)
    return

  pointerId = event.pointerId
  startX = event.clientX
  startY = event.clientY
  originX = position.value.x
  originY = position.value.y
  suppressClick = false

  const button = event.currentTarget as HTMLButtonElement
  button.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (pointerId !== event.pointerId)
    return

  const dx = event.clientX - startX
  const dy = event.clientY - startY

  if (!dragging.value && Math.hypot(dx, dy) < 8)
    return

  dragging.value = true
  suppressClick = true
  expanded.value = false

  position.value = {
    x: clamp(
      originX + dx,
      MARGIN,
      viewport.value.width - SIZE - MARGIN,
    ),
    y: clamp(originY + dy, MARGIN, maxY()),
  }
}

function finishDrag(event: PointerEvent) {
  if (pointerId !== event.pointerId)
    return

  if (dragging.value) {
    side.value = position.value.x + SIZE / 2
      < viewport.value.width / 2
      ? 'left'
      : 'right'

    position.value.x = dockX()
    savePosition()
  }

  dragging.value = false
  pointerId = null
}

function onPlayClick(event: MouseEvent) {
  // 拖动结束产生的点击不触发播放；键盘点击正常工作
  if (suppressClick && event.detail !== 0) {
    suppressClick = false
    return
  }

  toggle()
}

const playerStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}))

const panelStyle = computed(() => {
  const above = position.value.y - MARGIN - 10
  const below = viewport.value.height
    - position.value.y - HEIGHT - MARGIN - 10
  const openUp = above >= below

  const panelWidth = Math.min(260, viewport.value.width - MARGIN * 2)
  const preferredLeft = side.value === 'left'
    ? position.value.x
    : position.value.x + SIZE - panelWidth
  const panelLeft = clamp(preferredLeft, MARGIN, viewport.value.width - panelWidth - MARGIN)

  return {
    width: `${panelWidth}px`,
    maxHeight: `${Math.max(0, Math.min(340, openUp ? above : below))}px`,
    left: `${panelLeft - position.value.x}px`,
    right: 'auto',
    top: openUp ? 'auto' : 'calc(100% + 10px)',
    bottom: openUp ? 'calc(100% + 10px)' : 'auto',
  }
})

function resize() {
  const ratio = (position.value.y - MARGIN)
    / Math.max(1, maxY() - MARGIN)

  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  position.value = {
    x: dockX(),
    y: clamp(
      MARGIN + ratio * (maxY() - MARGIN),
      MARGIN,
      maxY(),
    ),
  }
}

// ===== 音频播放 =====
const progress = computed(() => {
  if (!duration.value)
    return 0
  return clamp(currentTime.value / duration.value, 0, 1)
})

// 圆周长：2 × π × 22
const circumference = 2 * Math.PI * 22

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds))
    return '0:00'

  return `${Math.floor(seconds / 60)}:${String(
    Math.floor(seconds % 60),
  ).padStart(2, '0')}`
}

async function play() {
  const el = audio.value
  if (!el)
    return

  const id = ++requestId
  error.value = ''
  loading.value = true

  try {
    // 点击播放后才加载音乐
    if (!el.getAttribute('src'))
      el.src = track.value.src

    await el.play()
  }
  catch (err) {
    if (id !== requestId)
      return

    if (!(err instanceof Error && err.name === 'AbortError')) {
      error.value = '播放失败，请检查音乐文件后重试'
      expanded.value = true
    }
  }
  finally {
    if (id === requestId)
      loading.value = false
  }
}

function pause() {
  requestId++
  audio.value?.pause()
  playing.value = false
  loading.value = false
}

function toggle() {
  if (playing.value || loading.value)
    pause()
  else
    void play()
}

function selectTrack(next: number) {
  const el = audio.value
  if (!el)
    return

  pause()
  index.value = (next + tracks.length) % tracks.length
  currentTime.value = 0
  duration.value = 0
  error.value = ''
  el.src = track.value.src
  el.load()
  void play()
}

function updateTime() {
  currentTime.value = audio.value?.currentTime || 0
}

function updateDuration() {
  const value = audio.value?.duration
  duration.value = value && Number.isFinite(value) ? value : 0
}

function seek(event: Event) {
  const el = audio.value
  if (!el || !duration.value)
    return

  const value = Number((event.target as HTMLInputElement).value)
  el.currentTime = value
  currentTime.value = value
}

function onError() {
  requestId++
  loading.value = false
  playing.value = false
  error.value = '无法加载音乐，请检查文件路径'
  expanded.value = true
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    expanded.value = false
}

onMounted(() => {
  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  let y = viewport.value.height - HEIGHT - 80

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')

    if (
      saved
      && ['left', 'right'].includes(saved.side)
      && typeof saved.ratio === 'number'
      && Number.isFinite(saved.ratio)
    ) {
      side.value = saved.side
      y = MARGIN + clamp(saved.ratio, 0, 1) * (maxY() - MARGIN)
    }
  }
  catch {
    // 无有效记录时使用默认位置
  }

  position.value = {
    x: dockX(),
    y: clamp(y, MARGIN, maxY()),
  }

  ready.value = true
  window.addEventListener('resize', resize)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  pause()
  window.removeEventListener('resize', resize)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport v-if="ready" to="body">
    <div
      class="nz-music-player"
      :class="{ 'nz-dragging': dragging, 'nz-dock-left': side === 'left' }"
      :style="playerStyle"
    >
      <audio
        ref="audio"
        preload="none"
        @playing="playing = true; loading = false"
        @pause="playing = false"
        @waiting="loading = true"
        @timeupdate="updateTime"
        @loadedmetadata="updateDuration"
        @durationchange="updateDuration"
        @ended="selectTrack(index + 1)"
        @error="onError"
      />

      <section
        v-if="expanded"
        id="nz-music-panel"
        class="nz-music-panel"
        :style="panelStyle"
        aria-label="音乐播放器"
      >
        <div class="nz-panel-heading">
          <span>浮窗可拖拽</span>
          <button
            class="nz-close-button"
            aria-label="收起歌单"
            @click="expanded = false"
          >
            <svg class="nz-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
          </button>
        </div>

        <ul class="nz-track-list">
          <li v-for="(item, i) in tracks" :key="item.src">
            <button
              class="nz-track-button"
              :class="{ 'nz-selected': i === index }"
              :aria-current="i === index ? 'true' : undefined"
              @click="selectTrack(i)"
            >
              <span class="nz-track-number">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="nz-track-title">{{ item.title }}</span>
              <svg v-if="i === index && playing" class="nz-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10v4m6-8v12m6-9v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </li>
        </ul>

        <div class="nz-progress-area">
          <input
            class="nz-progress-slider"
            type="range"
            min="0"
            :max="duration || 1"
            step="0.1"
            :value="currentTime"
            :disabled="!duration"
            aria-label="播放进度"
            :aria-valuetext="formatTime(currentTime)"
            @input="seek"
          >
          <div class="nz-time-labels">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <p v-if="error" class="nz-music-error" role="alert">
          {{ error }}
        </p>
      </section>

      <div class="nz-music-controls">
        <button
          class="nz-play-orb"
          :aria-label="`${playing || loading ? '暂停' : '播放'}：${track.title}`"
          title="点击播放或暂停，拖动调整位置"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="finishDrag"
          @pointercancel="finishDrag"
          @lostpointercapture="finishDrag"
          @click="onPlayClick"
        >
          <svg
            class="nz-progress-ring"
            width="52"
            height="52"
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <circle class="nz-ring-track" cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="2" />
            <circle
              class="nz-ring-value"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              cx="26"
              cy="26"
              r="22"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference * (1 - progress)"
            />
          </svg>

          <svg class="nz-main-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle v-if="loading" class="nz-spinner" cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="30 14" />
            <path v-else-if="playing" d="M8 6v12M16 6v12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            <path v-else d="M9 5.8 18 12 9 18.2Z" fill="currentColor" />
          </svg>
        </button>

        <button
          class="nz-expand-button"
          :aria-expanded="expanded"
          aria-controls="nz-music-panel"
          :aria-label="expanded ? '收起歌单' : '展开歌单'"
          @click="expanded = !expanded"
        >
          <svg class="nz-expand-arrow" :class="{ 'nz-points-left': (side === 'right') !== expanded }" viewBox="0 0 20 20" aria-hidden="true"><path d="m8 6 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<!-- 独立 nz- 命名，避免与旧播放器样式混用。 -->
<style>
.nz-music-player {
  --player-bg: #f4ece2;
  --player-text: #493b33;
  --player-muted: #79695d;
  --player-accent: #98654e;
  --player-hover: #98654e12;
  --player-border: #98654e26;
  --player-track: #98654e26;

  position: fixed;
  right: auto;
  bottom: auto;
  isolation: isolate;
  z-index: 110;
  width: 80px;
  height: 52px;
  color: var(--player-text);
  font-size: 14px;
  transition:
    left 220ms ease,
    top 220ms ease;
}

html.dark .nz-music-player {
  --player-bg: #211b18;
  --player-text: #eee3d8;
  --player-muted: #baaa9c;
  --player-accent: #d2a087;
  --player-hover: #d2a08714;
  --player-border: #d2a08726;
  --player-track: #d2a08726;
}

.nz-music-player.nz-dragging {
  transition: none;
}

.nz-music-player button {
  box-sizing: border-box;
  font: inherit;
  appearance: none;
  -webkit-appearance: none;
  color: inherit;
  cursor: pointer;
  border: 0;
}

.nz-music-player button:focus-visible,
.nz-progress-slider:focus-visible {
  outline: 2px solid var(--player-accent);
  outline-offset: 3px;
}

.nz-music-controls {
  display: flex;
  align-items: center;
  width: 80px;
  height: 52px;
  border-radius: 28px;
  background: var(--player-bg);
  box-shadow:
    0 4px 18px #00000018,
    inset 0 0 0 1px var(--player-border);
}

/* 圆形按钮始终靠近屏幕边缘 */
.nz-music-player:not(.nz-dock-left) .nz-music-controls {
  flex-direction: row-reverse;
}

.nz-play-orb {
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  color: var(--player-accent) !important;
  font-size: 24px !important;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.nz-dragging .nz-play-orb {
  cursor: grabbing;
}

.nz-progress-ring {
  position: absolute;
  inset: 0;
  width: 52px;
  height: 52px;
  pointer-events: none;
  transform: rotate(-90deg);
}

.nz-progress-ring circle {
  fill: none;
  stroke-width: 2;
}

.nz-ring-track {
  stroke: var(--player-track);
}

.nz-ring-value {
  stroke: var(--player-accent);
  stroke-linecap: round;
}

.nz-expand-button {
  display: grid;
  place-items: center;
  flex: 0 0 28px;
  width: 28px;
  height: 44px;
  padding: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--player-muted) !important;
}

.nz-expand-arrow {
  display: block;
  width: 20px;
  height: 20px;
}

.nz-expand-arrow.nz-points-left {
  transform: rotate(180deg);
}

.nz-music-panel {
  position: absolute;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px;
  background: var(--player-bg);
  border: 1px solid var(--player-border);
  border-radius: 18px;
  box-shadow: 0 8px 28px #00000020;
}

.nz-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.nz-close-button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  font-size: 20px !important;
}

.nz-close-button:hover,
.nz-track-button:hover {
  background: var(--player-hover);
}

.nz-track-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nz-track-button {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 44px;
  padding: 10px 8px;
  text-align: left;
  border-radius: 9px;
  background: transparent;
}

.nz-track-button.nz-selected {
  color: var(--player-accent);
  background: var(--player-hover);
}

.nz-track-number {
  color: var(--player-muted);
  font-size: 12px;
}

.nz-track-title {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.nz-progress-area {
  margin-top: 14px;
}

.nz-progress-slider {
  display: block;
  width: 100%;
  height: 24px;
  margin: 0;
  accent-color: var(--player-accent);
  cursor: pointer;
}

.nz-time-labels {
  display: flex;
  justify-content: space-between;
  color: var(--player-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.nz-music-error {
  margin: 12px 0 0;
  color: var(--player-accent);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.nz-spinner {
  transform-origin: 12px 12px;
  animation: music-spin 1s linear infinite;
}

@keyframes music-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nz-music-player {
    transition: none;
  }

  .nz-spinner {
    transform-origin: 12px 12px;
    animation: none;
  }
}

@media print {
  .nz-music-player {
    display: none !important;
  }
}
/* 图标和几何尺寸不依赖 UnoCSS。 */
.nz-music-player .nz-icon {
  display: block;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.nz-music-player .nz-main-icon {
  display: block;
  width: 22px;
  height: 22px;
  pointer-events: none;
}
.nz-music-player .nz-expand-arrow {
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}
.nz-music-player .nz-track-list > li {
  margin: 0;
  padding: 0;
}
.nz-music-player .nz-track-title {
  line-height: 1.5;
}
.nz-music-player .nz-progress-ring {
  display: block;
  max-width: none;
}
</style>
