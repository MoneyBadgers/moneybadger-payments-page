<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

const loadCss = async (theme: string) => {
  await import(`@/assets/partners/${theme}/${theme}.css`);
};

onMounted(() => {
  // loadCss('default'); // Loads dark.css dynamically
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
