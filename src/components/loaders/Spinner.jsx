import React from 'react'

/**
 * Centered Circular Spinner Component.
 *
 * Renders a circular loader in the exact center of the screen, overlaid
 * on top of the content so that tables, forms, and pages NEVER shift or move down.
 *
 * Props:
 *  - size: 'xs' (18px) | 'sm' (26px) | 'md' (40px, default) | 'lg' (54px)
 *  - inline: boolean - whether to render just the circle element without overlay
 *  - color: string - border top color (defaults to portal primary #337ab7)
 *  - className: string - extra class names on the overlay
 *  - style: object - extra styles for overlay
 */
export default function Spinner({
  size = 'md',
  inline = false,
  color = '#337ab7',
  className = '',
  style = {},
}) {
  const dimensions = {
    xs: { size: 18, border: 2 },
    sm: { size: 26, border: 2.5 },
    md: { size: 40, border: 3.5 },
    lg: { size: 54, border: 4.5 },
  }[size] || { size: 40, border: 3.5 }

  const circle = (
    <div
      role="status"
      aria-label="Loading"
      className="portal-loader-circle"
      style={{
        width: `${dimensions.size}px`,
        height: `${dimensions.size}px`,
        border: `${dimensions.border}px solid rgba(0, 0, 0, 0.12)`,
        borderTopColor: color,
        borderRadius: '50%',
        boxSizing: 'border-box',
        animation: 'portal-circle-spin 0.75s linear infinite',
      }}
    >
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Loading
      </span>
    </div>
  )

  if (inline) {
    return circle
  }

  return (
    <div
      className={`portal-spinner-overlay ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {circle}
    </div>
  )
}
