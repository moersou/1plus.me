<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// 在这里修改歌名、文件路径，也可以继续添加歌曲
const tracks = [
  { title: '第一首 sample1', src: '/music/The Columbia River Players - We Are the World.mp3' },
  { title: '第二首 sample2', src: '/music/上海彩虹室内合唱团 - 道别是一件难事.mp3' },
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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds))
    return '0:00'

  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

async function play() {
  const el = audio.value
  if (!el)
    return

  const id = ++requestId
  error.value = ''
  loading.value = true

  try {
    // 第一次点击才设置地址，避免提前下载音乐
    if (!el.getAttribute('src'))
      el.src = track.value.src

    await el.play()
  }
  catch (err) {
    if (id !== requestId)
      return

    if (!(err instanceof Error && err.name === 'AbortError'))
      error.value = '播放失败，请检查音乐文件后重试'
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
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    expanded.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  pause()
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="music-player">
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
      id="music-panel"
      class="music-panel"
      aria-label="音乐列表"
    >
      <div class="panel-heading">
        <span>听点音乐</span>
        <button
          class="icon-button"
          aria-label="收起播放器"
          @click="expanded = false"
        >
          <span class="i-ri-close-line" aria-hidden="true" />
        </button>
      </div>

      <ul class="track-list">
        <li v-for="(item, i) in tracks" :key="item.src">
          <button
            class="track-button"
            :class="{ selected: i === index }"
            :aria-current="i === index ? 'true' : undefined"
            @click="selectTrack(i)"
          >
            <span class="track-number">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="track-title">{{ item.title }}</span>
            <span
              v-if="i === index && playing"
              class="i-ri-volume-up-line"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>

      <div class="progress-area">
        <input
          class="progress-slider"
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
        <div class="time-labels">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </section>

    <p v-if="error" class="music-error" role="alert">
      {{ error }}
    </p>

    <div class="music-capsule">
      <button
        class="play-button"
        :aria-label="playing || loading ? '暂停音乐' : '播放音乐'"
        @click="toggle"
      >
        <span
          v-if="loading"
          class="i-ri-loader-4-line spinner"
          aria-hidden="true"
        />
        <span
          v-else-if="playing"
          class="i-ri-pause-fill"
          aria-hidden="true"
        />
        <span
          v-else
          class="i-ri-play-fill"
          aria-hidden="true"
        />
      </button>

      <button
        class="song-button"
        :aria-expanded="expanded"
        aria-controls="music-panel"
        @click="expanded = !expanded"
      >
        <span class="song-title">{{ track.title }}</span>
        <span class="song-status">
          {{ loading ? '正在加载…' : playing ? '正在播放' : '听点音乐' }}
        </span>
      </button>

      <button
        v-if="tracks.length > 1"
        class="icon-button"
        aria-label="下一首"
        @click="selectTrack(index + 1)"
      >
        <span class="i-ri-skip-forward-fill" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.music-player {
  --player-bg: #f4ece2;
  --player-text: #493b33;
  --player-muted: #79695d;
  --player-accent: #98654e;
  --player-hover: #98654e12;
  --player-border: #98654e26;

  position: fixed;
  right: max(20px, env(safe-area-inset-right));
  bottom: calc(72px + env(safe-area-inset-bottom));
  z-index: 110;
  width: 244px;
  max-width: calc(100vw - 40px);
  color: var(--player-text);
  font-size: 14px;
}

:global(html.dark .music-player) {
  --player-bg: #211b18;
  --player-text: #eee3d8;
  --player-muted: #baaa9c;
  --player-accent: #d2a087;
  --player-hover: #d2a08714;
  --player-border: #d2a08726;
}

.music-capsule,
.music-panel,
.music-error {
  background: var(--player-bg);
  border: 1px solid var(--player-border);
  box-shadow: 0 8px 28px #00000012;
}

.music-capsule {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 9px;
  border-radius: 999px;
}

.music-player button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
}

.music-player button:focus-visible,
.progress-slider:focus-visible {
  outline: 2px solid var(--player-accent);
  outline-offset: 3px;
}

.play-button {
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--player-hover);
  color: var(--player-accent) !important;
  font-size: 23px !important;
}

.song-button {
  flex: 1;
  min-width: 0;
  padding: 0;
  text-align: left;
  background: transparent;
}

.song-title,
.song-status {
  display: block;
}

.song-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.song-status {
  margin-top: 3px;
  color: var(--player-muted);
  font-size: 12px;
}

.icon-button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  font-size: 19px !important;
}

.icon-button:hover,
.track-button:hover {
  background: var(--player-hover);
}

.music-panel {
  margin-bottom: 10px;
  padding: 14px;
  border-radius: 18px;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.track-list {
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 8px;
  text-align: left;
  border-radius: 8px;
  background: transparent;
}

.track-button.selected {
  color: var(--player-accent);
  background: var(--player-hover);
}

.track-number {
  font-size: 12px;
  color: var(--player-muted);
}

.track-title {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.progress-area {
  margin-top: 16px;
}

.progress-slider {
  width: 100%;
  margin: 0;
  accent-color: var(--player-accent);
  cursor: pointer;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  color: var(--player-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.music-error {
  padding: 10px 12px;
  margin: 0 0 10px;
  border-radius: 12px;
  font-size: 12px;
}

.spinner {
  animation: music-spin 1s linear infinite;
}

@keyframes music-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .music-player {
    right: max(12px, env(safe-area-inset-right));
    width: 210px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}

@media print {
  .music-player {
    display: none;
  }
}
</style>
