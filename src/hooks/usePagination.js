import { useSearchParams } from 'react-router-dom'

export function usePagination (items, itemsPerPage = 8) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value.toString() })
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange
  }
}
