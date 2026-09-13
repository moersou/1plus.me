<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'

// ===== 以后更新近况，只需要修改这里 =====
const now = {
  heading: 'Neil 最近在干嘛 👀',
  secret: '以上状态不代表本人有在认真生活。🙃',
  movie: {
    title: '一一',
    english: 'A ONE AND A TWO',
    credit: '杨德昌 · 2000',
    review: '有些电影，\n会在散场以后\n继续放映。',
  },
  music: {
    title: 'We Are the World',
    artist: 'The Columbia River Players',
    // 必须与 MusicPlayer.vue 歌单里对应歌曲的 src 一致。
    src: '/music/The Columbia River Players - We Are the World.mp3',
  },
  note: {
    title: '本来只想\n改个背景色。',
    more: '现在网站已经能唱歌了。\n修播放器的时间比听歌还长。',
  },
  updated: '2026-09-13',
  signoff: '🕛 刚折腾完',
}
// ===== 内容配置结束 =====

const uid = useId()
const movieBack = ref(false)
const noteOpen = ref(false)
const secretOpen = ref(false)
const musicPlaying = ref(false)
const musicLoading = ref(false)
const musicMessage = ref('')
const dateLabel = computed(() => now.updated.slice(5).replace('-', '.'))
let replyReceived = false

interface PlayerState {
  src: string
  playing: boolean
  loading: boolean
  error: string
}

function onState(event: Event) {
  const state = (event as CustomEvent<PlayerState>).detail
  if (!state || typeof state.src !== 'string')
    return

  replyReceived = true
  const selected = state.src === now.music.src
  musicPlaying.value = selected && state.playing
  musicLoading.value = selected && state.loading
  musicMessage.value = selected ? state.error || '' : ''
}

function toggleMusic() {
  replyReceived = false
  musicMessage.value = ''

  // 复用全局播放器，不创建第二个音频实例。
  window.dispatchEvent(new CustomEvent('neil:music-toggle', {
    detail: { src: now.music.src },
  }))

  if (!replyReceived)
    musicMessage.value = '请先更新 MusicPlayer.vue，开启音乐联动。'
}

onMounted(() => {
  window.addEventListener('neil:music-state', onState)
  window.dispatchEvent(new Event('neil:music-query'))
})

onUnmounted(() => {
  window.removeEventListener('neil:music-state', onState)
})
</script>

<template>
  <section class="neil-now not-prose" :aria-labelledby="`${uid}-heading`">
    <div class="nn-heading">
      <span class="nn-tag">RIGHT NOW</span>
      <h2 :id="`${uid}-heading`">
        {{ now.heading }}
      </h2>
      <button
        class="nn-secret"
        type="button"
        :aria-expanded="secretOpen"
        :aria-controls="`${uid}-secret`"
        aria-label="看看小彩蛋"
        @click="secretOpen = !secretOpen"
      >
        ?
      </button>
    </div>

    <p v-if="secretOpen" :id="`${uid}-secret`" class="nn-secret-text">
      {{ now.secret }}
    </p>

    <div class="nn-stickers">
      <!-- 黄色电影票 -->
      <button
        class="nn-sticker nn-film"
        type="button"
        :aria-pressed="movieBack"
        :aria-label="movieBack ? '返回电影票面' : '翻开电影票，查看短评'"
        @click="movieBack = !movieBack"
      >
        <span class="nn-eyebrow">🎬 脑内放映中</span>
        <span class="nn-flip" :class="{ 'nn-flipped': movieBack }">
          <span class="nn-front" :aria-hidden="movieBack">
            <img
              class="nn-movie-cover no-preview"
              src="/images/A-One-and-a-Two.webp"
              alt="《一一》电影剧照"
              width="1080"
              height="715"
              loading="lazy"
              decoding="async"
            >
            <span class="nn-movie-title">{{ now.movie.title }}</span>
            <span class="nn-meta">
              {{ now.movie.english }}<br>{{ now.movie.credit }}
            </span>
          </span>
          <span class="nn-back" :aria-hidden="!movieBack">
            <span class="nn-review">{{ now.movie.review }}</span>
          </span>
        </span>
        <span class="nn-bottom">
          <span>{{ movieBack ? '再看一眼票面' : '翻过来，有话说' }}</span>
          <span aria-hidden="true">↗</span>
        </span>
      </button>

      <!-- 蓝色音乐贴纸：耳机随卡片一起倾斜 -->
      <button
        class="nn-sticker nn-music"
        :class="{ 'nn-is-playing': musicPlaying && !musicLoading }"
        type="button"
        :aria-pressed="musicPlaying"
        :aria-label="`${musicPlaying || musicLoading ? '暂停' : '播放'} ${now.music.title}`"
        @click="toggleMusic"
      >
        <!-- 内嵌矢量耳机，无外部图片请求 -->
        <svg
          class="nn-headphones"
          viewBox="0 0 240 130"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <!-- 头梁：拱起的部分露在卡片上方 -->
          <path
            d="M 22 85 C 22 -12 218 -12 218 85"
            stroke="#20368d"
            stroke-width="14"
            stroke-linecap="round"
          />
          <path
            d="M 22 85 C 22 -12 218 -12 218 85"
            stroke="#fff3df"
            stroke-width="11"
            stroke-linecap="round"
          />

          <!-- 左耳罩 -->
          <g class="nn-ear nn-ear-left">
            <path
              d="M 27 67 C 16 64 7 74 6 88
                 L 5 105 C 4 117 10 124 20 125
                 L 28 125 C 32 125 34 122 34 117
                 L 35 77 C 35 71 32 68 27 67 Z"
              fill="#fff3df"
              stroke="#20368d"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <path
              d="M 28 75 L 26 117"
              stroke="#d6c5ac"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M 15 86 Q 11 98 14 109"
              stroke="#20368d"
              stroke-width="2"
              stroke-linecap="round"
            />
          </g>

          <!-- 右耳罩 -->
          <g class="nn-ear nn-ear-right">
            <path
              d="M 213 67 C 224 64 233 74 234 88
                 L 235 105 C 236 117 230 124 220 125
                 L 212 125 C 208 125 206 122 206 117
                 L 205 77 C 205 71 208 68 213 67 Z"
              fill="#fff3df"
              stroke="#20368d"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <path
              d="M 212 75 L 214 117"
              stroke="#d6c5ac"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M 225 86 Q 229 98 226 109"
              stroke="#20368d"
              stroke-width="2"
              stroke-linecap="round"
            />
          </g>
        </svg>

        <span class="nn-eyebrow">耳机里循环</span>
        <span class="nn-music-title">{{ now.music.title }}</span>
        <span class="nn-meta">{{ now.music.artist }}</span>

        <!-- 7 根音柱：复用已有的播放状态 -->
        <span class="nn-music-beat" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>

        <span class="nn-bottom">
          <span>
            {{ musicLoading ? '正在加载…' : musicPlaying ? '这首，陪你一起听' : '分你一只耳机。' }}
          </span>
          <span class="nn-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <g v-if="musicPlaying || musicLoading">
                <rect x="7" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </g>
              <path v-else d="M 8 5 L 19 12 L 8 19 Z" />
            </svg>
          </span>
        </span>
      </button>

      <!-- 桃色便签 -->
      <button
        class="nn-sticker nn-note"
        type="button"
        :aria-expanded="noteOpen"
        :aria-controls="`${uid}-note`"
        @click="noteOpen = !noteOpen"
      >
        <span class="nn-eyebrow">🛠️ 又在瞎折腾</span>
        <span class="nn-note-title">{{ now.note.title }}</span>
        <span v-if="noteOpen" :id="`${uid}-note`" class="nn-note-more">
          {{ now.note.more }}
        </span>
        <span class="nn-bottom">
          <span>{{ noteOpen ? '好吧，收工。' : '然后呢？' }}</span>
          <span aria-hidden="true">{{ noteOpen ? '−' : '＋' }}</span>
        </span>
      </button>
    </div>

    <p v-if="musicMessage" class="nn-message" role="status">
      {{ musicMessage }}
    </p>
    <div class="nn-stamp">
      <span aria-hidden="true">✎</span>
      <span>
        <time :datetime="now.updated">{{ dateLabel }}</time> / {{ now.signoff }}
      </span>
    </div>
  </section>
</template>

<style>
/* ===== 基础和标题 ===== */
.neil-now {
  --nn-ink: #382920;
  --nn-muted: #70574a;
  width: 100%;
  margin: 1rem 0 2.5rem;
  color: var(--nn-ink);
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
  isolation: isolate;
}
html.dark .neil-now {
  --nn-ink: #f3e7db;
  --nn-muted: #c2aa98;
}
.neil-now *,
.neil-now *::before,
.neil-now *::after {
  box-sizing: border-box;
}
.neil-now button {
  font: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
}
.neil-now button:focus-visible {
  outline: 3px solid #617dff;
  outline-offset: 5px;
}
.neil-now .nn-heading {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin: 0 0 24px;
}
.neil-now .nn-heading h2 {
  font-size: 26px;
  letter-spacing: -1px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  color: var(--nn-ink);
}
.neil-now .nn-tag {
  background: #304cdc;
  color: #fff8e9;
  padding: 4px 9px;
  font-size: 11px;
  letter-spacing: 1px;
  transform: rotate(-7deg);
  border-radius: 4px;
}
.neil-now .nn-secret {
  margin-left: auto;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--nn-muted);
  border-radius: 50%;
  color: var(--nn-ink);
  background: transparent;
  font-size: 16px;
}
.neil-now .nn-secret-text {
  color: var(--nn-muted);
  font-size: 14px;
  margin: 6px 0 0px;
}

/* 顶部留出耳机空间；列间距容纳倾斜和耳罩。 */
.neil-now .nn-stickers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  align-items: start;
  padding: 66px 10px 18px;
}
.neil-now .nn-sticker {
  position: relative;
  min-width: 0;
  min-height: 240px;
  padding: 18px 16px;
  border: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 12px #00000013;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  color: #352819;
  overflow-wrap: anywhere;
}
.neil-now .nn-sticker:active {
  transform: scale(0.97);
}
.neil-now .nn-eyebrow {
  font-size: 12px;
  letter-spacing: 0.3px;
  margin-bottom: 15px;
  display: block;
}
.neil-now .nn-meta {
  font-size: 12px;
  display: block;
  line-height: 1.6;
}
.neil-now .nn-bottom {
  margin-top: auto;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  width: 100%;
}

/* ===== 黄色电影票 ===== */
.neil-now .nn-film {
  background: #f7df8e;
  transform: rotate(-3deg);
  border-radius: 4px 4px 12px 12px;
}
.neil-now .nn-flip {
  display: grid;
  width: 100%;
  perspective: 600px;
}
.neil-now .nn-front,
.neil-now .nn-back {
  grid-area: 1 / 1;
  display: block;
  backface-visibility: hidden;
  transition:
    transform 0.4s ease,
    visibility 0.4s;
}
.neil-now .nn-front {
  transform: rotateY(0);
}
.neil-now .nn-back {
  transform: rotateY(-180deg);
  visibility: hidden;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
}
.neil-now .nn-flipped .nn-front {
  transform: rotateY(180deg);
  visibility: hidden;
}
.neil-now .nn-flipped .nn-back {
  transform: rotateY(0);
  visibility: visible;
}
.neil-now .nn-movie-cover {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  margin: 0 0 12px;
  padding: 0;
  border: 3px solid #fff8e7;
  border-radius: 3px;
  box-shadow: 0 3px 8px #35281918;
}
.neil-now .nn-movie-title {
  display: block;
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -1px;
  margin: 0 0 6px;
  font-weight: 500;
}
.neil-now .nn-film .nn-bottom {
  border-top: 1px dashed #9e823e;
  margin-top: 19px;
}
.neil-now .nn-review {
  font-size: 19px;
  line-height: 1.7;
  display: block;
  padding: 12px 0;
  white-space: pre-line;
}

/* ===== 戴耳机的蓝色贴纸 ===== */
.neil-now .nn-music {
  /* 跟随所在网格行拉长，无需测量电影卡片。 */
  align-self: stretch;
  min-height: 300px;
  margin-top: 14px;
  padding-top: 32px;
  background: #304bd5;
  color: #fff6e9;
  transform: rotate(2.5deg);
  transform-origin: 50% 65%;
  border-radius: 15px;
  overflow: visible;
  z-index: 1;
}
.neil-now .nn-headphones {
  position: absolute;
  display: block;
  width: calc(100% + 12px);
  max-width: 260px;
  height: auto;
  left: 50%;
  top: 0;
  transform: translate(-50%, -60%);
  overflow: visible;
  pointer-events: none;
}
.neil-now .nn-music .nn-eyebrow {
  margin: 0 12px 22px;
}
.neil-now .nn-music-title {
  font-size: 25px;
  line-height: 1.15;
  letter-spacing: -0.7px;
  display: block;
  margin: 8px 0 12px;
  font-weight: 600;
}
.neil-now .nn-music .nn-meta {
  text-wrap: pretty;
}
.neil-now .nn-music .nn-bottom {
  padding-top: 24px;
}
.neil-now .nn-play {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff5e7;
  color: #304bd5;
}
.neil-now .nn-play svg {
  display: block;
  width: 18px;
  height: 18px;
}

/* 播放中的小节拍：隐藏时仍保留空间，避免卡片跳高。 */
.neil-now .nn-music-beat {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  margin-top: 22px;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.neil-now .nn-music-beat > span {
  display: block;
  width: 3px;
  height: 16px;
  border-radius: 3px;
  background: #fff3df;
  transform: scaleY(0.35);
}
.neil-now .nn-is-playing .nn-music-beat {
  opacity: 0.65;
}

/* 只有播放时运行动画。 */
.neil-now .nn-music.nn-is-playing {
  animation: nn-music-sway 3.2s ease-in-out infinite;
}
.neil-now .nn-is-playing .nn-ear {
  animation: nn-ear-bounce 1.6s ease-in-out infinite;
}
.neil-now .nn-is-playing .nn-ear-right {
  animation-delay: -0.8s;
}
.neil-now .nn-is-playing .nn-music-beat > span {
  animation: nn-beat 1s ease-in-out infinite;
}
.neil-now .nn-is-playing .nn-music-beat > span:nth-child(2) {
  animation-delay: -0.35s;
}
.neil-now .nn-is-playing .nn-music-beat > span:nth-child(3) {
  animation-delay: -0.65s;
}
.neil-now .nn-is-playing .nn-music-beat > span:nth-child(4) {
  animation-delay: -0.2s;
}
.neil-now .nn-is-playing .nn-music-beat > span:nth-child(5) {
  animation-delay: -0.5s;
}
@keyframes nn-music-sway {
  0%,
  100% {
    transform: rotate(2.5deg) translateY(0);
  }
  50% {
    transform: rotate(1deg) translateY(-2px);
  }
}
@keyframes nn-ear-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
@keyframes nn-beat {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

/* ===== 桃色便签 ===== */
.neil-now .nn-note {
  background: #ffd2be;
  transform: rotate(-2deg);
  margin-top: 3px;
  border-radius: 2px 2px 17px 2px;
}
.neil-now .nn-note::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 29%;
  width: 44%;
  height: 23px;
  background: #f3e9caba;
  transform: rotate(5deg);
  box-shadow: 0 0 1px #cbb48a;
  pointer-events: none;
}
.neil-now .nn-note-title {
  font-size: 23px;
  line-height: 1.5;
  letter-spacing: -0.8px;
  display: block;
  margin-top: 8px;
  font-weight: 500;
  white-space: pre-line;
}
.neil-now .nn-note-more {
  white-space: pre-line;
  font-size: 14px;
  margin-top: 12px;
  line-height: 1.6;
}
.neil-now .nn-note .nn-bottom {
  color: #903c2a;
}
.neil-now .nn-stamp {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
  color: var(--nn-muted);
  font-size: 12px;
  gap: 8px;
}
.neil-now .nn-stamp > span:last-child {
  transform: rotate(-3deg);
  border-bottom: 1px solid var(--nn-muted);
  padding-bottom: 3px;
}
.neil-now .nn-message {
  font-size: 14px;
  color: var(--nn-muted);
  margin: 8px 0;
}

/* 鼠标悬停：播放中的卡片继续轻摇。 */
@media (hover: hover) {
  .neil-now .nn-sticker:hover {
    box-shadow: 0 13px 20px #0000001c;
  }
  .neil-now .nn-sticker:not(.nn-is-playing):hover {
    transform: rotate(0) translateY(-5px);
  }
}

/* ===== 手机：两列，耳机不越出卡片间隙 ===== */
@media (max-width: 600px) {
  .neil-now {
    margin-top: 0.5rem;
  }
  .neil-now .nn-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 40px;
    column-gap: 12px;
    row-gap: 16px;
  }
  .neil-now .nn-tag {
    display: inline-block;
    grid-column: 1 / -1;
    justify-self: start;
  }
  .neil-now .nn-heading h2 {
    min-width: 0;
    font-size: 23px;
  }
  .neil-now .nn-stickers {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 22px;
    padding: 62px 8px 18px;
  }
  .neil-now .nn-sticker {
    padding: 16px 13px;
  }
  .neil-now .nn-music {
    min-height: 280px;
    padding-top: 30px;
  }
  .neil-now .nn-headphones {
    width: calc(100% + 6px);
  }
  .neil-now .nn-music .nn-eyebrow {
    margin: 0 5px 16px;
    font-size: 11px;
    letter-spacing: 0;
  }
  .neil-now .nn-music-title {
    font-size: 23px;
  }
  .neil-now .nn-music .nn-bottom {
    gap: 6px;
    font-size: 11px;
  }
  .neil-now .nn-play {
    flex-basis: 30px;
    width: 30px;
    height: 30px;
  }
  .neil-now .nn-note {
    grid-column: 1 / -1;
    min-height: 150px;
    margin: 7px 5px 0;
    transform: rotate(-1deg);
  }
}

/* 极窄屏沿用单列；音乐卡片上方单独给耳机留位置。 */
@media (max-width: 359px) {
  .neil-now .nn-stickers {
    grid-template-columns: minmax(0, 1fr);
    padding: 8px 10px 18px;
    row-gap: 28px;
  }
  .neil-now .nn-sticker {
    min-height: 210px;
  }
  .neil-now .nn-music {
    margin-top: 80px;
    min-height: 310px;
    padding-top: 36px;
  }
  .neil-now .nn-heading h2 {
    font-size: 21px;
  }
}

/* 尊重系统“减少动态效果”设置。 */
@media (prefers-reduced-motion: reduce) {
  .neil-now .nn-sticker,
  .neil-now .nn-front,
  .neil-now .nn-back,
  .neil-now .nn-music-beat {
    transition: none;
  }
  .neil-now .nn-music.nn-is-playing,
  .neil-now .nn-is-playing .nn-ear,
  .neil-now .nn-is-playing .nn-music-beat > span {
    animation: none;
  }
}

/* 耳罩最多向卡片内延伸约 57px，文字从下方开始。 */
.neil-now .nn-sticker.nn-music {
  padding-top: 66px;
}

/* 窄屏：RIGHT NOW、标题、问号保持同一行。 */
@media (max-width: 600px) {
  .neil-now .nn-heading {
    grid-template-columns: auto minmax(0, 1fr) 28px;
    column-gap: 8px;
    row-gap: 0;
    align-items: center;
  }

  .neil-now .nn-heading .nn-tag {
    grid-column: auto;
    justify-self: start;
    padding: 4px 6px;
    font-size: 9px;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .neil-now .nn-heading h2 {
    font-size: clamp(14px, 3.8vw, 20px);
    letter-spacing: -0.5px;
    white-space: nowrap;
    line-height: 1.4;
  }

  .neil-now .nn-heading .nn-secret {
    width: 28px;
    height: 28px;
    margin: 0;
    font-size: 14px;
  }
}

/* 收紧标题与贴纸之间的距离 */
.neil-now .nn-heading {
  margin-bottom: 1px;
}

.neil-now .nn-stickers {
  padding-top: 52px;
}

@media (max-width: 600px) {
  .neil-now .nn-stickers {
    padding-top: 44px;
  }
}

/* 极窄屏为单列，耳机已有自己的顶部留白 */
@media (max-width: 359px) {
  .neil-now .nn-stickers {
    padding-top: 8px;
  }
}

/* ===== 电影票：透明缺口＋底部撕边 ===== */
.neil-now .nn-sticker.nn-film {
  --nn-ticket-bottom: 18px;
  --nn-ticket-footer: 44px;

  /* 缺口与底部虚线对齐 */
  --nn-ticket-cut: calc(100% - var(--nn-ticket-bottom) - var(--nn-ticket-footer));

  isolation: isolate;
  background: transparent;
  min-height: 0;
  padding-bottom: var(--nn-ticket-bottom);
  box-shadow: none;
  filter: drop-shadow(0 6px 8px #00000018);
}

/* 单独绘制纸张轮廓，里面的文字和翻面不受裁切影响 */
.neil-now .nn-film::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: #f7df8e;
  border-radius: 4px 4px 0 0;

  /* 左右各挖一个真实透明的半圆缺口 */
  -webkit-mask-image: radial-gradient(circle 7px at 0 var(--nn-ticket-cut), transparent 6.5px, #000 7.2px),
    radial-gradient(circle 7px at 100% var(--nn-ticket-cut), transparent 6.5px, #000 7.2px);
  mask-image: radial-gradient(circle 7px at 0 var(--nn-ticket-cut), transparent 6.5px, #000 7.2px),
    radial-gradient(circle 7px at 100% var(--nn-ticket-cut), transparent 6.5px, #000 7.2px);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;

  /* 浅浅的不规则撕边 */
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 3px),
    97% calc(100% - 5px),
    94% calc(100% - 2px),
    91% calc(100% - 4px),
    88% calc(100% - 1px),
    85% calc(100% - 3px),
    82% calc(100% - 2px),
    79% calc(100% - 5px),
    76% calc(100% - 3px),
    73% 100%,
    70% calc(100% - 3px),
    67% calc(100% - 1px),
    64% calc(100% - 4px),
    61% calc(100% - 2px),
    58% calc(100% - 5px),
    55% calc(100% - 2px),
    52% calc(100% - 3px),
    49% 100%,
    46% calc(100% - 2px),
    43% calc(100% - 4px),
    40% calc(100% - 1px),
    37% calc(100% - 3px),
    34% calc(100% - 2px),
    31% calc(100% - 5px),
    28% calc(100% - 2px),
    25% calc(100% - 4px),
    22% calc(100% - 1px),
    19% calc(100% - 3px),
    16% 100%,
    13% calc(100% - 2px),
    10% calc(100% - 4px),
    7% calc(100% - 1px),
    4% calc(100% - 3px),
    0 calc(100% - 2px)
  );
}

/* ===== 电影内容：收紧行间距 ===== */
.neil-now .nn-film .nn-eyebrow {
  margin-bottom: 10px;
}

.neil-now .nn-film .nn-movie-cover {
  margin-bottom: 8px;
}

.neil-now .nn-film .nn-movie-title {
  font-size: 28px;
  line-height: 1.1;
  margin: 0 0 4px;
}

.neil-now .nn-film .nn-meta {
  font-size: 11px;
  line-height: 1.35;
}

/* 固定票根区域高度，让缺口始终对齐虚线 */
.neil-now .nn-film .nn-bottom {
  flex: 0 0 var(--nn-ticket-footer);
  height: var(--nn-ticket-footer);
  margin-top: 12px;
  padding: 10px 2px 8px;
  line-height: 16px;
  font-size: 11px;
}

/* ===== 蓝色卡片：随整行缩短，同时收紧内部留白 ===== */
.neil-now .nn-sticker.nn-music {
  min-height: 0;
  align-self: stretch;

  /* 保留耳罩下方的安全距离 */
  padding-top: 62px;
}

.neil-now .nn-music .nn-eyebrow {
  margin-bottom: 12px;
}

.neil-now .nn-music .nn-music-title {
  font-size: 23px;
  line-height: 1.12;
  margin: 4px 0 8px;
}

.neil-now .nn-music .nn-meta {
  font-size: 11px;
  line-height: 1.4;
}

.neil-now .nn-music .nn-music-beat {
  height: 16px;
  margin-top: 12px;
}

.neil-now .nn-music .nn-bottom {
  padding-top: 12px;
}

/* 手机尺寸 */
@media (max-width: 600px) {
  .neil-now .nn-sticker.nn-film {
    --nn-ticket-bottom: 16px;
  }

  .neil-now .nn-film .nn-movie-title {
    font-size: 26px;
  }

  .neil-now .nn-music .nn-music-title {
    font-size: 21px;
  }
}

/* 票根由 44px 缩到 30px，底边留白同步缩小 */
.neil-now .nn-sticker.nn-film {
  --nn-ticket-footer: 30px;
  --nn-ticket-bottom: 10px;
}

/* 导演信息到虚线：12px → 6px */
.neil-now .nn-film .nn-bottom {
  margin-top: 6px;
  padding: 6px 2px 3px;
  line-height: 16px;
}

/* 片名与英文信息再靠近一点 */
.neil-now .nn-film .nn-movie-title {
  margin-bottom: 2px;
}

.neil-now .nn-film .nn-meta {
  line-height: 1.2;
}

/* 覆盖之前手机端的底部留白 */
@media (max-width: 600px) {
  .neil-now .nn-sticker.nn-film {
    --nn-ticket-bottom: 10px;
  }
}

/* 宽屏三列：第三张便签在同排内垂直居中 */
@media (min-width: 601px) {
  .neil-now .nn-sticker.nn-note {
    align-self: center;
    min-height: 220px;
    margin-top: 0;
  }
}

/* 仅手机双列布局 */
@media (min-width: 360px) and (max-width: 600px) {
  .neil-now .nn-sticker.nn-film,
  .neil-now .nn-sticker.nn-music {
    align-self: stretch;
    min-height: 0;
    margin-top: 0;
  }

  /* 为较小的手机耳机保留足够空间 */
  .neil-now .nn-sticker.nn-music {
    padding-top: 56px;
    padding-bottom: 12px;
  }

  .neil-now .nn-music .nn-eyebrow {
    margin-bottom: 8px;
  }

  .neil-now .nn-music .nn-music-title {
    font-size: 20px;
    line-height: 1.1;
    margin: 0 0 6px;
  }

  .neil-now .nn-music .nn-meta {
    line-height: 1.3;
  }

  .neil-now .nn-music .nn-music-beat {
    height: 12px;
    margin-top: 8px;
  }

  .neil-now .nn-music .nn-bottom {
    padding-top: 8px;
  }

  /* 票根贴住底部，保持虚线与半圆缺口对齐 */
  .neil-now .nn-film .nn-bottom {
    margin-top: auto;
  }

  .neil-now .nn-film .nn-flip {
    margin-bottom: 6px;
  }
}

/* 仅宽屏三列布局 */
@media (min-width: 601px) {
  .neil-now .nn-sticker.nn-music {
    /* 底部留出 16px，让本体不再填满整行 */
    margin-bottom: 16px;
    padding-top: 58px;
    padding-bottom: 12px;
  }

  .neil-now .nn-sticker.nn-note {
    /* 从之前的 220px 调回 240px */
    min-height: 240px;
    align-self: center;
    margin-top: 0;
  }
}

/* 音柱沿用原来的占位高度，不撑高卡片 */
.neil-now .nn-music .nn-music-beat {
  justify-content: center;
  gap: 5px;
  overflow: visible;
  opacity: 1;
}

/* 暂停：收成一排短条 */
.neil-now .nn-music .nn-music-beat > span {
  flex: 0 0 6px;
  width: 6px;
  height: 28px;
  border-radius: 999px;
  background: #fff3df;
  transform-origin: center;
  transform: scaleY(0.14);
  opacity: 0.45;
  animation: none;
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

/*
 * 动画始终保留，暂停时冻结内部节奏；
 * 外层通过 scale 平滑收拢，避免突然跳成短条。
 */
.neil-now .nn-music .nn-music-beat > span::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #fff3df;
  animation: nn-equalizer-dance var(--nn-speed, 1s) ease-in-out var(--nn-delay, 0s) infinite;
  animation-play-state: paused;
}

/* 底色交给内部音柱绘制 */
.neil-now .nn-music .nn-music-beat > span {
  background: transparent;
}

.neil-now .nn-music.nn-is-playing .nn-music-beat > span {
  animation: none;
  transform: scaleY(1);
  opacity: 0.9;
}

.neil-now .nn-music.nn-is-playing .nn-music-beat > span::before {
  animation-play-state: running;
}

/* 各柱节奏错开，不会整排同步上下跳 */
.neil-now .nn-music-beat > span:nth-child(1) {
  --nn-speed: 1.1s;
  --nn-delay: -0.3s;
  --nn-peak: 0.6;
}
.neil-now .nn-music-beat > span:nth-child(2) {
  --nn-speed: 0.85s;
  --nn-delay: -0.6s;
  --nn-peak: 0.85;
}
.neil-now .nn-music-beat > span:nth-child(3) {
  --nn-speed: 1.2s;
  --nn-delay: -0.8s;
  --nn-peak: 1;
}
.neil-now .nn-music-beat > span:nth-child(4) {
  --nn-speed: 0.95s;
  --nn-delay: -0.2s;
  --nn-peak: 0.75;
}
.neil-now .nn-music-beat > span:nth-child(5) {
  --nn-speed: 1.05s;
  --nn-delay: -0.7s;
  --nn-peak: 0.95;
}
.neil-now .nn-music-beat > span:nth-child(6) {
  --nn-speed: 0.9s;
  --nn-delay: -0.4s;
  --nn-peak: 0.7;
}
.neil-now .nn-music-beat > span:nth-child(7) {
  --nn-speed: 1.15s;
  --nn-delay: -0.9s;
  --nn-peak: 0.5;
}

@keyframes nn-equalizer-dance {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(var(--nn-peak, 1));
  }
}

/* 暂停时统一成短条，内部变化平滑复位 */
.neil-now .nn-music:not(.nn-is-playing) .nn-music-beat > span {
  opacity: 0.55;
}

/* 手机稍微细一点 */
@media (max-width: 600px) {
  .neil-now .nn-music .nn-music-beat {
    gap: 4px;
  }

  .neil-now .nn-music .nn-music-beat > span {
    flex-basis: 5px;
    width: 5px;
    height: 24px;
  }
}

/* 系统开启减少动态效果时，展示静态音柱 */
@media (prefers-reduced-motion: reduce) {
  .neil-now .nn-music .nn-music-beat > span {
    transition: none;
  }

  .neil-now .nn-music .nn-music-beat > span::before {
    animation: none;
    transform: scaleY(var(--nn-peak, 0.6));
  }
}
</style>
