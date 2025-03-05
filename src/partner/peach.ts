const checkoutOrigin = location.hash
    ? atob(location.hash.substring(1))
    : "https://secure.peachpayments.com";

function post(events: any) {
    window.parent.postMessage(
        {
            message: "push-checkout-events",
            events: events
        },
        checkoutOrigin,
        []
    );
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function peachComplete(url: string) {
    post([{ type: "partner-redirect", url: url, method: "POST", body: {} }]);
}

function peachInit() {
    // Condition to handle rendering of payment page in Peach Payments Checkout/E-Commerce Plugins
    if (inIframe()) {
        post([{ type: "status", value: undefined }]);
    }
}

export { peachComplete, peachInit }