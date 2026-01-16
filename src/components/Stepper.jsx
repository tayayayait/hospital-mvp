import { Check } from 'lucide-react'
import './Stepper.css'

/**
 * Stepper 컴포넌트
 * 상세서.md Section 5.11 기반
 * 케이스 생성 4-Step 플로우
 */
function Stepper({ steps = [], currentStep = 0, onStepClick }) {
    return (
        <div className="stepper">
            {/* Desktop/Tablet: 전체 표시 */}
            <div className="stepper-desktop">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep
                    const isClickable = onStepClick && index < currentStep

                    return (
                        <div key={index} className="stepper-item">
                            <button
                                type="button"
                                className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                onClick={() => isClickable && onStepClick(index)}
                                disabled={!isClickable}
                            >
                                <span className="stepper-number">
                                    {isCompleted ? <Check size={16} /> : index + 1}
                                </span>
                                <span className="stepper-label">{step}</span>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`stepper-connector ${isCompleted ? 'completed' : ''}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile: 진행바 + 현재 단계만 */}
            <div className="stepper-mobile">
                <div className="stepper-progress">
                    <div
                        className="stepper-progress-bar"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="stepper-mobile-info">
                    <span className="stepper-mobile-step">{currentStep + 1}/{steps.length}</span>
                    <span className="stepper-mobile-label">{steps[currentStep]}</span>
                </div>
            </div>
        </div>
    )
}

export default Stepper
