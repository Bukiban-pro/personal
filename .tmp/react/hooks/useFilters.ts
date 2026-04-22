import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * All-in-one filter state with debounce, auto-fetch, and page reset.
 * Replaces 3-4 separate hooks (useDebounce + useState + useEffect + usePagination).
 *
 * Dependencies: React
 *
 * @example
 * const { filters, debouncedFilters, loading, handleFilterChange, handlePageChange, resetFilters } =
 *   useFilters({ page: 1, size: 10, search: '' }, fetchProducts, 500)
 *
 * <input onChange={e => handleFilterChange('search', e.target.value)} />
 * <Pagination page={filters.page} onChange={handlePageChange} />
 */

export interface Filters {
	page: number
	size: number
	[key: string]: any
}

interface UseFiltersReturn<T extends Filters> {
	filters: T
	debouncedFilters: T
	loading: boolean
	error: string | null
	handleFilterChange: (key: keyof T, value: any) => void
	handlePageChange: (newPage: number) => void
	handlePageSizeChange: (newPageSize: number) => void
	resetFilters: () => void
	updateFilters: (newFilters: Partial<T>) => void
	setError: (error: string | null) => void
	setLoading: (loading: boolean) => void
}

export function useFilters<T extends Filters = Filters>(
	initialFilters: Partial<T> = {},
	fetchFunction?: (filters: T) => Promise<void>,
	debounceDelay: number = 500,
): UseFiltersReturn<T> {
	const [filters, setFilters] = useState<T>({
		page: 1,
		size: 10,
		...initialFilters,
	} as T)

	const [debouncedFilters, setDebouncedFilters] = useState<T>(filters)
	const [loading, setLoading] = useState<boolean>(!!fetchFunction)
	const [error, setError] = useState<string | null>(null)

	const fetchFunctionRef = useRef(fetchFunction)
	fetchFunctionRef.current = fetchFunction

	// Debounce filters
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedFilters(filters), debounceDelay)
		return () => clearTimeout(timer)
	}, [filters, debounceDelay])

	// Auto-fetch on debounced filter change
	useEffect(() => {
		const fn = fetchFunctionRef.current
		if (!fn) return

		const execute = async () => {
			try {
				setLoading(true)
				setError(null)
				await fn(debouncedFilters)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch data')
			} finally {
				setLoading(false)
			}
		}
		execute()
	}, [debouncedFilters])

	const handleFilterChange = useCallback((key: keyof T, value: any) => {
		setFilters(prev => ({
			...prev,
			[key]: value,
			...(key !== 'page' && { page: 1 }),
		}))
	}, [])

	const handlePageChange = useCallback(
		(newPage: number) => {
			const next = { ...filters, page: newPage }
			setFilters(next)
			setDebouncedFilters(next) // Immediate for pagination
		},
		[filters],
	)

	const handlePageSizeChange = useCallback(
		(newPageSize: number) => {
			const next = { ...filters, size: newPageSize, page: 1 }
			setFilters(next)
			setDebouncedFilters(next)
		},
		[filters],
	)

	const resetFilters = useCallback(() => {
		const reset = { page: 1, size: 10, ...initialFilters } as T
		setFilters(reset)
		setDebouncedFilters(reset)
	}, [initialFilters])

	const updateFilters = useCallback((newFilters: Partial<T>) => {
		setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
	}, [])

	return {
		filters, debouncedFilters, loading, error,
		handleFilterChange, handlePageChange, handlePageSizeChange,
		resetFilters, updateFilters, setError, setLoading,
	}
}
