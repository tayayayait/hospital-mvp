import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import './Button.css'

/**
 * Button 컴포넌트
 * 상세서.md Section 5.1 기반
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} props.size - 버튼 크기
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} props.variant - 버튼 변형
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.disabled - 비활성화 상태
 * @param {boolean} props.fullWidth - 전체 너비
 */
const Button = forwardRef(function Button(
    {
        children,
        size = 'md',
        variant = 'primary',
        loading = false,
        disabled = false,
        fullWidth = false,
        type = 'button',
        className = '',
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            className={`btn btn-${size} btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 size={16} className="btn-spinner" />}
            <span className={loading ? 'btn-text-loading' : ''}>{children}</span>
        </button>
    )
})

export default Button
