import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import './Select.css'

/**
 * Select 컴포넌트
 * 상세서.md Section 5.5 기반
 * 
 * @param {Object} props
 * @param {string} props.label - 라벨 텍스트
 * @param {Array} props.options - 선택 옵션 [{value, label}]
 * @param {string} props.value - 선택된 값
 * @param {Function} props.onChange - 값 변경 핸들러
 * @param {string} props.placeholder - 플레이스홀더
 * @param {string} props.error - 오류 메시지
 * @param {boolean} props.required - 필수 여부
 */
function Select({
    label,
    options = [],
    value,
    onChange,
    placeholder = '선택하세요',
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const containerRef = useRef(null)
    const listRef = useRef(null)
    const id = useId()

    const selectedOption = options.find(opt => opt.value === value)

    // 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 키보드 네비게이션
    const handleKeyDown = (e) => {
        if (disabled) return

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault()
                if (isOpen && focusedIndex >= 0) {
                    handleSelect(options[focusedIndex])
                } else {
                    setIsOpen(!isOpen)
                }
                break
            case 'ArrowDown':
                e.preventDefault()
                if (!isOpen) {
                    setIsOpen(true)
                } else {
                    setFocusedIndex(prev => Math.min(prev + 1, options.length - 1))
                }
                break
            case 'ArrowUp':
                e.preventDefault()
                if (isOpen) {
                    setFocusedIndex(prev => Math.max(prev - 1, 0))
                }
                break
            case 'Escape':
                setIsOpen(false)
                break
        }
    }

    const handleSelect = (option) => {
        onChange?.(option.value)
        setIsOpen(false)
        setFocusedIndex(-1)
    }

    return (
        <div className={`select-wrapper ${className}`} ref={containerRef}>
            {label && (
                <label className="select-label" id={`${id}-label`}>
                    {label}
                    {required && <span className="select-required">*</span>}
                </label>
            )}
            <button
                type="button"
                className={`select-trigger ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${id}-label` : undefined}
                {...props}
            >
                <span className={selectedOption ? 'select-value' : 'select-placeholder'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} className={`select-arrow ${isOpen ? 'rotated' : ''}`} />
            </button>

            {isOpen && (
                <ul
                    className="select-dropdown"
                    role="listbox"
                    ref={listRef}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value}
                            className={`select-option ${option.value === value ? 'selected' : ''} ${index === focusedIndex ? 'focused' : ''}`}
                            onClick={() => handleSelect(option)}
                            onMouseEnter={() => setFocusedIndex(index)}
                        >
                            <span>{option.label}</span>
                            {option.value === value && <Check size={16} />}
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <span className="select-error">{error}</span>
            )}
        </div>
    )
}

export default Select
