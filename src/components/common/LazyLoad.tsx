'use client'

import { ReactNode, useEffect, useState, useRef } from 'react'
import { Skeleton } from '@/components/ui'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

/**
 * Lazy load component when it enters the viewport
 * Uses Intersection Observer API
 */
export function LazyLoad({
  children,
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  triggerOnce = true,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, triggerOnce])

  return (
    <div ref={ref}>
      {isVisible ? children : (fallback || <DefaultLazyFallback />)}
    </div>
  )
}

function DefaultLazyFallback() {
  return <Skeleton className="h-32 w-full rounded-xl bg-slate-800" />
}

/**
 * Lazy load images with blur placeholder
 */
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-700 animate-pulse" />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  )
}

/**
 * Lazy load a list of items in chunks
 */
interface LazyListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  chunkSize?: number
  className?: string
  itemClassName?: string
}

export function LazyList<T>({
  items,
  renderItem,
  chunkSize = 10,
  className = '',
  itemClassName = '',
}: LazyListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(chunkSize)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = loaderRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < items.length) {
          setVisibleCount(prev => Math.min(prev + chunkSize, items.length))
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [visibleCount, items.length, chunkSize])

  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  return (
    <div className={className}>
      {visibleItems.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent" />
        </div>
      )}
    </div>
  )
}
