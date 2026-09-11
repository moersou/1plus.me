<script setup lang="ts">
import { ref } from 'vue'

const yearText = ref('别点我 🫨')

const easterEggs = [
  '烦死了😠',
  '你再点？？',
  '真服了😮‍💨',
  '警告你.exe',
  '有病吧！！',
  '我怒了💩',
  '击毙你☠️',
]

function randomizeYearText() {
  const random = easterEggs[Math.floor(Math.random() * easterEggs.length)]
  yearText.value = random
}

function resetYearText() {
  yearText.value = '别点我 🫨'
}

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
</script>

<template>
  <header class="header z-40">
    <RouterLink
      class="w-12 h-12 absolute xl:fixed m-5 select-none outline-none"
      to="/"
      focusable="false"
    >
      <Logo />
    </RouterLink>
    <button
      title="Scroll to top"
      fixed right-3 bottom-3 w-10 h-10 hover:op100 rounded-full
      hover-bg-hex-8883 transition duration-300 z-100 print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <span style="font-size: 2rem;" />
        <span
          class="year-easter-egg"
          @mouseenter="randomizeYearText"
          @mouseleave="resetYearText"
          @click="randomizeYearText"
        >
          {{ yearText }}
        </span>

        <RouterLink to="/posts" title="Blog">
          <span class="lt-md:hidden">Blog</span>
          <div i-ri-article-line md:hidden style="font-size:1.11rem; margin: 0 -0.125rem;" />
          <!-- remixicon.com -->
        </RouterLink>
        <RouterLink to="/media" title="Media">
          <span class="lt-md:hidden">Media</span>
          <div i-ri-movie-ai-line md:hidden style="font-size:1.11rem; margin: 0 -0.125rem;" />
        </RouterLink>
        <RouterLink to="/photos" title="Photos">
          <span class="lt-md:hidden">PhotoGrid</span>
          <div i-ri-camera-3-line md:hidden style="font-size:1.17rem; margin: 0 -0.125rem;" />
        </RouterLink>
        <!--
        <RouterLink to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </RouterLink>
        -->
        <!--
        <RouterLink to="/talks" class="lt-md:hidden" title="Talks">
          Talks
        </RouterLink>
        -->
        <!--
        <RouterLink to="/sponsors-list" title="Sponsors">
          <span class="lt-md:hidden">Sponsors</span>
          <div i-ri-heart-line class="md:hidden" />
        </RouterLink>
        -->
        <!--
        <RouterLink to="/podcasts" class="lt-md:hidden" title="Podcasts">
          <div i-ri-mic-line />
        </RouterLink>
        -->
        <!--
        <RouterLink to="/demos" class="lt-md:hidden" title="Demos">
          <div i-ri-screenshot-line />
        </RouterLink>
        -->
        <!--
        <RouterLink to="/chat" title="Let's Chat">
          <div i-ri-chat-1-line />
        </RouterLink>
        -->
        <!--
        <a href="https://bsky.app/profile/antfu.me" target="_blank" title="Bluesky" class="lt-md:hidden">
          <div i-ri-bluesky-line />
        </a>
        -->
        <!--
        <a href="https://github.com/antfu" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        -->
        <a href="/feed.xml" target="_blank" title="RSS">
          <div i-la-rss-square style="font-size:1.3rem; margin: 0 -0.125rem;" />
        </a>
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}

/* 年份彩蛋向右靠近 Blog */
.nav .right > .year-easter-egg {
  margin-right: -1.7rem;
}

/* Navbar 年份随机彩蛋 */
.year-easter-egg {
  display: inline-block;
  min-width: 5.8rem;
  font-size: 1rem;
  vertical-align: middle;
  cursor: default;
}

.year-easter-egg:hover {
  animation: peek 0.4s ease;
}

@keyframes peek {
  0% {
    transform: translateY(4px) translateX(0) rotate(0deg);
  }

  25% {
    transform: translateY(0) translateX(-2px) rotate(-7deg);
  }

  50% {
    transform: translateY(0) translateX(2px) rotate(7deg);
  }

  75% {
    transform: translateY(0) translateX(-1px) rotate(-4deg);
  }

  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
}
</style>
