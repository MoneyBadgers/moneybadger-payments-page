<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

const loadCss = async (theme: string) => {
  await import(`@/assets/partners/${theme}.css`);
};

onMounted(() => {
  const theme = window.localStorage.getItem('theme') ?? 'default' // todo: by get param / cookie / whatever floats your boat
  loadCss(theme); // Loads dark.css dynamically
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
