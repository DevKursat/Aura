'use client'

import { useEffect, useCallback, useRef } from 'react'

interface UsePushNotificationsOptions {
  vapidPublicKey?: string
  onSubscribe?: (subscription: PushSubscription) => void
  onUnsubscribe?: () => void
}

export function usePushNotifications(options: UsePushNotificationsOptions = {}) {
  const { vapidPublicKey, onSubscribe, onUnsubscribe } = options
  const subscriptionRef = useRef<PushSubscription | null>(null)

  const isSupported = typeof window !== 'undefined' && 'PushManager' in window

  const getSubscription = useCallback(async () => {
    if (!isSupported) return null

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    subscriptionRef.current = subscription
    return subscription
  }, [isSupported])

  const subscribe = useCallback(async () => {
    if (!isSupported || !vapidPublicKey) return null

    try {
      const registration = await navigator.serviceWorker.ready

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.log('Notification permission denied')
        return null
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      subscriptionRef.current = subscription
      onSubscribe?.(subscription)
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push:', error)
      return null
    }
  }, [isSupported, vapidPublicKey, onSubscribe])

  const unsubscribe = useCallback(async () => {
    const subscription = subscriptionRef.current
    if (!subscription) return false

    try {
      await subscription.unsubscribe()
      subscriptionRef.current = null
      onUnsubscribe?.()
      return true
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    }
  }, [onUnsubscribe])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  return {
    isSupported,
    subscription: subscriptionRef.current,
    subscribe,
    unsubscribe,
    getSubscription,
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
