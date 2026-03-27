<template>
    <!-- Intentionally empty — this component only redirects -->
    <div></div>
</template>

<script>
import { usePaymentStore } from '../../stores/payments'
import { useThemeStore } from '../../stores/theme';
import { AnalyticsEvent } from '../../types/analytics_events'

export default {
    name: 'OzowRedirect',
    props: {
        preRedirectEvent: {
            type: String,
            default: null
        }
    },
    created() {
        if (useThemeStore().current != 'ozow') {
            console.warn("OzowRedirect component used when theme is not Ozow");
            console.log("Current theme:", useThemeStore.current);
            return;
        }
        // Guard for environments without `window` (SSR)
        if (typeof window === 'undefined') {
            return
        }
        let redirectUrl = usePaymentStore().invoice?.redirect_url;
        if (redirectUrl) {
            if (this.preRedirectEvent) {
                this.$mixpanel.trackEvent(this.preRedirectEvent);
            }
            this.$mixpanel.trackEvent(AnalyticsEvent.Redirect);
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 600);
            return;
        }
        console.warn("OzowRedirect: No redirect URL found in payment store.");
    }
}
</script>
