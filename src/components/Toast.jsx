import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import './Toast.css'

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
}

/**
 * Toast 컴포넌트
 * 상세서.md Section 5.8 기반
 */
function Toast({ message, type = 'info', onClose }) {
    const Icon = ICONS[type] || ICONS.info

    return (
        <div className={`toast toast-${type}`} role="alert">
            <Icon size={20} className="toast-icon" />
            <span className="toast-message">{message}</span>
            <button
                className="toast-close"
                onClick={onClose}
                aria-label="닫기"
            >
                <X size={16} />
            </button>
        </div>
    )
}

export default Toast
