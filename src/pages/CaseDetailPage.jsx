import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Edit, Trash2, MoreVertical, Download } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Timeline from '../components/Timeline'
import Modal from '../components/Modal'
import { useToast } from '../contexts/ToastContext'
import './CaseDetailPage.css'

// Mock 케이스 데이터
const MOCK_CASE = {
    id: 'CASE-001',
    patientSummary: '남성 / 50대 / 흉통',
    gender: '남성',
    ageGroup: '50-59',
    chiefComplaint: '흉통',
    status: 'COMPLETED',
    riskLevel: 'high',
    riskScore: 78,
    createdAt: '2026-01-16 09:30',
    updatedAt: '2026-01-16 10:15',
    assignedTo: '김의사',
    additionalInfo: {
        visitReason: '흉통 및 호흡곤란',
        symptomDuration: '약 2시간',
        medicalHistory: '고혈압, 당뇨',
        currentMedications: '메트포르민 500mg',
        allergies: '페니실린'
    }
}

// Mock 타임라인 이벤트
const MOCK_EVENTS = [
    {
        id: 1,
        type: 'CREATE',
        timestamp: '2026-01-16 09:30',
        title: '케이스 생성',
        user: '김의사'
    },
    {
        id: 2,
        type: 'UPLOAD',
        timestamp: '2026-01-16 09:32',
        title: '심전도_결과.pdf',
        description: '파일 1개 업로드',
        user: '김의사'
    },
    {
        id: 3,
        type: 'ANALYSIS_START',
        timestamp: '2026-01-16 09:35',
        title: 'AI 분석 요청',
        description: 'MedAI v2.1 모델 사용'
    },
    {
        id: 4,
        type: 'ANALYSIS_COMPLETE',
        timestamp: '2026-01-16 10:15',
        title: '분석 완료',
        description: '위험도: High (78/100)'
    },
    {
        id: 5,
        type: 'MEMO',
        timestamp: '2026-01-16 10:30',
        title: '추가 검사 필요',
        description: '심장 초음파 검사 예약 필요',
        user: '김의사'
    }
]

/**
 * 케이스 상세 페이지
 * 상세서.md Section 7.7 기반
 */
function CaseDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showSuccess, showError } = useToast()

    const [caseData] = useState(MOCK_CASE)
    const [events] = useState(MOCK_EVENTS)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [memoText, setMemoText] = useState('')

    const handleDelete = () => {
        // 삭제 시뮬레이션
        showSuccess('케이스가 삭제되었습니다.')
        setShowDeleteModal(false)
        navigate('/')
    }

    const handleAddMemo = () => {
        if (!memoText.trim()) return
        showSuccess('메모가 추가되었습니다.')
        setMemoText('')
    }

    const handleReanalyze = () => {
        navigate(`/cases/${id}/processing`)
    }

    return (
        <div className="case-detail">
            {/* Page Header */}
            <header className="case-detail-header">
                <div className="case-detail-header-left">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="case-detail-title">케이스 {id}</h1>
                        <p className="case-detail-subtitle">{caseData.patientSummary}</p>
                    </div>
                </div>
                <div className="case-detail-header-right">
                    <Badge.Status status={caseData.status} />
                    <Badge.Risk level={caseData.riskLevel} />
                    <Button variant="outline" size="sm">
                        <Download size={16} />
                        PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReanalyze}>
                        <Play size={16} />
                        재분석
                    </Button>
                </div>
            </header>

            <div className="case-detail-content">
                {/* 좌측: 케이스 정보 */}
                <div className="case-detail-main">
                    {/* 기본 정보 */}
                    <Card title="기본 정보">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">성별</span>
                                <span className="info-value">{caseData.gender}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">연령대</span>
                                <span className="info-value">{caseData.ageGroup}세</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">주호소</span>
                                <span className="info-value">{caseData.chiefComplaint}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">담당자</span>
                                <span className="info-value">{caseData.assignedTo}</span>
                            </div>
                        </div>
                    </Card>

                    {/* 추가 정보 */}
                    <Card title="상세 정보">
                        <div className="info-list">
                            <div className="info-row">
                                <span className="info-label">내원 경로</span>
                                <span className="info-value">{caseData.additionalInfo.visitReason}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">증상 지속시간</span>
                                <span className="info-value">{caseData.additionalInfo.symptomDuration}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">과거력</span>
                                <span className="info-value">{caseData.additionalInfo.medicalHistory}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">복용약</span>
                                <span className="info-value">{caseData.additionalInfo.currentMedications}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">알레르기</span>
                                <span className="info-value">{caseData.additionalInfo.allergies}</span>
                            </div>
                        </div>
                    </Card>

                    {/* 분석 결과 링크 */}
                    {caseData.status === 'COMPLETED' && (
                        <Card title="분석 결과">
                            <div className="result-summary">
                                <div className="result-risk">
                                    <Badge.Risk level={caseData.riskLevel} />
                                    <span className="result-score">{caseData.riskScore}/100</span>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/cases/${id}/result`)}
                                >
                                    결과 상세 보기
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* 메모 추가 */}
                    <Card title="메모 추가">
                        <div className="memo-form">
                            <textarea
                                className="memo-input"
                                placeholder="메모를 입력하세요..."
                                value={memoText}
                                onChange={(e) => setMemoText(e.target.value)}
                                rows={3}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddMemo}
                                disabled={!memoText.trim()}
                            >
                                메모 추가
                            </Button>
                        </div>
                    </Card>

                    {/* 위험 액션 */}
                    <div className="danger-zone">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Trash2 size={16} />
                            케이스 삭제
                        </Button>
                    </div>
                </div>

                {/* 우측: 타임라인 */}
                <div className="case-detail-sidebar">
                    <Card title="활동 기록">
                        <Timeline events={events} />
                    </Card>
                </div>
            </div>

            {/* 삭제 확인 모달 */}
            <Modal.Confirm
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="케이스 삭제"
                message="이 케이스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                confirmText="삭제"
                confirmVariant="danger"
            />
        </div>
    )
}

export default CaseDetailPage
