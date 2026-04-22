# Adoption Notes

## Fast path

1. Copy `react/styling/globals.css`
2. Copy `react/lib/utils.ts`
3. Add the component files you actually need
4. Replace colors and fonts with your own tokens
5. Keep text/content outside reusable components when possible

## Rename rules

Safe renames:
- `ProductCarousel` -> `ItemCarousel`
- `GenericLogo` -> project logo name
- `AnimatedText` -> `HeroTypewriter`

## Portability cautions

- `GenericLogo` is plain React, not framework-specific.
- `ProductCarousel` uses `Swiper`; replace if you want a lighter dependency.
- `input-group.tsx` is intentionally standalone and only depends on `cn()`.
- `globals.css` assumes Tailwind v4-style theme tokens.

## Recommended stash discipline

Only add files that are:
- cleaned
- named generically
- documented in one sentence
- independent from product domain
