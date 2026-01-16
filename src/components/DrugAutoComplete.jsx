import { useState, useEffect, useRef } from 'react'
import './DrugAutoComplete.css'

/**
 * 의약품 자동완성 입력 컴포넌트
 * 식약처 API를 활용하여 의약품명을 검색
 */
function DrugAutoComplete({
    value = '',
    onChange,
    onSelect,
    searchFn,
    placeholder = '약품명을 입력하세요',
    label,
    helper,
    debounceMs = 300,
    minChars = 2
}) {
    const [inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const inputRef = useRef(null)
    const listRef = useRef(null)
    const debounceRef = useRef(null)

    // 외부 value 변경 시 동기화
    useEffect(() => {
        setInputValue(value)
    }, [value])

    // 검색 실행
    const performSearch = async (query) => {
        if (!query || query.length < minChars) {
            setSuggestions([])
            setIsOpen(false)
            return
        }

        setIsLoading(true)
        try {
            const results = await searchFn(query)
            setSuggestions(results)
            setIsOpen(results.length > 0)
            setHighlightedIndex(-1)
        } catch (error) {
            console.error('검색 오류:', error)
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }

    // 입력 변경 핸들러 (디바운스 적용)
    const handleInputChange = (e) => {
        const newValue = e.target.value
        setInputValue(newValue)
        onChange?.(newValue)

        // 디바운스
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }
        debounceRef.current = setTimeout(() => {
            performSearch(newValue)
        }, debounceMs)
    }

    // 항목 선택
    const handleSelect = (item) => {
        setInputValue(item.itemName)
        onChange?.(item.itemName)
        onSelect?.(item)
        setIsOpen(false)
        setSuggestions([])
    }

    // 키보드 네비게이션
    const handleKeyDown = (e) => {
        if (!isOpen) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlightedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                )
                break
            case 'Enter':
                e.preventDefault()
                if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                    handleSelect(suggestions[highlightedIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                break
        }
    }

    // 포커스 아웃 시 드롭다운 닫기
    const handleBlur = (e) => {
        // 드롭다운 내부 클릭 시 닫지 않음
        if (listRef.current?.contains(e.relatedTarget)) return
        setTimeout(() => setIsOpen(false), 150)
    }

    return (
        <div className="drug-autocomplete">
            {label && (
                <label className="drug-autocomplete-label">
                    {label}
                </label>
            )}
            <div className="drug-autocomplete-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    className="drug-autocomplete-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {isLoading && (
                    <span className="drug-autocomplete-spinner" />
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul
                    ref={listRef}
                    className="drug-autocomplete-list"
                    role="listbox"
                >
                    {suggestions.map((item, index) => (
                        <li
                            key={item.prdlstStdrCode || index}
                            className={`drug-autocomplete-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                            onClick={() => handleSelect(item)}
                            role="option"
                            aria-selected={index === highlightedIndex}
                        >
                            <span className="drug-item-name">{item.itemName}</span>
                            <span className="drug-item-company">{item.entpName}</span>
                        </li>
                    ))}
                </ul>
            )}

            {helper && (
                <span className="drug-autocomplete-helper">{helper}</span>
            )}
        </div>
    )
}

export default DrugAutoComplete
