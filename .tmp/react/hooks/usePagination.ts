import { useState, useCallback, useMemo } from 'react'

/**
 * Complete pagination state machine.
 *
 * Dependencies: React
 *
 * @example
 * const { currentPage, pagination, goToPage, nextPage, previousPage, setTotal } =
 *   usePagination({ initialPage: 1, pageSize: 10 })
 *
 * // After fetching: setTotal(response.totalItems)
 * <button disabled={!pagination.hasNextPage} onClick={nextPage}>Next</button>
 */

interface UsePaginationOptions {
	initialPage?: number
	pageSize?: number
	initialTotal?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
	const { initialPage = 1, pageSize = 10, initialTotal = 0 } = options

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [total, setTotal] = useState(initialTotal)
	const [itemsPerPage] = useState(pageSize)

	const pagination = useMemo(() => {
		const totalPages = Math.ceil(total / itemsPerPage) || 1
		return {
			total,
			totalPages,
			hasNextPage: currentPage < totalPages,
			hasPreviousPage: currentPage > 1,
		}
	}, [total, itemsPerPage, currentPage])

	const resetPagination = useCallback(() => {
		setCurrentPage(initialPage)
		setTotal(0)
	}, [initialPage])

	const goToPage = useCallback(
		(page: number) => setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages))),
		[pagination.totalPages],
	)

	const nextPage = useCallback(() => {
		if (pagination.hasNextPage) setCurrentPage(p => p + 1)
	}, [pagination.hasNextPage])

	const previousPage = useCallback(() => {
		if (pagination.hasPreviousPage) setCurrentPage(p => p - 1)
	}, [pagination.hasPreviousPage])

	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, total)

	return {
		currentPage, total, pageSize: itemsPerPage, pagination,
		startItem, endItem,
		setCurrentPage, setTotal, goToPage, nextPage, previousPage, resetPagination,
	}
}
