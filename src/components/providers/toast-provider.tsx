import { Toaster } from "sonner"

export function ToastProvider() {
  return (
      <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          visibleToasts={3}
          toastOptions={{
            duration: 5000, // 5초
            style: {
              fontSize: '14px'
            }
          }}
      />
  )
}