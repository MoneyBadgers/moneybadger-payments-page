import type { App } from 'vue';
import mixpanel from 'mixpanel-browser';
import { defaultAnalyticproperties } from '../types/analytics_default_properties';
import type { Plugin } from 'vue';

// Define the Mixpanel configuration options
interface MixpanelConfig {
  track_pageview?: boolean;
  [key: string]: any;
}

// Define the Mixpanel methods interface
interface MixpanelMethods {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  identifyUser: (userId: string) => void;
  setUserProperties: (properties: Record<string, any>) => void;
  reset: () => void;
  isInitialized: () => boolean;
  startSessionRecording: () => void;
}

// Define the plugin options interface
interface MixpanelPluginOptions {
  token: string;
  config?: MixpanelConfig;
}

export const MixpanelPlugin: Plugin = {
  install(app: App, options: MixpanelPluginOptions = { token: '' }) {
    const { token, config = {} } = options;

    if (!token) {
      console.error('Mixpanel token is required');
      return;
    }

    // Initialize Mixpanel
    mixpanel.init(token, {
      debug: false,
      record_sessions_percent: 100,
      record_mask_text_selector: '', //unmask all text elements
      record_block_selector: '', //unmask images and videos
      record_heatmap_data: true,
      ...config,
    });

    // Mixpanel methods
    const mixpanelMethods: MixpanelMethods = {
      trackEvent(eventName: string, properties: Record<string, any> = {}) {

        if (!mixpanel.get_config) {
          console.warn('Mixpanel not initialized.');
          return;
        }

        mixpanel.track(eventName, {...defaultAnalyticproperties, ...properties});
      },

      identifyUser(userId: string) {
        if (!mixpanel.get_config) {
          console.warn('Mixpanel not initialized.');
          return;
        }
        mixpanel.identify(userId);
      },

      setUserProperties(properties: Record<string, any>) {
        if (!mixpanel.get_config) {
          console.warn('Mixpanel not initialized.');
          return;
        }
        mixpanel.people.set(properties);
      },

      reset() {
        if (!mixpanel.get_config) {
          console.warn('Mixpanel not initialized.');
          return;
        }
        mixpanel.reset();
      },

      isInitialized() {
        return !!mixpanel.get_config;
      },

      startSessionRecording() {
        if (!mixpanel.get_config) {
          console.warn('Mixpanel not initialized.');
          return;
        }
        mixpanel.start_session_recording();
      },
    };

    // Provide Mixpanel methods to all components
    app.config.globalProperties.$mixpanel = mixpanelMethods;

    // Optional: Provide for use in setup() if mixing Options and Composition APIs
    app.provide('mixpanel', mixpanelMethods);
  },
};