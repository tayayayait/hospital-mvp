import './Timeline.css'

/**
 * Timeline 컴포넌트
 * 상세서.md Section 7.7 기반
 * 케이스 단위의 히스토리/협업을 위한 타임라인
 */

const EVENT_TYPES = {
    CREATE: { icon: '📋', label: '케이스 생성', color: 'info' },
    UPDATE: { icon: '✏️', label: '정보 수정', color: 'default' },
    UPLOAD: { icon: '📎', label: '파일 업로드', color: 'default' },
    ANALYSIS_START: { icon: '🔄', label: '분석 시작', color: 'info' },
    ANALYSIS_COMPLETE: { icon: '✅', label: '분석 완료', color: 'success' },
    ANALYSIS_FAILED: { icon: '❌', label: '분석 실패', color: 'danger' },
    STATUS_CHANGE: { icon: '🔄', label: '상태 변경', color: 'warning' },
    MEMO: { icon: '💬', label: '메모', color: 'default' },
    SHARE: { icon: '🔗', label: '공유', color: 'info' },
    DOWNLOAD: { icon: '📥', label: '다운로드', color: 'default' },
}

function Timeline({ events = [] }) {
    if (events.length === 0) {
        return (
            <div className="timeline-empty">
                <span>기록이 없습니다</span>
            </div>
        )
    }

    return (
        <div className="timeline">
            {events.map((event, index) => {
                const config = EVENT_TYPES[event.type] || EVENT_TYPES.UPDATE
                const isLast = index === events.length - 1

                return (
                    <div key={event.id || index} className={`timeline-item ${isLast ? 'last' : ''}`}>
                        <div className="timeline-marker">
                            <span className={`timeline-icon timeline-icon-${config.color}`}>
                                {config.icon}
                            </span>
                            {!isLast && <div className="timeline-line" />}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <span className="timeline-label">{config.label}</span>
                                <span className="timeline-time">{event.timestamp}</span>
                            </div>
                            {event.title && (
                                <p className="timeline-title">{event.title}</p>
                            )}
                            {event.description && (
                                <p className="timeline-description">{event.description}</p>
                            )}
                            {event.user && (
                                <span className="timeline-user">by {event.user}</span>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Timeline
