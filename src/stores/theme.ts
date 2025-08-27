import { defineStore } from 'pinia';

type Brightness = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: 'default' as string,
    brightness: 'dark' as Brightness,
    // key = theme/merchant code, value = 'light' | 'dark'
    availableThemes: {
      peach: 'light',
      ozow: 'light',
      default: 'dark',
    } as Record<string, Brightness>,
  }),

  actions: {
    merchantCodeToTheme(merchantCode: string | null): string {
      if (!merchantCode) return 'default';
      return merchantCode in this.availableThemes ? merchantCode : 'default';
    },

    setTheme(theme: string) {
      const resolved = this.merchantCodeToTheme(theme);
      this.current = resolved;
      this.brightness = this.availableThemes[resolved];
    },

    async loadCssForCurrent() {
      try {
        await import(
          /* webpackChunkName: "theme-[request]" */ `@/assets/partners/${this.current}.css`
        );
      } catch (e) {
        if (this.current !== 'default') {
          await import('@/assets/partners/default.css');
        }
      }
    },

    /**
     * Initialize from URL (?theme=xyz). Caches in the store.
     * Call this once on app/component mount.
     */
    async initFromUrl() {
      const search = new URLSearchParams(window.location.search);
      const themeParam = search.get('theme'); // may be null
      this.setTheme(themeParam || 'default');
      await this.loadCssForCurrent();
    },
  },
});