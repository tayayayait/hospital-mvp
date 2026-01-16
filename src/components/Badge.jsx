import './Badge.css'

/**
 * Badge 컴포넌트
 * 상세서.md Section 5.10 기반
 * 
 * @param {Object} props
 * @param {'default' | 'info' | 'success' | 'warning' | 'danger'} props.variant - 배지 변형
 * @param {'low' | 'medium' | 'high'} props.risk - 위험도 (variant 대신 사용)
 * @param {'sm' | 'md'} props.size - 배지 크기
 */
function Badge({
    children,
    variant = 'default',
    risk,
    size = 'md',
    className = '',
    ...props
}) {
    // 위험도가 지정된 경우 해당 스타일 사용
    const badgeClass = risk
        ? `badge badge-risk-${risk} badge-${size}`
        : `badge badge-${variant} badge-${size}`

    return (
        <span className={`${badgeClass} ${className}`} {...props}>
            {children}
        </span>
    )
}

// 상태 배지 프리셋
Badge.Status = function StatusBadge({ status, ...props }) {
    const statusConfig = {
        QUEUED: { label: '대기', variant: 'default' },
        PREPROCESSING: { label: '전처리', variant: 'info' },
        ANALYZING: { label: '분석중', variant: 'info' },
        GENERATING: { label: '생성중', variant: 'info' },
        COMPLETED: { label: '완료', variant: 'success' },
        FAILED: { label: '실패', variant: 'danger' },
    }

    const config = statusConfig[status] || statusConfig.QUEUED

    return (
        <Badge variant={config.variant} {...props}>
            {config.label}
        </Badge>
    )
}

// 위험도 배지 프리셋
Badge.Risk = function RiskBadge({ level, showLabel = true, ...props }) {
    const labels = {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
    }

    return (
        <Badge risk={level} {...props}>
            {showLabel ? labels[level] || level : null}
        </Badge>
    )
}

export default Badge
