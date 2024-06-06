<script lang="ts">
import ErrorSymbol from './ErrorSymbol.vue';

export default {
    name: 'ErrorPage',
    props: {
        errors: {
            type: Array,
            required: true
        }
    },
    components: { ErrorSymbol }
}
</script>

<template>
  <div class="error-page font-bold">
    <h4>Oops! Something went wrong.</h4>
    <div class="error-symbol">
      <ErrorSymbol class="my-4" />
    </div>
    <div class="error-message">
      <ul>
        <li v-for="(error, index) in errors" :key="index" class="font-bold">
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
  width: 50%;
  height: auto;
}

.error-message {
  color: var(--color-red);
  font-size: 1.2em;
}
</style>