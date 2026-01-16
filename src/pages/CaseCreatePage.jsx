import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Select from '../components/Select'
import Stepper from '../components/Stepper'
import FileUpload from '../components/FileUpload'
import DrugAutoComplete from '../components/DrugAutoComplete'
import { searchDrugs } from '../services/drugApiService'
import { useToast } from '../contexts/ToastContext'
import './CaseCreatePage.css'

const STEPS = ['기본정보', '문진', '자료첨부', '확인/AI 요청']

const GENDER_OPTIONS = [
    { value: 'male', label: '남' },
    { value: 'female', label: '여' },
    { value: 'other', label: '기타' },
    { value: 'unknown', label: '미상' },
]

const AGE_OPTIONS = [
    { value: '0-9', label: '0-9세' },
    { value: '10-19', label: '10-19세' },
    { value: '20-29', label: '20-29세' },
    { value: '30-39', label: '30-39세' },
    { value: '40-49', label: '40-49세' },
    { value: '50-59', label: '50-59세' },
    { value: '60-69', label: '60-69세' },
    { value: '70-79', label: '70-79세' },
    { value: '80+', label: '80세 이상' },
]

// 문진 질문 목록 (MVP용 간소화)
const QUESTIONNAIRE = [
    {
        id: 'symptomDuration',
        type: 'select',
        question: '증상 지속 시간',
        options: [
            { value: 'under-1h', label: '1시간 미만' },
            { value: '1-6h', label: '1-6시간' },
            { value: '6-24h', label: '6-24시간' },
            { value: '1-7d', label: '1-7일' },
            { value: 'over-7d', label: '7일 이상' },
        ]
    },
    {
        id: 'painLevel',
        type: 'scale',
        question: '통증 강도 (0-10)',
        min: 0,
        max: 10,
    },
    {
        id: 'medicalHistory',
        type: 'text',
        question: '과거 병력',
        placeholder: '고혈압, 당뇨, 심장질환 등',
    },
    {
        id: 'currentMedications',
        type: 'text',
        question: '현재 복용 약물',
        placeholder: '약물명 및 용량',
    },
    {
        id: 'allergies',
        type: 'text',
        question: '알레르기',
        placeholder: '약물/음식 알레르기',
    },
]

/**
 * 케이스 생성 페이지 (4-Step)
 * 상세서.md Section 7.4 기반
 */
function CaseCreatePage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    // Step 1: 기본 정보
    const [basicInfo, setBasicInfo] = useState({
        gender: '',
        ageGroup: '',
        chiefComplaint: '',
    })

    // Step 2: 문진
    const [questionnaire, setQuestionnaire] = useState({
        symptomDuration: '',
        painLevel: 5,
        medicalHistory: '',
        currentMedications: '',
        allergies: '',
    })

    // 의약품 자동완성 입력을 위한 로컬 상태
    const [medInputValue, setMedInputValue] = useState('')

    // Step 3: 파일 첨부
    const [files, setFiles] = useState([])

    const navigate = useNavigate()
    const { showSuccess, showError } = useToast()

    // Step 유효성 검사
    const isStep1Valid = basicInfo.gender && basicInfo.ageGroup && basicInfo.chiefComplaint
    const isStep2Valid = questionnaire.symptomDuration
    const isStep3Valid = true // 파일 첨부는 선택

    const canProceed = () => {
        switch (currentStep) {
            case 0: return isStep1Valid
            case 1: return isStep2Valid
            case 2: return isStep3Valid
            case 3: return true
            default: return false
        }
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)

        try {
            // 케이스 ID 생성
            const caseId = `CASE-${Date.now().toString(36).toUpperCase()}`

            // 파일 변환 (Base64)
            const filePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = () => resolve({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        base64: reader.result // Base64 데이터 추가
                    })
                    reader.onerror = error => reject(error)
                })
            })

            const processedFiles = await Promise.all(filePromises)

            // 케이스 데이터 조합
            const caseData = {
                gender: basicInfo.gender,
                ageGroup: basicInfo.ageGroup,
                chiefComplaint: basicInfo.chiefComplaint,
                questionnaire: questionnaire,
                files: processedFiles,
                createdAt: new Date().toISOString(),
            }

            // 분석을 위해 로컬 스토리지에 저장
            localStorage.setItem(`case_${caseId}_data`, JSON.stringify(caseData))

            showSuccess('케이스가 생성되었습니다. AI 분석을 시작합니다.')
            navigate(`/cases/${caseId}/processing`)
        } catch (err) {
            showError('케이스 생성에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const updateQuestionnaire = (field, value) => {
        setQuestionnaire(prev => ({ ...prev, [field]: value }))
    }

    // 약물 추가 핸들러
    const addMedication = (medName) => {
        const currentMeds = questionnaire.currentMedications
            ? questionnaire.currentMedications.split(',').map(s => s.trim()).filter(Boolean)
            : []

        if (!currentMeds.includes(medName)) {
            const newMeds = [...currentMeds, medName]
            updateQuestionnaire('currentMedications', newMeds.join(', '))
        }
        setMedInputValue('') // 입력 필드 초기화
    }

    // 약물 삭제 핸들러
    const removeMedication = (medName) => {
        const currentMeds = questionnaire.currentMedications
            ? questionnaire.currentMedications.split(',').map(s => s.trim()).filter(Boolean)
            : []

        const newMeds = currentMeds.filter(m => m !== medName)
        updateQuestionnaire('currentMedications', newMeds.join(', '))
    }

    return (
        <div className="case-create">
            {/* Header */}
            <header className="case-create-header">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                </Button>
                <h1 className="case-create-title">새 케이스</h1>
            </header>

            {/* Stepper */}
            <Stepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
            />

            {/* Step Content */}
            <Card className="case-create-content">
                {/* Step 1: 기본 정보 */}
                {currentStep === 0 && (
                    <div className="step-content">
                        <h2 className="step-title">기본 정보</h2>
                        <p className="step-description">환자의 기본 정보를 입력해주세요.</p>

                        <div className="form-grid">
                            <Select
                                label="성별"
                                required
                                options={GENDER_OPTIONS}
                                value={basicInfo.gender}
                                onChange={(val) => setBasicInfo({ ...basicInfo, gender: val })}
                                placeholder="선택하세요"
                            />
                            <Select
                                label="연령대"
                                required
                                options={AGE_OPTIONS}
                                value={basicInfo.ageGroup}
                                onChange={(val) => setBasicInfo({ ...basicInfo, ageGroup: val })}
                                placeholder="선택하세요"
                            />
                        </div>

                        <Input
                            label="주호소"
                            required
                            placeholder="예: 흉통, 두통, 복통"
                            value={basicInfo.chiefComplaint}
                            onChange={(e) => setBasicInfo({ ...basicInfo, chiefComplaint: e.target.value })}
                            helper="환자가 호소하는 주요 증상을 입력하세요."
                        />
                    </div>
                )}

                {/* Step 2: 문진 */}
                {currentStep === 1 && (
                    <div className="step-content">
                        <h2 className="step-title">문진</h2>
                        <p className="step-description">상세 증상 및 병력을 입력해주세요.</p>

                        <div className="questionnaire">
                            {QUESTIONNAIRE.map(q => (
                                <div key={q.id} className="questionnaire-item">
                                    {q.type === 'select' && (
                                        <Select
                                            label={q.question}
                                            required={q.id === 'symptomDuration'}
                                            options={q.options}
                                            value={questionnaire[q.id]}
                                            onChange={(val) => updateQuestionnaire(q.id, val)}
                                            placeholder="선택하세요"
                                        />
                                    )}

                                    {q.type === 'scale' && (
                                        <div className="scale-input">
                                            <label className="scale-label">
                                                {q.question} <span className="scale-value">{questionnaire[q.id]}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min={q.min}
                                                max={q.max}
                                                value={questionnaire[q.id]}
                                                onChange={(e) => updateQuestionnaire(q.id, parseInt(e.target.value))}
                                                className="scale-slider"
                                            />
                                            <div className="scale-labels">
                                                <span>없음 (0)</span>
                                                <span>심함 (10)</span>
                                            </div>
                                        </div>
                                    )}

                                    {q.type === 'text' && q.id !== 'currentMedications' && (
                                        <Input
                                            label={q.question}
                                            placeholder={q.placeholder}
                                            value={questionnaire[q.id]}
                                            onChange={(e) => updateQuestionnaire(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.id === 'currentMedications' && (
                                        <div className="medication-input-group">
                                            {/* 선택된 약물 칩 목록 */}
                                            {questionnaire.currentMedications && (
                                                <div className="med-chips">
                                                    {questionnaire.currentMedications.split(',').map(s => s.trim()).filter(Boolean).map((med, idx) => (
                                                        <span key={idx} className="med-chip">
                                                            {med}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMedication(med)}
                                                                aria-label="삭제"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <DrugAutoComplete
                                                label={q.question}
                                                placeholder="약품명을 입력하면 자동완성됩니다"
                                                value={medInputValue}
                                                onChange={setMedInputValue}
                                                onSelect={(drug) => {
                                                    addMedication(`${drug.itemName} (${drug.entpName})`)
                                                }}
                                                searchFn={searchDrugs}
                                                helper="약품을 선택하면 목록에 추가됩니다. (여러 개 추가 가능)"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: 자료 첨부 */}
                {currentStep === 2 && (
                    <div className="step-content">
                        <h2 className="step-title">자료 첨부</h2>
                        <p className="step-description">검사 결과, 영상 등 관련 자료를 첨부해주세요. (선택)</p>

                        <FileUpload
                            files={files}
                            onChange={setFiles}
                            accept=".png,.jpg,.jpeg,.pdf"
                            maxSize={10 * 1024 * 1024}
                            maxFiles={5}
                        />
                    </div>
                )}

                {/* Step 4: 확인/AI 요청 */}
                {currentStep === 3 && (
                    <div className="step-content">
                        <h2 className="step-title">확인 및 AI 분석 요청</h2>
                        <p className="step-description">입력한 정보를 확인하고 AI 분석을 요청하세요.</p>

                        {/* 의료 고지 */}
                        <div className="medical-notice">
                            <AlertTriangle size={20} />
                            <p>
                                <strong>주의:</strong> AI 분석 결과는 의료진 판단을 보조하는
                                <strong> 참고정보</strong>입니다. 최종 진단 및 치료 결정은
                                의료 전문가의 판단에 따라야 합니다.
                            </p>
                        </div>

                        {/* 요약 정보 */}
                        <div className="review-section">
                            <h3 className="review-title">기본 정보</h3>
                            <div className="review-grid">
                                <div className="review-item">
                                    <span className="review-label">성별</span>
                                    <span className="review-value">
                                        {GENDER_OPTIONS.find(o => o.value === basicInfo.gender)?.label || '-'}
                                    </span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">연령대</span>
                                    <span className="review-value">
                                        {AGE_OPTIONS.find(o => o.value === basicInfo.ageGroup)?.label || '-'}
                                    </span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">주호소</span>
                                    <span className="review-value">{basicInfo.chiefComplaint || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="review-section">
                            <h3 className="review-title">문진</h3>
                            <div className="review-grid">
                                <div className="review-item">
                                    <span className="review-label">증상 지속시간</span>
                                    <span className="review-value">
                                        {QUESTIONNAIRE[0].options.find(o => o.value === questionnaire.symptomDuration)?.label || '-'}
                                    </span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">통증 강도</span>
                                    <span className="review-value">{questionnaire.painLevel}/10</span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">과거 병력</span>
                                    <span className="review-value">{questionnaire.medicalHistory || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="review-section">
                            <h3 className="review-title">첨부 파일</h3>
                            <p className="review-value">
                                {files.length > 0 ? `${files.length}개 파일` : '없음'}
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Navigation Buttons */}
            <div className="case-create-actions">
                <Button
                    variant="outline"
                    onClick={currentStep === 0 ? () => navigate('/') : handlePrev}
                >
                    {currentStep === 0 ? '취소' : '이전'}
                </Button>

                {currentStep < STEPS.length - 1 ? (
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                    >
                        다음
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={submitting}
                    >
                        AI 분석 요청
                    </Button>
                )}
            </div>
        </div>
    )
}

export default CaseCreatePage
