import { forwardRef, useId } from 'react'
import './Input.css'

/**
 * Input 컴포넌트
 * 상세서.md Section 5.3 기반
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.error - 오류 메시지
 * @param {string} props.helper - 도움말 텍스트
 * @param {boolean} props.required - 필수 여부
 * @param {'default' | 'large'} props.size - 입력창 크기
 */
const Input = forwardRef(function Input(
    {
        label,
        error,
        helper,
        required = false,
        size = 'default',
        type = 'text',
        className = '',
        ...props
    },
    ref
) {
    const id = useId()
    const inputId = props.id || id
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            {helper && !error && (
                <span id={helperId} className="input-helper">
                    {helper}
                </span>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                className={`input input-${size} ${error ? 'input-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : helper ? helperId : undefined}
                required={required}
                {...props}
            />
            {error && (
                <span id={errorId} className="input-error-message" role="alert">
                    {error}
                </span>
            )}
        </div>
    )
})

export default Input
