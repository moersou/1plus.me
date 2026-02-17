<script setup lang="ts">
import type { Photo } from '../../../photos/data'

defineProps<{
  photos: Photo[]
}>()
</script>

<template>
  <div class="photos grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4" max-w-500 mx-auto>
    <div v-for="photo, idx in photos" :key="idx" class="flex items-center justify-center">
      <img
        :src="photo.url"
        :alt="photo.text || photo.name"
        :data-photo-index="idx"
        loading="lazy"
        class="w-full aspect-square h-auto object-cover rounded-xl shadow-md"
      >
    </div>
  </div>
</template>
