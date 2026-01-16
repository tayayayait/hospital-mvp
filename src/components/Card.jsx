import './Card.css'

/**
 * Card 컴포넌트
 * 상세서.md Section 5.6 기반
 */
function Card({
    children,
    title,
    action,
    clickable = false,
    className = '',
    ...props
}) {
    const Component = clickable ? 'button' : 'div'

    return (
        <Component
            className={`card ${clickable ? 'card-clickable' : ''} ${className}`}
            {...props}
        >
            {(title || action) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {action && <div className="card-action">{action}</div>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
        </Component>
    )
}

export default Card
