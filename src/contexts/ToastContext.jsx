import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    // 토스트 추가
    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random()

        setToasts(prev => [...prev, { id, message, type, duration }])

        // 자동 제거 (중요 오류 제외)
        if (type !== 'error' || duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [])

    // 토스트 제거
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    // 편의 함수들
    const showSuccess = useCallback((message, duration) => {
        return addToast(message, 'success', duration)
    }, [addToast])

    const showError = useCallback((message, duration = 0) => {
        return addToast(message, 'error', duration)
    }, [addToast])

    const showWarning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration)
    }, [addToast])

    const showInfo = useCallback((message, duration) => {
        return addToast(message, 'info', duration)
    }, [addToast])

    const value = {
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
            <style>{`
        .toast-container {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          z-index: 9999;
          max-width: 400px;
        }
        
        @media (max-width: 767px) {
          .toast-container {
            top: var(--space-4);
            bottom: auto;
            left: var(--space-4);
            right: var(--space-4);
            max-width: none;
          }
        }
      `}</style>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export default ToastContext
