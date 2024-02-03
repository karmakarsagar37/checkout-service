import { Checkout, PricingRules, ProductCatalogue, DiscountDeal, FreeDeal, PricingDealName } from '../src/checkout';

/**
 * Product Catalogue
 *     ipd: { name: "Super iPad", price: 549.99 },
 *     mbp: { name: "MacBook Pro", price: 1399.99 },
 *     atv: { name: "Apple TV", price: 109.5 },
 *     vga: { name: "VGA adapter", price: 30.0 },
 */
const freeDeal: FreeDeal = {
    type: PricingDealName.FreeDeal,
    countToPay: 2,
    minimumCountForFreeDeal: 3
}
const discountDeal: DiscountDeal = {
    type: PricingDealName.DiscountDeal,
    discountPrice: 499.99,
    minimumCountForDiscount: 4
}

const pricingRules: PricingRules = {
    atv: freeDeal,
    ipd: discountDeal,
};

describe('Checkout', () => {
    test('should calculate total without any pricing rules', () => {
        const pricingRules: PricingRules = {};
        const co = new Checkout(pricingRules);

        co.scan('atv');
        co.scan('ipd');
        co.scan('mbp');

        expect(co.total()).toBe(2059.48);
    });

    test('should apply bulk discount for Super iPad', () => {
        const pricingRules: PricingRules = {
            ipd: { type: PricingDealName.DiscountDeal, minimumCountForDiscount: 4, discountPrice: 499.99 },
        };
        const co = new Checkout(pricingRules);

        co.scan('ipd');
        co.scan('ipd');
        co.scan('ipd');
        co.scan('ipd');
        co.scan('ipd');

        expect(co.total()).toBe(2499.95);
    });

    test('should apply 3 for 2 deal for Apple TV', () => {
        const pricingRules: PricingRules = {
            atv: { type: PricingDealName.FreeDeal, minimumCountForFreeDeal: 3, countToPay: 2 },
        };
        const co = new Checkout(pricingRules);

        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("vga");

        const total1 = co.total();
        expect(co.total()).toBe(249.00);
    });

    test('should apply 3 for 2 deal for 6 Apple TV', () => {
        const pricingRules: PricingRules = {
            atv: { type: PricingDealName.FreeDeal, minimumCountForFreeDeal: 3, countToPay: 2 },
        };
        const co = new Checkout(pricingRules);

        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("vga");

        const total1 = co.total();
        console.log(total1);
        // 109.5 *4 + 109.5*1 + 30
        expect(co.total()).toBe(577.5);
    });

    test('should apply both bulk discount and 3 for 2 deal', () => {

        const pricingRules: PricingRules = {
            atv: freeDeal,
            ipd: discountDeal,
        };

        const co = new Checkout(pricingRules);

        // 3 for 2
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");

        co.scan("vga");

        co.scan("ipd");
        co.scan("ipd");
        co.scan("ipd");
        co.scan("ipd");
        co.scan("ipd");


        expect(co.total()).toBe(2748.95);
    });
});
