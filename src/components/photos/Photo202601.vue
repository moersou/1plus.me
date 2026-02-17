<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2026-01-31-17-10-18-000-S',
  'p-2026-01-31-11-40-56-000-S',
  'p-2026-01-31-11-34-48-000-S',
  'p-2026-01-31-11-40-21-000-S',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
