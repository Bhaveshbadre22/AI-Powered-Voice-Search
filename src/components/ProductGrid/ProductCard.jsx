import React from 'react'
import { useAppSelector } from '../../app/hooks'

function getBadge(product) {
  if (product.id % 7 === 1) return { label: 'New', bg: '#EEEDFE', color: '#534AB7' }
  if (product.id % 7 === 3) return { label: 'Sale', bg: '#FAECE7', color: '#993C1D' }
  return null
}

export default function ProductCard({ product, index }) {
  const reason = useAppSelector(state => state.products.reasons[product.id])
  const badge = getBadge(product)

  const handleClick = () => {
    window.open(`https://fakestoreapi.com/products/${product.id}`, '_blank', 'noopener,noreferrer')
  }

  const delay = `${Math.min(index * 60, 300)}ms`

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className="product-card"
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '0.5px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, border-color 0.18s ease',
        opacity: 0,
        animation: 'fade-up 0.4s ease forwards',
        animationDelay: delay,
        outline: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'
      }}
    >
      {/* Image area */}
      <div style={{
        aspectRatio: '1 / 1',
        background: '#F3F2FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {badge && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: badge.bg,
            color: badge.color,
            fontSize: '10px',
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: '20px',
          }}>
            {badge.label}
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          style={{
            width: '75%',
            height: '75%',
            objectFit: 'contain',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
      </div>

      {/* Card body */}
      <div style={{
        padding: '12px 14px 14px',
        borderTop: '0.5px solid rgba(0,0,0,0.05)',
      }}>
        {/* Category */}
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: '#B4B2A9',
          marginBottom: '4px',
        }}>
          {product.category}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#2C2C2A',
          lineHeight: 1.45,
          marginBottom: '8px',
          marginTop: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.title}
        </h3>

        {/* Claude reason */}
        {reason && (
          <div style={{
            fontSize: '11px',
            color: '#888780',
            lineHeight: 1.4,
            marginBottom: '10px',
            paddingTop: '8px',
            borderTop: '0.5px solid rgba(0,0,0,0.06)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {reason}
          </div>
        )}

        {/* Footer: price + rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: reason ? '0' : '8px',
        }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#2C2C2A',
          }}>
            ${product.price.toFixed(2)}
          </span>

          {product.rating && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              color: '#BA7517',
              fontWeight: 500,
            }}>
              <span>★</span>
              <span>{product.rating.rate}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
