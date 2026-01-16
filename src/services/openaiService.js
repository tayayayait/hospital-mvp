/**
 * OpenAI API 서비스
 * ChatGPT를 활용한 의료 AI 분석
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// JSON 모드 지원 모델 목록
const JSON_MODE_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-3.5-turbo-0125', 'gpt-3.5-turbo-1106']

// 환경변수에서 설정 로드
const getConfig = () => ({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o', // JSON 모드 지원 모델
    maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 2000,
})

/**
 * 의료 분석용 시스템 프롬프트
 */
const MEDICAL_SYSTEM_PROMPT = `You are an AI medical assistant that helps healthcare professionals analyze patient symptoms and provide clinical decision support.

IMPORTANT DISCLAIMERS:
- Your analysis is for REFERENCE ONLY and should not replace professional medical judgment
- All final diagnoses and treatment decisions must be made by qualified healthcare professionals
- Always recommend appropriate emergency care for life-threatening conditions

When analyzing patient data, you should:
1. Assess the risk level (Low/Medium/High) with a score from 0-100
2. Identify key factors contributing to the assessment
3. Provide differential diagnoses with estimated probabilities
4. Give prioritized recommendations (urgent/high/medium/low)

Respond in Korean language.
Output format: JSON with the following structure:
{
  "riskLevel": "low|medium|high",
  "riskScore": 0-100,
  "summary": "한줄 요약",
  "keyFactors": [
    { "title": "제목", "description": "설명", "confidence": 0-100 }
  ],
  "differentialDiagnosis": [
    { "name": "진단명", "probability": 0-100 }
  ],
  "recommendations": [
    { "priority": "urgent|high|medium|low", "text": "권고사항" }
  ]
}`

/**
 * 환자 정보를 분석용 프롬프트로 변환
 */
function buildAnalysisPrompt(patientData) {
    const { gender, ageGroup, chiefComplaint, questionnaire, files } = patientData

    let prompt = `Please analyze the following patient information:\n\n`

    prompt += `## Basic Information\n`
    prompt += `- Gender: ${gender === 'male' ? '남성' : gender === 'female' ? '여성' : gender}\n`
    prompt += `- Age Group: ${ageGroup}\n`
    prompt += `- Chief Complaint: ${chiefComplaint}\n\n`

    if (questionnaire) {
        prompt += `## Clinical Information\n`
        if (questionnaire.symptomDuration) {
            prompt += `- Symptom Duration: ${questionnaire.symptomDuration}\n`
        }
        if (questionnaire.painLevel !== undefined) {
            prompt += `- Pain Level: ${questionnaire.painLevel}/10\n`
        }
        if (questionnaire.medicalHistory) {
            prompt += `- Medical History: ${questionnaire.medicalHistory}\n`
        }
        if (questionnaire.currentMedications) {
            prompt += `- Current Medications: ${questionnaire.currentMedications}\n`
        }
        if (questionnaire.allergies) {
            prompt += `- Allergies: ${questionnaire.allergies}\n`
        }
        prompt += '\n'
    }

    if (files && files.length > 0) {
        prompt += `## Attached Files\n`
        prompt += `- ${files.length} file(s) attached (types: ${files.map(f => f.type).join(', ')})\n\n`
    }

    prompt += `Please provide a comprehensive risk assessment and clinical recommendations based on this information.`

    return prompt
}

/**
 * OpenAI API 호출
 */
async function callOpenAI(messages, options = {}) {
    const config = getConfig()

    if (!config.apiKey || config.apiKey.includes('YOUR_API_KEY')) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인하세요.')
    }

    const modelToUse = options.model || config.model
    const supportsJsonMode = JSON_MODE_MODELS.some(m => modelToUse.includes(m))

    const requestBody = {
        model: modelToUse,
        messages,
        max_tokens: options.maxTokens || config.maxTokens,
        temperature: options.temperature ?? 0.3, // 의료용은 낮은 temperature
    }

    // JSON 모드 지원 모델인 경우에만 response_format 추가
    if (supportsJsonMode && !options.skipJsonMode) {
        requestBody.response_format = { type: 'json_object' }
    }

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
            errorData.error?.message || `OpenAI API 오류: ${response.status}`
        )
    }

    const data = await response.json()
    return data.choices[0].message.content
}

/**
 * 환자 데이터를 기반으로 AI 분석 수행
 */
export async function analyzePatientData(patientData) {
    const userPrompt = buildAnalysisPrompt(patientData)

    // 이미지 파일 필터링
    const imageFiles = patientData.files ? patientData.files.filter(f => f.base64 && f.type.startsWith('image/')) : []

    let userContent
    if (imageFiles.length > 0) {
        // 멀티모달 메시지 구성 (텍스트 + 이미지)
        userContent = [
            { type: 'text', text: userPrompt },
            ...imageFiles.map(file => ({
                type: 'image_url',
                image_url: {
                    url: file.base64,
                    detail: 'high' // 의료 이미지는 고화질 분석 필요
                }
            }))
        ]
    } else {
        // 텍스트 전용
        userContent = userPrompt
    }

    const messages = [
        { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
    ]

    try {
        const responseText = await callOpenAI(messages)
        const result = JSON.parse(responseText)

        // 응답 유효성 검증
        if (!result.riskLevel || !result.riskScore) {
            throw new Error('잘못된 응답 형식')
        }

        // 추가 메타데이터
        return {
            ...result,
            modelName: 'ChatGPT',
            modelVersion: getConfig().model,
            analyzedAt: new Date().toLocaleString('ko-KR'),
            disclaimer: '본 AI 분석 결과는 의료진의 임상 판단을 보조하기 위한 참고 정보입니다. 최종 진단 및 치료 결정은 반드시 의료 전문가의 종합적인 평가를 통해 이루어져야 합니다.',
        }
    } catch (error) {
        console.error('AI 분석 오류:', error)
        throw error
    }
}

/**
 * 분석 결과에 대한 추가 질문
 */
export async function askFollowUp(analysisResult, question) {
    const context = `Previous analysis result:\n${JSON.stringify(analysisResult, null, 2)}`

    const messages = [
        { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
        { role: 'user', content: context },
        { role: 'assistant', content: JSON.stringify(analysisResult) },
        { role: 'user', content: question },
    ]

    const response = await callOpenAI(messages, { temperature: 0.5 })
    return response
}

/**
 * API 연결 테스트
 */
export async function testConnection() {
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "API 연결 성공!" in Korean. Response in plain text.' },
    ]

    try {
        // 연결 테스트는 JSON 모드 사용하지 않음
        const response = await callOpenAI(messages, { maxTokens: 50, skipJsonMode: true })
        return { success: true, message: response }
    } catch (error) {
        return { success: false, message: error.message }
    }
}

export default {
    analyzePatientData,
    askFollowUp,
    testConnection,
}
