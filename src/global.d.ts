import { MixpanelMethods } from './mixpanelPlugin';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $mixpanel: MixpanelMethods;
  }
}