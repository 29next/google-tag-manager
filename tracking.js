if (app.settings.google_tag_manager_enabled) {
    let prepareLineItems = (event) => {
        let result = []
        event.data?.lines?.forEach((line, _) => {
            result.push({
                item_id: line.product_id,
                item_name: line.product_title,
                item_variant: line.variant_title,
                discount: line.total_discount,
                price: line.price_incl_tax,
                quantity: line.quantity
            })
        });
        return result;
    }
    analytics.subscribe('page_viewed', (event) => {
        window.top.dataLayer.push({
            event: "page_view",
            page_referrer: window.top.document.referrer,
            page_title: window.top.document.title,
            page_path: window.top.top.location.pathname,
            page_location: window.top.location.href,
        });
    });

    analytics.subscribe('product_viewed', (event) => {
        window.top.dataLayer.push({ ecommerce: null });
        window.top.dataLayer.push({
            event: "view_item",
            page_referrer: window.top.document.referrer,
            page_title: window.top.document.title,
            page_path: window.top.top.location.pathname,
            page_location: window.top.location.href,
            ecommerce: {
                currency: event.data?.purchase_info?.price?.currency,
                value: event.data?.purchase_info?.price?.price,
                items: [
                    {
                        index: 0,
                        item_id: event.data?.id,
                        item_name: event.data?.title,
                        item_category: event.data?.categories?.length ? event.data.categories[0].name : "",
                        price: event.data?.purchase_info?.price?.price,
                        quantity: 1,
                    }
                ]
            }

        })
    });

    analytics.subscribe('product_added_to_cart', (event) => {
        window.top.dataLayer.push({ ecommerce: null });
        window.top.dataLayer.push({
            event: "add_to_cart",
            page_referrer: window.top.document.referrer,
            page_title: window.top.document.title,
            page_path: window.top.top.location.pathname,
            page_location: window.top.location.href,
            ecommerce: {
                currency: event.data?.currency,
                value: event.data?.price_incl_tax,
                items: [
                    {
                        item_id: event.data?.id,
                        item_name: event.data?.title,
                        sku: event.data?.sku,
                        item_category: event.data?.categories?.length ? event.data.categories[0].name : "",
                        price: (event.data?.price_incl_tax / event.data?.quantity).toFixed(2),
                        quantity: event.data?.quantity
                    }
                ]
            }
        });
    });

    analytics.subscribe('checkout_started', (event) => {
        window.top.dataLayer.push({ ecommerce: null });
        window.top.dataLayer.push({
            event: "begin_checkout",
            page_referrer: window.top.document.referrer,
            page_title: window.top.document.title,
            page_path: window.top.top.location.pathname,
            page_location: window.top.location.href,
            ecommerce: {
                currency: event.data?.currency,
                value: event.data?.total_incl_tax,
                coupon: event.data?.voucher_discounts?.length ? event.data?.voucher_discounts[0].name : "",
                items: prepareLineItems(event)
            }
        });
    });

    analytics.subscribe('checkout_completed', (event) => {
        window.top.dataLayer.push({ ecommerce: null });
        window.top.dataLayer.push({
            event: "purchase",
            page_referrer: window.top.document.referrer,
            page_title: window.top.document.title,
            page_path: window.top.top.location.pathname,
            page_location: window.top.location.href,
            ecommerce: {
                currency: event.data?.currency,
                value: event.data?.total_incl_tax,
                transaction_id: event.data?.number,
                coupon: event.data?.voucher_discounts?.length ? event.data?.voucher_discounts[0].name : "",
                shipping: event.data?.shipping_incl_tax,
                tax: event.data?.total_tax,
                items: prepareLineItems(event)
            }
        })
    });

}
