import React from 'react'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

interface StatusBadgeProps {
  status: OrderStatus | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normStatus = (status || '').toLowerCase()

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
      label: 'Pending',
    },
    paid: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      label: 'Paid',
    },
    confirmed: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      label: 'Confirmed',
    },
    processing: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      label: 'Processing',
    },
    shipped: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      label: 'Shipped',
    },
    delivered: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      label: 'Delivered',
    },
    cancelled: {
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      label: 'Cancelled',
    },
  }

  const config = statusConfig[normStatus] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200 border-gray-300',
    label: status.toUpperCase(),
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}
