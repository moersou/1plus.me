<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2026-01-24-11-21-30-001-D',
  'p-2025-02-13-03-37-56-000-1',
  'p-2025-12-23-00-00-00-003-S',
  'p-2025-12-23-00-00-00-001-S',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
