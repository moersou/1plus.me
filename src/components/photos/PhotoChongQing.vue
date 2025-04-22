<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2025-04-03-15-01-49-090-D',
  'p-2025-04-03-15-24-18-096-D',
  'p-2025-03-30-04-25-47-000-1',
  'p-2025-04-06-07-19-55-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
