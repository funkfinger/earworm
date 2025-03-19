"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "success" | "error"
  duration?: number
}

type ToastOptions = ToastProps & {
  id: string
}

let toastId = 0
const toastStore: {
  toasts: ToastOptions[]
  add: (toast: ToastProps) => void
  remove: (id: string) => void
  listeners: Set<() => void>
} = {
  toasts: [],
  add: (toast) => {
    const id = `toast-${toastId++}`
    toastStore.toasts = [...toastStore.toasts, { ...toast, id }]
    toastStore.listeners.forEach((listener) => listener())

    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        toastStore.remove(id)
      }, toast.duration || 3000)
    }

    return id
  },
  remove: (id) => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
    toastStore.listeners.forEach((listener) => listener())
  },
  listeners: new Set(),
}

export function Toast({ title, description, variant = "default", id }: ToastOptions) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border-2 border-accent-a p-4 shadow-lg transition-all squiggle-border",
        variant === "success" && "bg-green-100",
        variant === "error" && "bg-red-100",
        variant === "default" && "bg-primary-light",
      )}
    >
      <div className="flex-1">
        {title && <h3 className="font-playpen font-medium text-lg">{title}</h3>}
        {description && <p className="font-playpen mt-1 text-sm">{description}</p>}
      </div>
      <button onClick={() => toastStore.remove(id)} className="flex-shrink-0 ml-4 self-start">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  useEffect(() => {
    const updateToasts = () => {
      setToasts([...toastStore.toasts])
    }

    toastStore.listeners.add(updateToasts)
    return () => {
      toastStore.listeners.delete(updateToasts)
    }
  }, [])

  return (
    <div className="fixed top-0 right-0 z-50 p-4 max-h-screen overflow-hidden flex flex-col items-end gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export const toast = (props: ToastProps) => toastStore.add(props)

