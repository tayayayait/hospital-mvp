import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'
import './Modal.css'

/**
 * Modal 컴포넌트
 * 상세서.md Section 5.7 기반
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {string} props.title - 모달 제목
 * @param {'sm' | 'md' | 'lg'} props.size - 모달 크기
 * @param {boolean} props.closeOnOverlay - 오버레이 클릭 시 닫기 여부
 * @param {React.ReactNode} props.footer - 푸터 영역
 */
function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    closeOnOverlay = true,
    footer,
    children,
    className = '',
}) {
    const modalRef = useRef(null)
    const previousActiveElement = useRef(null)

    // ESC 키로 닫기 + 포커스 트랩
    useEffect(() => {
        if (!isOpen) return

        // 이전 포커스 저장
        previousActiveElement.current = document.activeElement

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose?.()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        // 모달에 포커스
        modalRef.current?.focus()

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
            // 이전 포커스 복원
            previousActiveElement.current?.focus()
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose?.()
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                ref={modalRef}
                className={`modal modal-${size} ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                tabIndex={-1}
            >
                {/* Header */}
                <div className="modal-header">
                    {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// 확인 모달 컴포넌트
Modal.Confirm = function ModalConfirm({
    isOpen,
    onClose,
    onConfirm,
    title = '확인',
    message,
    confirmText = '확인',
    cancelText = '취소',
    confirmVariant = 'primary',
    loading = false,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            closeOnOverlay={!loading}
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p style={{ font: 'var(--text-body)', margin: 0 }}>{message}</p>
        </Modal>
    )
}

export default Modal
