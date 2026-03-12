<script setup lang="ts">
import type { Photo } from '../../../photos/data'

defineProps<{
  photos: Photo[]
}>()
</script>

<!--
/* 原始grid方案 */
<template>
  <div class="photos grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4" max-w-500 mx-auto>
    <div v-for="photo, idx in photos" :key="idx" class="flex items-center justify-center">
      <img
        :src="photo.url"
        :alt="photo.text || photo.name"
        :data-photo-index="idx"
        loading="lazy"
        class="w-full h-auto object-cover rounded-xl shadow-md"
      >
    </div>
  </div>
</template>
-->

<!--
/* Flex 布局，但要用 CSS 媒体查询，保证从左到后从上到下的方案 */
<template>
  <div class="max-w-500 mx-auto">
    <div class="flex gap-4 md:hidden">
      <div v-for="col in [0, 1]" :key="'2col-' + col" class="flex-1 flex flex-col gap-4">
        <div v-for="photo in photos.filter((_, i) => i % 2 === col)" :key="photo.url">
          <img :src="photo.url" :alt="photo.name" loading="lazy" class="w-full h-auto rounded-2xl shadow-lg">
        </div>
      </div>
    </div>

    <div class="hidden md:flex lg:hidden gap-4">
      <div v-for="col in [0, 1, 2]" :key="'3col-' + col" class="flex-1 flex flex-col gap-4">
        <div v-for="photo in photos.filter((_, i) => i % 3 === col)" :key="photo.url">
          <img :src="photo.url" :alt="photo.name" loading="lazy" class="w-full h-auto rounded-2xl shadow-lg">
        </div>
      </div>
    </div>

    <div class="hidden lg:flex gap-4">
      <div v-for="col in [0, 1, 2, 3]" :key="'4col-' + col" class="flex-1 flex flex-col gap-4">
        <div v-for="photo in photos.filter((_, i) => i % 4 === col)" :key="photo.url">
          <img :src="photo.url" :alt="photo.name" loading="lazy" class="w-full h-auto rounded-2xl shadow-lg">
        </div>
      </div>
    </div>
  </div>
</template>
-->

<template>
  <div class="max-w-500 mx-auto">
    <div v-if="photos.length > 0" class="mb-5">
      <img
        :src="photos[6].url"
        class="w-full h-[45vh] md:h-[65vh] object-cover rounded-2xl shadow-lg"
        alt="Hero Image"
      >
      <div class="op60 mt-3 text-left px-1">
        <h1 class="text-xl font-bold">
          {{ photos[6].text || photos[6].name }}
        </h1>
        <p class="op50 mt-0 text-sm" />
      </div>
    </div>

    <div class="masonry-container">
      <div
        v-for="(photo, idx) in photos.filter((_, i) => i !== 6)"
        :key="idx"
        class="masonry-item group"
      >
        <img
          :src="photo.url"
          :alt="photo.text || photo.name"
          loading="lazy"
          class="w-full h-auto object-cover rounded-2xl shadow-lg transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
        >
        <p class="mt-2 ml-1 text-xs op50 font-medium">
          {{ photo.text || photo.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.masonry-container {
  column-count: 2;
  column-gap: 1rem;
}

@media (min-width: 768px) {
  .masonry-container {
    column-count: 3;
  }
}

@media (min-width: 1280px) {
  .masonry-container {
    column-count: 4;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.3rem; /* 稍微拉大间距，给标题留空间 */
}
</style>
