import { useEffect, useRef, useState } from 'react'
import { Navigation } from 'lucide-react'
import Button from './Button'
import './HospitalMap.css'

/**
 * 네이버 지도를 이용한 응급실/병원 찾기 컴포넌트
 * props:
 * - location: { lat, lng } (기본값: 서울시청)
 * - hospitals: Array<{ name, lat, lng, phone, distance }>
 */
function HospitalMap({
    center = { lat: 37.5665, lng: 126.9780 }, // 기본: 서울시청
    hospitals = [],
    onLocationChange
}) {
    const mapElement = useRef(null)
    const mapRef = useRef(null)
    const centerMarkerRef = useRef(null)
    const hospitalMarkersRef = useRef([])
    const [isLoaded, setIsLoaded] = useState(false)

    // 지도 초기화
    useEffect(() => {
        if (!window.naver || !mapElement.current) return

        const { naver } = window

        // 지도 옵션
        const mapOptions = {
            center: new naver.maps.LatLng(center.lat, center.lng),
            zoom: 14,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT
            }
        }

        // 지도 생성
        const map = new naver.maps.Map(mapElement.current, mapOptions)
        mapRef.current = map
        setIsLoaded(true)

        // 마커 생성 (센터)
        centerMarkerRef.current = new naver.maps.Marker({
            position: new naver.maps.LatLng(center.lat, center.lng),
            map: map,
            icon: {
                content: '<div class="marker-my-location"></div>',
                anchor: new naver.maps.Point(12, 12)
            }
        })

    }, [])

    // 센터 변경 시 지도/마커 업데이트
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !window.naver) return
        const { naver } = window
        const nextCenter = new naver.maps.LatLng(center.lat, center.lng)
        mapRef.current.setCenter(nextCenter)
        if (centerMarkerRef.current) {
            centerMarkerRef.current.setPosition(nextCenter)
        }
    }, [center, isLoaded])

    // 병원 마커 표시 (hospitals 변경/로드 시)
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !window.naver) return

        const { naver } = window
        const map = mapRef.current

        // 기존 마커 정리
        hospitalMarkersRef.current.forEach(({ marker, infoWindow, listener }) => {
            if (infoWindow) infoWindow.close()
            if (marker) marker.setMap(null)
            if (listener) naver.maps.Event.removeListener(listener)
        })
        hospitalMarkersRef.current = []

        // 병원 마커들
        hospitals.forEach(hospital => {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(hospital.lat, hospital.lng),
                map: map,
                title: hospital.name,
                animation: naver.maps.Animation.DROP
            })

            // 인포윈도우
            const infoWindow = new naver.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h4>${hospital.name}</h4>
                        <p>${hospital.phone || '전화번호 없음'}</p>
                        <span class="distance">${hospital.distance || ''}</span>
                    </div>
                `,
                borderWidth: 0,
                backgroundColor: "transparent",
                anchorSize: new naver.maps.Size(0, 0),
                pixelOffset: new naver.maps.Point(0, -10)
            })

            const listener = naver.maps.Event.addListener(marker, "click", () => {
                if (infoWindow.getMap()) {
                    infoWindow.close()
                } else {
                    infoWindow.open(map, marker)
                }
            })

            hospitalMarkersRef.current.push({ marker, infoWindow, listener })
        })

    }, [isLoaded, hospitals])

    // 내 위치 찾기 (브라우저 API)
    const handleFindMe = () => {
        if (!navigator.geolocation) {
            alert('위치 정보를 사용할 수 없습니다.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const newCenter = { lat: latitude, lng: longitude }
                if (onLocationChange) {
                    onLocationChange(newCenter)
                }

                if (mapRef.current && window.naver) {
                    const center = new window.naver.maps.LatLng(latitude, longitude)
                    mapRef.current.setCenter(center)
                    mapRef.current.setZoom(15)

                    // 내 위치 마커 업데이트
                    if (centerMarkerRef.current) {
                        centerMarkerRef.current.setPosition(center)
                        centerMarkerRef.current.setIcon({
                            content: '<div class="marker-current"></div>',
                            anchor: new window.naver.maps.Point(15, 15)
                        })
                    }
                }
            },
            (error) => {
                console.error('위치 확인 실패:', error)
                alert('위치를 확인할 수 없습니다.')
            }
        )
    }

    return (
        <div className="hospital-map-container">
            <div ref={mapElement} className="naver-map" />
            <Button
                variant="secondary"
                size="sm"
                className="btn-find-me"
                onClick={handleFindMe}
            >
                <Navigation size={16} /> 내 주변 찾기
            </Button>
        </div>
    )
}

export default HospitalMap
