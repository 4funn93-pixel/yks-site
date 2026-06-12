/**
 * YKS Pro — the premium membership tier.
 *
 * The editable values live in `pro.data.json`, which the two admins can change
 * from the CMS at /admin → "Pro Settings" (no code). Saving there commits the
 * JSON and rebuilds the site, so pricing, checkout URLs and the feature list
 * update everywhere automatically.
 *
 * Set the two checkout URLs after creating the subscription products in Lemon
 * Squeezy (Subscriptions → recurring). License-key delivery + gating is handled
 * by the Netlify functions (see PRO.md). Until a checkout URL is set, the Pro
 * CTAs render in a "coming soon" state instead of linking to a dead checkout.
 */
import data from './pro.data.json';

export interface ProConfig {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  checkoutMonthly: string;
  checkoutYearly: string;
  features: string[];
  guarantee: string;
}

export const PRO: ProConfig = data;

/** True once at least one subscription checkout URL has been configured. */
export const PRO_LIVE = Boolean(PRO.checkoutMonthly || PRO.checkoutYearly);
