import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import './Table.css'

/**
 * Table 컴포넌트
 * 상세서.md Section 5.9 기반
 * 
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{key, label, sortable?, render?}]
 * @param {Array} props.data - 테이블 데이터
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {boolean} props.loading - 로딩 상태
 * @param {React.ReactNode} props.emptyState - 빈 상태 컴포넌트
 */
function Table({
    columns = [],
    data = [],
    onRowClick,
    loading = false,
    emptyState,
    className = '',
    ...props
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    const handleSort = (key) => {
        const column = columns.find(col => col.key === key)
        if (!column?.sortable) return

        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0

        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    return (
        <div className={`table-wrapper ${className}`} {...props}>
            <table className="table">
                <thead className="table-head">
                    <tr>
                        {columns.map(column => (
                            <th
                                key={column.key}
                                className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
                                onClick={() => handleSort(column.key)}
                                style={column.width ? { width: column.width } : undefined}
                            >
                                <div className="table-header-content">
                                    <span>{column.label}</span>
                                    {column.sortable && sortConfig.key === column.key && (
                                        sortConfig.direction === 'asc'
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {loading ? (
                        // 로딩 스켈레톤
                        Array.from({ length: 3 }).map((_, idx) => (
                            <tr key={`skeleton-${idx}`} className="table-row skeleton">
                                {columns.map(column => (
                                    <td key={column.key} className="table-cell">
                                        <div className="skeleton-content" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : sortedData.length === 0 ? (
                        // 빈 상태
                        <tr>
                            <td colSpan={columns.length} className="table-empty">
                                {emptyState || (
                                    <div className="table-empty-content">
                                        <span>데이터가 없습니다</span>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ) : (
                        // 데이터 행
                        sortedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`table-row ${onRowClick ? 'clickable' : ''}`}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map(column => (
                                    <td key={column.key} className="table-cell">
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table
