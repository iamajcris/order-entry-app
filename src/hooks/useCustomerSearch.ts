import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { customersApi } from '@/lib/api'
import type { Customer } from '@/types'

interface UseCustomerSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Customer[]
  isSearching: boolean
}

export function useCustomerSearch(): UseCustomerSearchReturn {
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useQuery({
    queryKey: ['customers', 'search', debouncedQuery],
    queryFn: () => customersApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    placeholderData: [],
  })

  return {
    query,
    setQuery,
    results: data ?? [],
    isSearching: isLoading && debouncedQuery.length >= 2,
  }
}
