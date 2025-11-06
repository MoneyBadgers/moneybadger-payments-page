<!-- TermsNotice.vue -->
<template>
  <div>
    <p class="terms">
      By continuing you agree to Ozow’s
      <a
        href="#"
        class="link"
        @click.prevent="openModal"
      >
        T&Cs
      </a>
    </p>

    <!-- Modal -->
    <div
      v-if="showing"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tc-title"
      @click.self="closeModal"
    >
      <div class="sheet">
        <button
          class="close"
          @click="closeModal"
          aria-label="Close dialog"
          ref="closeBtn"
        >
          ✕
        </button>

        <h2 id="tc-title" class="sheet__title mt-5">Terms &amp; Conditions</h2>

        <p class="sheet__body my-4">
          By proceeding with this payment, you confirm that you have read
          and agree with our Privacy Policy and Terms and conditions
        </p>

        {{ showing }}

        <nav>
        <ul class="sheet__links">
          <li><a href="https://ozow.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></li>
          <li><a href="https://ozow.com/terms-and-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a></li>
        </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showing = ref(false)

function openModal() {
  showing.value = true
}

function closeModal() {
  console.log('closing modal')
  showing.value = false
}
</script>

<style scoped>
.terms {
  color: #9AA3B5;          /* faded slate */
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.5px;
  margin: 0;
}

.link {
  color: #43C6AD;          /* teal */
  text-decoration: none;
  font-weight: 800;
  position: relative;
  padding-bottom: 4px;
}
.link::after {
  content: "";
  position: absolute;
  left: 0; bottom: 0;
  width: 100%; height: 3px;
  background: currentColor;
}
.link:hover::after { height: 4px; }

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  /* place near the lower half like your screenshot */
  align-content: center;
  justify-items: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.55);   /* dim */
  backdrop-filter: blur(2px);
}

/* The sheet */
.sheet {
  width: min(720px, 100%);
  background: #fff;
  color: #1f2937;
  border-radius: 20px;
  position: relative;
  padding: 32px 32px 24px;
  text-align: left;
}

.close {
  position: absolute;
  top: 20px;
  right: 22px;
  width: 36px; height: 36px;
  border: 0; border-radius: 999px;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.sheet__title {
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.5px;
}

.sheet__body {
    font-weight: 400;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
}

.sheet__links {
  display: grid;
  gap: 14px;
  a {
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    text-decoration: underline;
    text-decoration-style: solid;
    text-decoration-thickness: 0%;
    color: #00B8AD;
  }
}

</style>