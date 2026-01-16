/**
 * 식품의약품안전처 의약품 허가정보 API 서비스
 * 공공데이터포털: https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService07
 */

const DRUG_API_BASE_URL = 'https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService07'

// 환경변수에서 API 키 로드
const getApiKey = () => import.meta.env.VITE_DRUG_API_KEY

/**
 * 의약품 제품 허가 목록 조회 (자동완성용)
 * @param {string} itemName - 검색할 약품명
 * @param {number} numOfRows - 결과 개수 (기본값: 10)
 * @returns {Promise<Array>} 의약품 목록
 */
export async function searchDrugs(itemName, numOfRows = 10) {
    const apiKey = getApiKey()

    if (!apiKey) {
        console.warn('의약품 API 키가 설정되지 않았습니다.')
        return []
    }

    try {
        const params = new URLSearchParams({
            serviceKey: apiKey,
            pageNo: '1',
            numOfRows: String(numOfRows),
            type: 'json',
            item_name: itemName
        })

        const response = await fetch(`${DRUG_API_BASE_URL}/getDrugPrdtPrmsnInq07?${params}`)

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`)
        }

        const data = await response.json()

        // API 응답 구조에서 items 추출
        const items = data?.body?.items || []

        // 필요한 정보만 추출하여 반환
        return items.map(item => ({
            itemName: item.ITEM_NAME || '',        // 품목명
            entpName: item.ENTP_NAME || '',        // 업체명
            itemIngrName: item.ITEM_INGR_NAME || '', // 주성분
            ediCode: item.EDI_CODE || '',          // 보험코드
            prdlstStdrCode: item.PRDLST_STDR_CODE || '' // 품목일련번호
        }))
    } catch (error) {
        console.error('의약품 검색 오류:', error)
        return []
    }
}

/**
 * 의약품 상세정보 조회
 * @param {string} itemSeq - 품목기준코드
 * @returns {Promise<Object|null>} 의약품 상세정보
 */
export async function getDrugDetail(itemSeq) {
    const apiKey = getApiKey()

    if (!apiKey) {
        console.warn('의약품 API 키가 설정되지 않았습니다.')
        return null
    }

    try {
        const params = new URLSearchParams({
            serviceKey: apiKey,
            pageNo: '1',
            numOfRows: '1',
            type: 'json',
            item_seq: itemSeq
        })

        const response = await fetch(`${DRUG_API_BASE_URL}/getDrugPrdtPrmsnDtlInq06?${params}`)

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`)
        }

        const data = await response.json()
        const item = data?.body?.items?.[0]

        if (!item) return null

        return {
            itemName: item.ITEM_NAME,
            entpName: item.ENTP_NAME,
            mainItemIngr: item.MAIN_ITEM_INGR,
            storageMethod: item.STORAGE_METHOD,
            validTerm: item.VALID_TERM,
            chart: item.CHART, // 성상
            barCode: item.BAR_CODE,
            atcCode: item.ATC_CODE,
            rareDrugYn: item.RARE_DRUG_YN === 'Y'
        }
    } catch (error) {
        console.error('의약품 상세 조회 오류:', error)
        return null
    }
}

export default {
    searchDrugs,
    getDrugDetail
}
