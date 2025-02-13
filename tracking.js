if (app.settings.google_tag_manager_enabled) {

    window.dataLayer = window.dataLayer || [];
    function gtag(conifg) { dataLayer.push(arguments); }
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', app.settings.google_tag_manager_container_id)


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
        window.dataLayer.push({
            event: "page_view",
            page_path: window.parent.location.pathname,
            page_location: window.parent.location.href,
            page_title: window.parent.document.title
        });
    });

    analytics.subscribe('product_viewed', (event) => {
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'view_item',
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
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'add_to_cart',
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
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
                currency: event.data?.currency,
                value: event.data?.total_incl_tax,
                coupon: event.data?.voucher_discounts?.length ? event.data?.voucher_discounts[0].name : "",
                items: prepareLineItems(event)
            }
        });
    });

    analytics.subscribe('checkout_completed', (event) => {
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'purchase',
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
