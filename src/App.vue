<script setup lang="ts">
import { RouterView } from 'vue-router'
import Hotjar from '@hotjar/browser';
const siteId = 6489570;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
