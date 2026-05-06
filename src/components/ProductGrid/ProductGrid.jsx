import React from 'react'
import { useAppSelector } from '../../app/hooks'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

function SkeletonCard() {
  const shimmer = {
    background: 'linear-gradient(90deg, #EDEDF5 0%, #E0DFF0 50%, #EDEDF5 100%)',
    backgroundSize: '400px 100%',
    animation: 'shimmer 1.4s infinite linear',
    borderRadius: '6px',
  }
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '0.5px solid rgba(0,0,0,0.07)',
      overflow: 'hidden',
    }}>
      <div style={{ aspectRatio: '1 / 1', ...shimmer, borderRadius: 0 }} />
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ height: '8px', width: '40%', marginBottom: '8px', ...shimmer }} />
        <div style={{ height: '10px', marginBottom: '6px', ...shimmer }} />
        <div style={{ height: '10px', width: '80%', marginBottom: '12px', ...shimmer }} />
        <div style={{ height: '14px', width: '28%', ...shimmer }} />
      </div>
    </div>
  )
}

export default function ProductGrid() {
  const { all, filtered, status } = useAppSelector(state => state.products)
  const { claudeStatus } = useAppSelector(state => state.search)

  if (status === 'error') return <ErrorState />

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: '18px' }}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const hasResults = claudeStatus === 'done' && filtered.length > 0
  const noResults  = claudeStatus === 'done' && filtered.length === 0

  if (noResults) return <EmptyState />

  const displayProducts = hasResults ? all.filter(p => filtered.includes(p.id)) : all

  const sectionLabel = hasResults
    ? `${filtered.length} MATCH${filtered.length !== 1 ? 'ES' : ''} FOUND`
    : 'ALL PRODUCTS'

  return (
    <div>
      {/* Section divider label */}
      <p style={{
        fontSize: '20px',
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: '#0f0f0f',
        textAlign: 'left',
        margin: '32px 0 22px',
      }}>
        {sectionLabel}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: '18px' }}>
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
