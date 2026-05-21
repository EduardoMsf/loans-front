'use client'

import { useEffect, useRef, useId, type ReactNode } from 'react'
import { cn } from '@shared/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement as HTMLElement

    const focusFirst = () => {
      const el = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      el?.focus()
    }
    const raf = requestAnimationFrame(focusFirst)

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      )
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', handleKey)
      triggerRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'relative z-10 w-full max-w-md rounded-[2px] border p-6',
          'border-[color:var(--color-border)] bg-[color:var(--color-surface)]',
          className,
        )}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h2
              id={titleId}
              className="text-base font-semibold text-[color:var(--color-text-primary)]"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar diálogo"
              className="rounded-[2px] p-1 text-[color:var(--color-text-muted)] transition-colors hover:text-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
