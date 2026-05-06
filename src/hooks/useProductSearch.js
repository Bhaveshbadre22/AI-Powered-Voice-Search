import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  setClaudeStatus,
  clearSearch as clearSearchAction,
  saveToHistory,
} from '../features/search/searchSlice'
import {
  setFilteredProducts,
  clearFiltered,
} from '../features/products/productsSlice'
import { searchWithClaudeAPI } from '../features/search/claudeAPI'

function extractPriceConstraint(query) {
  const q = query.toLowerCase()
  // "under $80", "below $80", "less than $80", "cheaper than $80", "no more than $80", "at most $80"
  const underMatch = q.match(/(?:under|below|less than|cheaper than|no more than|at most)\s*\$?\s*(\d+(?:\.\d+)?)/)
  // "over $80", "above $80", "more than $80", "at least $80"
  const overMatch = q.match(/(?:over|above|more than|at least)\s*\$?\s*(\d+(?:\.\d+)?)/)
  return {
    maxPrice: underMatch ? parseFloat(underMatch[1]) : null,
    minPrice: overMatch ? parseFloat(overMatch[1]) : null,
  }
}

export function useProductSearch() {
  const dispatch = useAppDispatch()
  const claudeStatus = useAppSelector(state => state.search.claudeStatus)
  const products = useAppSelector(state => state.products.all)

  const handleSearch = useCallback(
    async query => {
      if (!query?.trim() || !products.length) return
      dispatch(setClaudeStatus('loading'))
      try {
        const results = await searchWithClaudeAPI(products, query)
        const { maxPrice, minPrice } = extractPriceConstraint(query)

        const filtered = results.filter(item => {
          const product = products.find(p => p.id === item.id)
          if (!product) return false
          if (maxPrice !== null && product.price > maxPrice) return false
          if (minPrice !== null && product.price < minPrice) return false
          return true
        })

        dispatch(setFilteredProducts(filtered))
        dispatch(setClaudeStatus('done'))
        dispatch(saveToHistory(query.trim()))
      } catch (err) {
        console.error('Claude API error:', err)
        dispatch(setClaudeStatus('error'))
      }
    },
    [dispatch, products],
  )

  const handleClear = useCallback(() => {
    dispatch(clearSearchAction())
    dispatch(clearFiltered())
  }, [dispatch])

  const isSearching = claudeStatus === 'loading'

  return { handleSearch, handleClear, isSearching }
}
