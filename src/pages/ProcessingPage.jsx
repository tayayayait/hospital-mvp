import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import { useToast } from '../contexts/ToastContext'
import { analyzePatientData } from '../services/openaiService'
import './ProcessingPage.css'

// 분석 단계 정의
const ANALYSIS_STEPS = [
    { id: 'validate', label: '데이터 검증', duration: 500 },
    { id: 'preprocess', label: '전처리', duration: 800 },
    { id: 'analyze', label: 'AI 분석 중', duration: null }, // 실제 API 호출
    { id: 'generate', label: '결과 생성', duration: 500 },
    { id: 'complete', label: '완료', duration: 300 },
]

/**
 * AI 분석 진행 화면
 * 상세서.md Section 7.5 기반
 * 실제 ChatGPT API 연동
 */
function ProcessingPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showError } = useToast()

    const [currentStep, setCurrentStep] = useState(0)
    const [stepStatus, setStepStatus] = useState({}) // 'pending' | 'running' | 'done' | 'error'
    const [error, setError] = useState(null)
    const [analysisResult, setAnalysisResult] = useState(null)

    // 로컬 스토리지에서 케이스 데이터 로드 (CaseCreatePage에서 저장)
    const getCaseData = () => {
        try {
            const data = localStorage.getItem(`case_${id}_data`)
            if (data) {
                return JSON.parse(data)
            }
            // 테스트용 기본 데이터
            return {
                gender: 'male',
                ageGroup: '50-59',
                chiefComplaint: '흉통',
                questionnaire: {
                    symptomDuration: '1-6h',
                    painLevel: 7,
                    medicalHistory: '고혈압, 당뇨',
                    currentMedications: '메트포르민 500mg',
                    allergies: '페니실린',
                },
                files: [],
            }
        } catch {
            return null
        }
    }

    // 분석 프로세스 실행
    useEffect(() => {
        let mounted = true

        const runAnalysis = async () => {
            const caseData = getCaseData()

            if (!caseData) {
                setError('케이스 데이터를 찾을 수 없습니다.')
                return
            }

            for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
                if (!mounted) return

                const step = ANALYSIS_STEPS[i]
                setCurrentStep(i)
                setStepStatus(prev => ({ ...prev, [step.id]: 'running' }))

                try {
                    if (step.id === 'analyze') {
                        // 실제 AI 분석 수행
                        const result = await analyzePatientData(caseData)
                        setAnalysisResult(result)

                        // 결과를 로컬 스토리지에 저장
                        localStorage.setItem(`case_${id}_result`, JSON.stringify(result))
                    } else if (step.duration) {
                        // 시뮬레이션 단계
                        await new Promise(resolve => setTimeout(resolve, step.duration))
                    }

                    if (mounted) {
                        setStepStatus(prev => ({ ...prev, [step.id]: 'done' }))
                    }
                } catch (err) {
                    if (mounted) {
                        setStepStatus(prev => ({ ...prev, [step.id]: 'error' }))
                        setError(err.message || 'AI 분석 중 오류가 발생했습니다.')
                        showError(err.message || 'AI 분석 실패')
                        return
                    }
                }
            }

            // 완료 후 결과 페이지로 이동
            if (mounted) {
                setTimeout(() => {
                    navigate(`/cases/${id}/result`)
                }, 800)
            }
        }

        runAnalysis()

        return () => {
            mounted = false
        }
    }, [id])

    const getStepIcon = (stepId) => {
        const status = stepStatus[stepId]
        switch (status) {
            case 'done':
                return <CheckCircle size={20} className="step-icon done" />
            case 'running':
                return <Loader2 size={20} className="step-icon running" />
            case 'error':
                return <XCircle size={20} className="step-icon error" />
            default:
                return <div className="step-icon pending" />
        }
    }

    return (
        <div className="processing-page">
            <Card className="processing-card">
                {/* Header */}
                <div className="processing-header">
                    <Loader2 size={48} className="processing-spinner" />
                    <h1 className="processing-title">AI 분석 진행중</h1>
                    <p className="processing-subtitle">
                        케이스 {id}의 데이터를 분석하고 있습니다
                    </p>
                </div>

                {/* Steps */}
                <div className="processing-steps">
                    {ANALYSIS_STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`processing-step ${stepStatus[step.id] || 'pending'}`}
                        >
                            {getStepIcon(step.id)}
                            <span className="step-label">{step.label}</span>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="processing-error">
                        <AlertTriangle size={20} />
                        <div>
                            <strong>분석 오류</strong>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Progress Info */}
                <div className="processing-info">
                    <p>분석이 완료되면 자동으로 결과 화면으로 이동합니다.</p>
                    <p className="processing-note">
                        ⏱️ 예상 소요 시간: 10-30초
                    </p>
                </div>

                {/* Actions */}
                {error && (
                    <div className="processing-actions">
                        <Button variant="outline" onClick={() => navigate('/')}>
                            목록으로
                        </Button>
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            다시 시도
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ProcessingPage
