/*
 * PurgeCSS config — safe, verifiable CSS trimming for the dhirai theme.
 *
 * Scans every Liquid template/section/snippet/layout AND the theme JS
 * (classes are toggled in luxe-theme.js) to find selectors actually in use,
 * then strips the rest. Output goes to ./purged/ — originals are untouched
 * until you preview and approve.
 *
 * Run:   npm run purge        (writes trimmed CSS to ./purged/ + prints savings)
 *
 * The safelist below protects classes that PurgeCSS can't see because they're
 * added at runtime by JS, or built dynamically in Liquid (e.g. badge--{{color}}).
 */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './templates/**/*.liquid',
    './templates/**/*.json',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './assets/*.js',
    './config/*.json',
  ],
  css: [
    './assets/theme-base.css',
    './assets/theme-header.css',
    './assets/theme-sections.css',
    './assets/theme-footer.css',
    './assets/theme-drawers.css',
    './assets/theme-product.css',
    './assets/theme-collection.css',
    './assets/theme-pages.css',
    './assets/theme-responsive.css',
    './assets/theme-overrides.css',
    './assets/luxe-animations.css',
  ],
  // Match class fragments inside Liquid string concatenation too.
  defaultExtractor: (content) => content.match(/[A-Za-z0-9_-]+/g) || [],
  safelist: {
    standard: [
      'js', 'no-js', 'open', 'active', 'loaded', 'page-loaded', 'is-visible',
      'revealed', 'overflow-hidden', 'scrolled', 'hidden', 'visible', 'error',
      'success', 'disabled', 'selected', 'in-cart', 'sticky', 'fixed',
      /^template-/, /^shopify-/, /^rte/, /^swiper/, /^splide/,
    ],
    // Keep all modifier variants of dynamic components (badge colors, swatches,
    // size states, tab indices, etc.) — these are built from data at runtime.
    greedy: [
      /badge--/, /category-strip__/, /product-card__/, /hero-slide/, /hero-slider/,
      /swatch/, /__size/, /tabbed-collections__/, /trending-cats/, /image-grid__/,
      /cart-drawer__/, /wishlist-drawer__/, /toast/, /size-sheet/, /quick-add/,
      /pdp-/, /product-info__/, /announcement/, /bottom-nav/, /filter/, /sort/,
      /pagination/, /count-badge/, /sale-badge/, /offer-label/, /bwk-/,
      /data-animate/, /-active$/, /-open$/, /--reversed$/, /--sale$/, /--new$/,
    ],
  },
};
