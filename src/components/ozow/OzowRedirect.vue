<template>
    <!-- Intentionally empty — this component only redirects -->
    <div></div>
</template>

<script>
import { usePaymentStore } from '../../stores/payments'
import { useThemeStore } from '../../stores/theme';

function redirectUrl() {
    debugger
    if (!usePaymentStore().invoice?.order_id) {
        return "";
    }
    let transactionId = usePaymentStore().invoice.order_id;
    if (window.location.hostname.includes('pay.staging.') || window.location.hostname.includes('localhost')) {
        return `https://stagingpay.ozow.com/api/callback/transactions/${transactionId}/finalize`;
    }
    return `https://pay.ozow.com/api/callback/transactions/${transactionId}/finalize`;
}
export default {
    name: 'OzowRedirect',
    created() {
        debugger
        if (useThemeStore().current != 'ozow') {
            console.warn("OzowRedirect component used when theme is not Ozow");
            console.log("Current theme:", useThemeStore.current);
            return;
        }
        // Guard for environments without `window` (SSR)
        if (typeof window !== 'undefined') {
            // Immediate redirect
            window.location.href = redirectUrl();
        }
    }
}
</script>