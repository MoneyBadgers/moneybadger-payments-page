<script lang="ts">
export default {
  name: 'ErrorPage',
  props: {
    errors: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
  <div class="error-page">
    <h1 class="error-symbol">X</h1>
    <div class="error-message">
      <ul>
        <li v-for="(error, index) in errors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-symbol {
  color: var(--color-red);
  font-size: 5em;
  line-height: 1.0;
  font-weight: bold;
}

.error-message {
  color: var(--color-red);
  font-size: 1.2em;
  font-weight: bold;
}
</style>