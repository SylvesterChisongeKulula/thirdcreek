export interface Toast {
  id: number
  message: string
  tone: 'error' | 'success'
}

let nextId = 1

export function useToast() {
  const toasts = useState<Toast[]>('admin-toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function show(message: string, tone: Toast['tone'] = 'error') {
    const id = nextId++
    toasts.value = [...toasts.value, { id, message, tone }]
    setTimeout(() => dismiss(id), 5000)
  }

  return { toasts, show, dismiss }
}
