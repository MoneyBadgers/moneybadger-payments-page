<template>
    <!-- Intentionally empty — this component only redirects -->
    <div></div>
</template>

<script>
import { usePaymentStore } from '../../stores/payments'
import { useThemeStore } from '../../stores/theme';

export default {
    name: 'OzowRedirect',
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
            window.location.href = redirectUrl;
        }
        console.warn("OzowRedirect: No redirect URL found in payment store.");
    }
}
</script>