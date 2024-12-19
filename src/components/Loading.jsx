import React from 'react'

export const LoadingSpinner = ({ size = 96, width = 2, className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={width}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      style={{
        animation: 'spin 1s linear infinite',
        display: 'inline-block'
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}
