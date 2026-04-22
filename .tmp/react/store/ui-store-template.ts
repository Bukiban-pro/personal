/**
 * UI Store Template — Zustand store for global UI state.
 *
 * Stolen from: ChefKix uiStore + Bookverse sidebar/drawer patterns.
 *
 * Manages app-wide UI state: sidebar, mobile menu, drawers, panels, modals.
 * Extend with your project-specific UI toggles.
 *
 * Dependencies: zustand
 *
 * @example
 * import { useUIStore } from '@/store/ui-store'
 *
 * const { isSidebarOpen, toggleSidebar } = useUIStore()
 * <Button onClick={toggleSidebar}>Menu</Button>
 */

import { create } from 'zustand'

interface UIState {
  // ─── Sidebar ──────────────────────────
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // ─── Mobile Menu ──────────────────────
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void

  // ─── Generic Drawer/Panel ─────────────
  activeDrawer: string | null
  openDrawer: (id: string) => void
  closeDrawer: () => void

  // ─── Command Palette / Search ─────────
  isCommandPaletteOpen: boolean
  toggleCommandPalette: () => void

  // ─── Global Loading State ─────────────
  isPageTransitioning: boolean
  setPageTransitioning: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  // Mobile Menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Drawer
  activeDrawer: null,
  openDrawer: (id) => set({ activeDrawer: id }),
  closeDrawer: () => set({ activeDrawer: null }),

  // Command Palette
  isCommandPaletteOpen: false,
  toggleCommandPalette: () => set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),

  // Page Transition
  isPageTransitioning: false,
  setPageTransitioning: (value) => set({ isPageTransitioning: value }),
}))
