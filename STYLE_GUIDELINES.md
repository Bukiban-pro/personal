# Chefkix Style Guidelines

> ⚠️ **DEPRECATED**: This file is being phased out in favor of [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> 
> The new Design System document is the **single source of truth** for all design decisions.
> Please refer to it for the complete, up-to-date guidelines.

---

## Quick Reference (Subset of DESIGN_SYSTEM.md)

### 1. Avoid Arbitrary Hardcoded Values
- **Problem**: Arbitrary hardcoded CSS values (e.g., `w-[92px]`, `h-[320px]`) become undetectable technical debt that cannot be systematically fixed later.
- **Solution**: Always use canonical design tokens defined in `src/app/globals.css` and exposed via `tailwind.config.js`.
- **Example (Bad)**: `className='w-[92px]'`
- **Example (Good)**: `className='w-nav'` (where `w-nav` is mapped to `var(--nav-w)` in Tailwind config)

### 2. Verify Canonical References
- **Problem**: Assuming a design token or CSS class exists without verification can break everything silently.
- **Solution**: 
  1. Check `src/app/globals.css` for the CSS variable definition (e.g., `--nav-w: 92px`)
  2. Check `tailwind.config.js` to ensure it's mapped to a Tailwind utility (e.g., `width: { nav: 'var(--nav-w)' }`)
  3. Use grep/search to find existing usages and patterns in the codebase
- **Before changing**: Always verify the token exists and is used consistently elsewhere

### 3. Rely on Logic, Distrust Visual Estimation
- **Strength**: We excel at logical reasoning and code structure
- **Weakness**: We cannot see or test visual rendering
- **Worst Nemesis**: Canonical misalignment (using undefined tokens or breaking design system consistency)
- **Solution**:
  - Look for real-world examples in the project (grep for similar components)
  - Search online examples (e.g., Twitter/X sidebar width, standard nav patterns)
  - Ask for screenshots or HTML inspection output when visual issues are reported

### 4. Think Long-Term, Clean Solutions
- **Principle**: Optimize for future maintainability, not just immediate fixes
- **Checklist before implementing**:
  - Is this using centralized design tokens?
  - Will this scale across breakpoints (mobile/tablet/desktop)?
  - Can another developer find and modify this easily?
  - Does this follow existing patterns in the codebase?

## Design Token Workflow

### Step-by-step process when styling:
1. **Identify the visual requirement** (e.g., "sidebar is too narrow, text overflows")
2. **Find canonical reference**:
   - Check `src/app/globals.css` for CSS variables (`:root { --nav-w: 92px; }`)
   - Check `tailwind.config.js` for Tailwind mappings (`width: { nav: 'var(--nav-w)' }`)
3. **Search for existing usage**: Use grep to find how the token is used elsewhere
4. **Apply consistently**: Use the canonical class (e.g., `md:w-nav`) instead of arbitrary values
5. **Verify mapping**: Confirm the chain is complete: CSS var → Tailwind config → component usage

### Example: Fixing Sidebar Width
**Bad approach** (arbitrary):
```tsx
className='hidden md:flex md:w-[92px]'  // ❌ Hardcoded, undetectable
```

**Good approach** (canonical):
```tsx
// 1. Define in globals.css (already exists)
:root {
  --nav-w: 92px;
}

// 2. Map in tailwind.config.js
module.exports = {
  theme: {
    extend: {
      width: {
        nav: 'var(--nav-w)',  // ✅ Canonical mapping
      }
    }
  }
}

// 3. Use in component
className='hidden md:flex md:w-nav'  // ✅ Uses design token
```

## Common Patterns

### Layout Widths
- Sidebar (left nav): `w-nav` → `var(--nav-w)` → `92px`
- Right sidebar: `w-right` → `var(--right-w)` → `280px`
- Never use arbitrary `w-[Xpx]` for these structural elements

### Spacing
- Use semantic spacing scale: `gap-xs`, `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`, `gap-2xl`, `gap-3xl`
- Maps to: `--space-xs` (4px), `--space-sm` (8px), `--space-md` (12px), etc.

### Border Radius
- Use: `rounded-radius` (default), `rounded-sm`, `rounded-lg`
- Avoid: `rounded-[16px]`

### Colors
- Use semantic names: `bg-panel-bg`, `text-muted`, `border-border`, `bg-primary`
- Avoid: `bg-[#faf8f5]`

### Shadows
- Use: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-glow`
- Avoid: `shadow-[0_4px_16px_rgba(...)]`

## When to Update Design Tokens

If the visual requirement needs a **new width** or **dimension** not covered by existing tokens:
1. Add to `src/app/globals.css` (e.g., `--sidebar-expanded: 240px`)
2. Map in `tailwind.config.js` (e.g., `width: { 'sidebar-expanded': 'var(--sidebar-expanded)' }`)
3. Use in components (e.g., `lg:w-sidebar-expanded`)
4. Document the new token and its purpose

## Verification Checklist

Before committing style changes:
- [ ] No arbitrary values like `w-[92px]`, `h-[320px]`, `text-[14px]`
- [ ] All design tokens exist in `globals.css`
- [ ] All tokens are mapped in `tailwind.config.js`
- [ ] Responsive breakpoints use consistent tokens (not switching between arbitrary and canonical)
- [ ] Grep search confirms the pattern is used consistently across similar components
- [ ] Changes follow existing project patterns (check similar components for reference)

## Resources

- Design tokens: `src/app/globals.css` (`:root` section)
- Tailwind config: `tailwind.config.js` (`.extend` sections)
- Grep for patterns: `grep -r "className.*w-nav" src/` to find similar usage
- Inspect live examples: Use browser DevTools to copy HTML and analyze rendered CSS

---

**TL;DR**: Use canonical design tokens, verify they exist, distrust visual estimation, grep for patterns, think long-term.
