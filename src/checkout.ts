/**
 * Represents a checkout system with flexible pricing rules.
 */
export class Checkout {
    private readonly pricingRules: PricingRules;
    private scannedItems: string[];

    /**
     * Initializes a new instance of the Checkout class.
     * @param pricingRules - The pricing rules to apply during checkout.
     */
    constructor(pricingRules: PricingRules) {
        this.pricingRules = pricingRules;
        this.scannedItems = [];
    }

    /**
     * Scans an item and adds it to the list of scanned items.
     * @param item - The SKU of the item to be scanned.
     */
    scan(item: string): void {
        this.scannedItems.push(item);
    }

    /**
     * Calculates the total price of all scanned items, applying pricing rules as specified.
     * @returns The total price of the scanned items.
     */
    total(): number {
        const itemCounts = this.countItems();
        let totalPrice = 0;

        Object.keys(itemCounts).forEach((item) => {
            const count = itemCounts[item];
            const price = this.calculatePrice(item, count);
            totalPrice += price;
        });

        return totalPrice;
    }

    /**
     * Counts the occurrences of each scanned item.
     * @returns An object with item SKUs as keys and their respective counts as values.
     */
    private countItems(): { [key: string]: number } {
        return this.scannedItems.reduce((acc: any, item: string) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
    }

    /**
     * Calculates the price of a specific item based on its count and pricing rules.
     * @param item - The SKU of the item.
     * @param count - The count of the item.
     * @returns The calculated price for the item.
     */
    private calculatePrice(item: string, count: number): number {
        let rule: PricingDeal = this.pricingRules[item];
        if (!rule) {
            // No special pricing rule, use regular price
            return count * ProductCatalogue[item].price;
        }

        // Apply discount deal pricing rule
        if (rule.type === PricingDealName.DiscountDeal) {
            const discountDeal: DiscountDeal =  rule as DiscountDeal;
            if (count > discountDeal.minimumCountForDiscount) {
                // Apply bulk discount
                return count * discountDeal.discountPrice;
            }
        }// Apply free deal pricing rule
        else if (rule.type === PricingDealName.FreeDeal) {
            console.log("hello")
            const freeDeal: FreeDeal = rule as FreeDeal;
            if (count >= freeDeal.minimumCountForFreeDeal) {
                // Apply free deal (buy X, pay for Y)
                const discountBundle= Math.floor(count / freeDeal.minimumCountForFreeDeal);
                console.log("freeDeal:", discountBundle);
                let remainingWithoutOffer = count % freeDeal.minimumCountForFreeDeal;
                return (discountBundle * freeDeal.countToPay + remainingWithoutOffer) * ProductCatalogue[item].price;
            }
        }

        // No applicable rule, use regular price
        return count * ProductCatalogue[item].price;
    }
}

/**
 * Enum representing the types of pricing deals.
 */
export enum PricingDealName {
    FreeDeal = 'FreeDeal',
    DiscountDeal = 'DiscountDeal'
}

/**
 * Interface representing a generic pricing deal.
 */
export interface PricingDeal {
    type: PricingDealName;
}

/**
 * Interface representing a free deal pricing rule.
 */
export interface FreeDeal extends PricingDeal {
    type: PricingDealName;
    minimumCountForFreeDeal: number;
    countToPay: number;
}

/**
 * Interface representing a discount deal pricing rule.
 */
export interface DiscountDeal extends PricingDeal {
    minimumCountForDiscount: number;
    discountPrice: number;
}

/**
 * Interface representing a product with a name and price.
 */
export interface Product {
    name: string;
    price: number;
}

/**
 * Catalogue of products with their SKUs, names, and prices.
 */
export const ProductCatalogue: { [key: string]: Product } = {
    ipd: { name: "Super iPad", price: 549.99 },
    mbp: { name: "MacBook Pro", price: 1399.99 },
    atv: { name: "Apple TV", price: 109.5 },
    vga: { name: "VGA adapter", price: 30.0 },
};

/**
 * Interface representing pricing rules for various products.
 */
export interface PricingRules {
    [key: string]: FreeDeal | DiscountDeal;
}
