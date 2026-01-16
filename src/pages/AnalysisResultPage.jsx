import { useParams, useNavigate } from 'react-router-dom'
import { Download, Copy, AlertTriangle, Share2, Printer, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import HospitalMap from '../components/HospitalMap'
import { useToast } from '../contexts/ToastContext'
import './AnalysisResultPage.css'

// Mock 분석 결과 (상세 데이터)
const MOCK_RESULT = {
    caseId: 'CASE-001',
    patientSummary: '남성 / 50대 / 흉통',
    riskLevel: 'high',
    riskScore: 78,
    summary: '응급 가능성 있음 (참고)',
    modelName: 'MedAI',
    modelVersion: 'v2.1.0',
    analyzedAt: '2026-01-16 11:15:32',
    processingTime: '45초',

    // 근거/관찰 포인트
    keyFactors: [
        {
            id: 1,
            title: '50대 남성의 흉통 증상',
            description: '심혈관 질환 고위험군에 해당하며, 흉통은 급성 관상동맥 증후군의 주요 증상입니다.',
            confidence: 92,
        },
        {
            id: 2,
            title: '증상 지속 시간 30분 이상',
            description: '30분 이상 지속되는 흉통은 심근경색의 가능성을 높입니다.',
            confidence: 88,
        },
        {
            id: 3,
            title: '호흡곤란 동반',
            description: '흉통과 함께 호흡곤란이 동반되는 경우 심부전 또는 폐색전증 가능성이 있습니다.',
            confidence: 85,
        },
        {
            id: 4,
            title: '고혈압/당뇨 과거력',
            description: '심혈관 질환의 주요 위험인자로 전체 위험도 평가에 반영되었습니다.',
            confidence: 95,
        },
    ],

    // 감별 진단
    differentialDiagnosis: [
        { name: '급성 관상동맥 증후군', probability: 65 },
        { name: '불안정 협심증', probability: 20 },
        { name: '폐색전증', probability: 8 },
        { name: '기타', probability: 7 },
    ],

    // 권고사항
    recommendations: [
        { priority: 'urgent', text: '즉시 심전도(ECG) 검사 시행' },
        { priority: 'urgent', text: '심근효소(Troponin) 검사 필요' },
        { priority: 'high', text: '흉부 X-ray 촬영 권장' },
        { priority: 'medium', text: '추가 병력 청취 및 신체검진' },
        { priority: 'low', text: '안정 후 심장 초음파 검사 고려' },
    ],

    // 면책 조항
    disclaimer: '본 AI 분석 결과는 의료진의 임상 판단을 보조하기 위한 참고 정보입니다. 최종 진단 및 치료 결정은 반드시 의료 전문가의 종합적인 평가를 통해 이루어져야 합니다. AI 분석 결과만으로 치료 방침을 결정하지 마십시오.',

    // 기술적 세부사항
    technicalDetails: {
        inputFeatures: 12,
        processingSteps: 5,
        confidence: 87,
    }
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 } // 서울시청

// Mock 전국 응급실 데이터 (데모용)
const HOSPITAL_CATALOG = [
    { name: '서울 응급의료센터(샘플)', lat: 37.5665, lng: 126.9780, phone: '02-0000-0000' },
    { name: '인천 응급의료센터(샘플)', lat: 37.4563, lng: 126.7052, phone: '032-000-0000' },
    { name: '대전 응급의료센터(샘플)', lat: 36.3504, lng: 127.3845, phone: '042-000-0000' },
    { name: '세종 응급의료센터(샘플)', lat: 36.4801, lng: 127.2890, phone: '044-000-0000' },
    { name: '대구 응급의료센터(샘플)', lat: 35.8722, lng: 128.6014, phone: '053-000-0000' },
    { name: '부산 응급의료센터(샘플)', lat: 35.1796, lng: 129.0756, phone: '051-000-0000' },
    { name: '울산 응급의료센터(샘플)', lat: 35.5384, lng: 129.3114, phone: '052-000-0000' },
    { name: '광주 응급의료센터(샘플)', lat: 35.1595, lng: 126.8526, phone: '062-000-0000' },
    { name: '전주 응급의료센터(샘플)', lat: 35.8242, lng: 127.1480, phone: '063-000-0000' },
    { name: '청주 응급의료센터(샘플)', lat: 36.6424, lng: 127.4890, phone: '043-000-0000' },
    { name: '강릉 응급의료센터(샘플)', lat: 37.7519, lng: 128.8761, phone: '033-000-0000' },
    { name: '제주 응급의료센터(샘플)', lat: 33.4996, lng: 126.5312, phone: '064-000-0000' },
]

const toRadians = (value) => (value * Math.PI) / 180

const getDistanceKm = (a, b) => {
    const earthRadiusKm = 6371
    const dLat = toRadians(b.lat - a.lat)
    const dLng = toRadians(b.lng - a.lng)
    const lat1 = toRadians(a.lat)
    const lat2 = toRadians(b.lat)

    const sinLat = Math.sin(dLat / 2)
    const sinLng = Math.sin(dLng / 2)

    const h =
        sinLat * sinLat +
        Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
    return earthRadiusKm * c
}

const getNearbyHospitals = (center, maxResults = 6) => (
    HOSPITAL_CATALOG
        .map((hospital) => {
            const distanceKm = getDistanceKm(center, hospital)
            return {
                ...hospital,
                distanceKm,
                distance: `${distanceKm.toFixed(1)}km`,
            }
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, maxResults)
)

/**
 * 분석 결과 화면 (고도화)
 * 상세서.md Section 7.6 기반
 */
function AnalysisResultPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showSuccess, showError } = useToast()
    const printRef = useRef(null)

    const [expandedFactor, setExpandedFactor] = useState(null)
    const [showShareModal, setShowShareModal] = useState(false)
    const [generatingPdf, setGeneratingPdf] = useState(false)
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
    const [nearbyHospitals, setNearbyHospitals] = useState(() => getNearbyHospitals(DEFAULT_CENTER))

    // localStorage에서 결과 로드, 없으면 Mock 데이터 사용
    const getResult = () => {
        try {
            const savedResult = localStorage.getItem(`case_${id}_result`)
            if (savedResult) {
                const parsed = JSON.parse(savedResult)
                // 필수 필드 추가
                return {
                    caseId: id,
                    ...parsed,
                    keyFactors: parsed.keyFactors?.map((f, i) => ({ ...f, id: i + 1 })) || MOCK_RESULT.keyFactors,
                    differentialDiagnosis: parsed.differentialDiagnosis || MOCK_RESULT.differentialDiagnosis,
                    recommendations: parsed.recommendations || MOCK_RESULT.recommendations,
                    technicalDetails: parsed.technicalDetails || MOCK_RESULT.technicalDetails,
                }
            }
        } catch (e) {
            console.error('결과 로드 실패:', e)
        }
        return { ...MOCK_RESULT, caseId: id }
    }

    const result = getResult()

    useEffect(() => {
        setNearbyHospitals(getNearbyHospitals(mapCenter))
    }, [mapCenter])

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        showSuccess('클립보드에 복사되었습니다.')
    }

    const handlePrint = () => {
        window.print()
    }

    const handleGeneratePdf = async () => {
        setGeneratingPdf(true)

        try {
            // PDF 생성 시뮬레이션 (실제로는 라이브러리 사용)
            await new Promise(resolve => setTimeout(resolve, 1500))

            // 다운로드 시뮬레이션
            const blob = new Blob(['PDF Content'], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `analysis_${result.caseId}_${new Date().toISOString().split('T')[0]}.pdf`
            a.click()
            URL.revokeObjectURL(url)

            showSuccess('PDF가 다운로드되었습니다.')
        } catch (err) {
            showError('PDF 생성에 실패했습니다.')
        } finally {
            setGeneratingPdf(false)
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'danger'
            case 'high': return 'warning'
            case 'medium': return 'info'
            default: return 'default'
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'urgent': return '긴급'
            case 'high': return '높음'
            case 'medium': return '중간'
            default: return '낮음'
        }
    }

    return (
        <div className="analysis-result" ref={printRef}>
            {/* 헤더 */}
            <header className="result-header">
                <div className="result-header-left">
                    <div className="result-risk-display">
                        <Badge.Risk level={result.riskLevel} />
                        <span className="result-score">{result.riskScore}/100</span>
                    </div>
                    <h1 className="result-title">{result.summary}</h1>
                    <p className="result-meta">
                        케이스: {result.caseId} · 분석 시각: {result.analyzedAt} ·
                        {result.modelName} {result.modelVersion}
                    </p>
                </div>
                <div className="result-header-actions no-print">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer size={16} />
                        인쇄
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                        <Share2 size={16} />
                        공유
                    </Button>
                    <Button variant="primary" onClick={handleGeneratePdf} loading={generatingPdf}>
                        <Download size={18} />
                        PDF 다운로드
                    </Button>
                </div>
            </header>

            {/* 응급 경고 배너 */}
            {result.riskLevel === 'high' && (
                <div className="emergency-section">
                    <div className="emergency-banner">
                        <AlertTriangle size={24} />
                        <div>
                            <strong>응급 경고</strong>
                            <p>고위험 결과입니다. 응급 상황이 의심되면 즉시 의료기관에 연락하거나 119에 전화하세요.</p>
                        </div>
                    </div>
                    {/* 네이버 지도 (응급실 위치) */}
                    <Card title="주변 응급실 찾기" className="map-card">
                        <HospitalMap
                            center={mapCenter}
                            hospitals={nearbyHospitals}
                            onLocationChange={setMapCenter}
                        />
                    </Card>
                </div>
            )}

            {/* 콘텐츠 그리드 */}
            <div className="result-grid">
                {/* 좌측: 주요 내용 */}
                <div className="result-main">
                    {/* 근거/관찰 포인트 */}
                    <Card
                        title="근거 / 관찰 포인트"
                        action={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(result.keyFactors.map(f => f.title).join('\n'))}
                                className="no-print"
                            >
                                <Copy size={16} />
                            </Button>
                        }
                    >
                        <ul className="factors-list">
                            {result.keyFactors.map((factor) => (
                                <li key={factor.id} className="factor-item">
                                    <button
                                        type="button"
                                        className="factor-header"
                                        onClick={() => setExpandedFactor(
                                            expandedFactor === factor.id ? null : factor.id
                                        )}
                                    >
                                        <div className="factor-title-row">
                                            <span className="factor-title">{factor.title}</span>
                                            <span className="factor-confidence">신뢰도 {factor.confidence}%</span>
                                        </div>
                                        {expandedFactor === factor.id ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>
                                    {expandedFactor === factor.id && (
                                        <p className="factor-description">{factor.description}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* 권고사항 */}
                    <Card
                        title="권고사항"
                        action={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(result.recommendations.map(r => r.text).join('\n'))}
                                className="no-print"
                            >
                                <Copy size={16} />
                            </Button>
                        }
                    >
                        <ul className="recommendations-list">
                            {result.recommendations.map((rec, index) => (
                                <li key={index} className="recommendation-item">
                                    <Badge variant={getPriorityColor(rec.priority)} size="sm">
                                        {getPriorityLabel(rec.priority)}
                                    </Badge>
                                    <span className="recommendation-text">{rec.text}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* 의료 책임 고지 (항상 표시) */}
                    <Card title="한계 및 주의사항">
                        <div className="disclaimer">
                            <AlertTriangle size={20} />
                            <p>{result.disclaimer}</p>
                        </div>
                    </Card>
                </div>

                {/* 우측: 감별 진단 + 기술 정보 */}
                <div className="result-sidebar">
                    {/* 감별 진단 */}
                    <Card title="감별 진단 (참고)">
                        <ul className="diagnosis-list">
                            {result.differentialDiagnosis.map((diag, index) => (
                                <li key={index} className="diagnosis-item">
                                    <span className="diagnosis-name">{diag.name}</span>
                                    <div className="diagnosis-bar-container">
                                        <div
                                            className="diagnosis-bar"
                                            style={{ width: `${diag.probability}%` }}
                                        />
                                        <span className="diagnosis-probability">{diag.probability}%</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* 기술 정보 */}
                    <Card title="분석 정보">
                        <div className="tech-info">
                            <div className="tech-item">
                                <span className="tech-label">모델</span>
                                <span className="tech-value">{result.modelName} {result.modelVersion}</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">처리 시간</span>
                                <span className="tech-value">{result.processingTime}</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">입력 특성</span>
                                <span className="tech-value">{result.technicalDetails.inputFeatures}개</span>
                            </div>
                            <div className="tech-item">
                                <span className="tech-label">전체 신뢰도</span>
                                <span className="tech-value">{result.technicalDetails.confidence}%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 하단 액션 */}
            <div className="result-actions no-print">
                <Button variant="outline" onClick={() => navigate('/')}>
                    목록으로
                </Button>
                <Button variant="outline" onClick={() => navigate(`/cases/${id}`)}>
                    케이스 상세
                </Button>
            </div>

            {/* 공유 모달 */}
            <Modal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title="결과 공유"
                size="sm"
            >
                <div className="share-options">
                    <p className="share-description">결과를 공유할 방법을 선택하세요.</p>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                            handleCopy(`${window.location.origin}/cases/${id}/result`)
                            setShowShareModal(false)
                        }}
                    >
                        링크 복사
                    </Button>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                            handleGeneratePdf()
                            setShowShareModal(false)
                        }}
                    >
                        PDF로 공유
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default AnalysisResultPage
