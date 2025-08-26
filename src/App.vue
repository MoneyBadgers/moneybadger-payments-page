<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

// List of available themes (css files in assets/partners)
// the key is the merchantCode, the value is whether the theme is light or dark
const availableThemes: Record<string, string> = {
  'peach' : 'light',
  'ozow' : 'light',
  'default' : 'dark',
};

function merchantCodeToTheme(merchantCode: string | null): string {
  if (!merchantCode) return 'default';
  // theme names should match the merchant code exactly
  return (merchantCode in availableThemes) ? merchantCode : 'default';
}

const loadCss = async (merchantCode: string) => {

  const theme = merchantCodeToTheme(merchantCode);
  const brightness = availableThemes[theme];

  // find the div id="app" and add a class with the theme name
  const appDiv = document.getElementById('app');
  if (appDiv) {
    appDiv.classList.add(theme); 
    appDiv.classList.add(brightness); 
  }

  await import(`@/assets/partners/${theme}.css`);
};

onMounted(() => {
  const search = new URLSearchParams(window.location.search)
  // if theme is provided in the get param, it takes precedence over merchantCode
  const theme = search.get('theme') || '';
  loadCss(theme); // Loads dark.css dynamically
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
