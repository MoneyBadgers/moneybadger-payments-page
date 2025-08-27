<template>
  <div :class="[themeStore.current, themeStore.brightness]">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';

const themeStore = useThemeStore();

onMounted(async () => {
  await themeStore.initFromUrl();
});
</script>

<style scoped></style>