# Checkout System

The Checkout System is a TypeScript-based library designed for implementing a flexible pricing system in a computer store. It allows for customizable pricing rules, accommodating various deals and discounts.

## Features

- **Flexible Pricing Rules**: Define pricing rules for different products, including bulk discounts and special deals.
- **Scalable Design**: Easily extend or modify pricing rules to adapt to changing requirements.
- **Simple Integration**: Integrate the library into your TypeScript project with ease.

## Getting Started

1. **Installation**: No installation is required. Simply copy the `checkout.ts` file and use it in your TypeScript project.

2. **Usage**:

    ```typescript
    import { Checkout, PricingRules, ProductCatalogue, DiscountDeal, FreeDeal, PricingDealName } from './checkout';

    const pricingRules: PricingRules = {
        ipd: { type: PricingDealName.DiscountDeal, minimumCountForDiscount: 4, discountPrice: 499.99 },
        atv: { type: PricingDealName.FreeDeal, minimumCountForFreeDeal: 3, countToPay: 2 },
    };

    const co = new Checkout(pricingRules);

    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');

    const total = co.total();
    console.log(`Total: $${total}`);
    ```

3. **Pricing Rules**:
    - Define pricing rules for each product using the `PricingRules` interface.
    - Two types of rules are available: `DiscountDeal` and `FreeDeal`.
    - Examples of rules are provided in the `checkout.test.ts` file.

4. **Products**:
    - Define your product catalog using the `ProductCatalogue` object.
    - Each product has a name and a price.

5. **Examples**:
    - Example scenarios and unit tests are available in the `checkout.test.ts` file.

## Classes and Interfaces

- `Checkout`: Represents the main checkout system.
- `PricingDealName`: Enum representing the types of pricing deals.
- `PricingDeal`: Interface representing a generic pricing deal.
- `FreeDeal`: Interface representing a free deal pricing rule(Ex: If you buy 3 you apy for 2).
- `DiscountDeal`: Interface representing a discount deal pricing rule(Ex: If you buy more than four you pay at fixed discounted price for each item).
- `Product`: Interface representing a product with a name and price.
- `ProductCatalogue`: Catalogue of products with their SKUs, names, and prices.
- `PricingRules`: Interface representing pricing rules for various products.

## Running Tests

To run the provided unit tests, use the following command:

```bash
npm install
npm test
