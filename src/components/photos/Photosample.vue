<script setup lang="ts">
import type { Photo } from '../../../album/data'
import raw from '../../../album/data'

const photos: Photo[] = [
  'p-2025-03-05-1',
  'p-2025-02-09-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
