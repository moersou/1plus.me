<script setup lang="ts">
import type { Photo } from '../../../album/data'
import raw from '../../../album/data'

const photos: Photo[] = [
  '',
  '',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
