// 지도 컨트롤러 (Kakao Maps / OpenStreetMap 대체)
class MapController {
    constructor() {
        this.map = null;
        this.markers = [];
        this.isKakaoAvailable = false;
        this.currentInfoWindow = null;
    }

    initMap() {
        // Kakao Maps API 확인
        if (typeof kakao !== 'undefined' && kakao.maps) {
            this.initKakaoMap();
            this.isKakaoAvailable = true;
        } else {
            this.initOpenStreetMap();
            this.isKakaoAvailable = false;
        }
    }

    initKakaoMap() {
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
            center: new kakao.maps.LatLng(37.3943, 127.1105), // 판교 중심
            level: 6
        };

        this.map = new kakao.maps.Map(container, options);

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl();
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    }

    initOpenStreetMap() {
        const container = document.getElementById('map');
        if (!container) return;

        // Leaflet이 로드되지 않은 경우 대체 UI 표시
        if (typeof L === 'undefined') {
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
                    <h3 style="color: #666; margin-bottom: 1rem;">지도를 표시할 수 없습니다</h3>
                    <p style="color: #999; margin-bottom: 1.5rem;">
                        Kakao Maps API 키가 설정되지 않았습니다.<br>
                        index.html 파일에서 YOUR_KAKAO_API_KEY를 실제 API 키로 교체해주세요.
                    </p>
                    <a href="https://developers.kakao.com/" target="_blank"
                       style="background: #FEE500; color: #000; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        Kakao Developers에서 API 키 발급받기
                    </a>
                    <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; max-width: 500px;">
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">
                            <strong>참고:</strong> 현재는 목록 보기로 모든 매물을 확인하실 수 있습니다.
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        this.map = L.map('map').setView([37.3943, 127.1105], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    displayProperties(properties) {
        if (!this.map) return;

        // 기존 마커 제거
        this.clearMarkers();

        if (this.isKakaoAvailable) {
            this.displayKakaoMarkers(properties);
        } else if (typeof L !== 'undefined') {
            this.displayLeafletMarkers(properties);
        }
    }

    displayKakaoMarkers(properties) {
        const bounds = new kakao.maps.LatLngBounds();

        properties.forEach(property => {
            const position = new kakao.maps.LatLng(property.lat, property.lng);

            // 마커 이미지 설정 (프리미엄 여부에 따라)
            const imageSrc = property.premium
                ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
                : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

            const imageSize = new kakao.maps.Size(24, 35);
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            const marker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
                title: property.title
            });

            marker.setMap(this.map);
            this.markers.push(marker);

            // 인포윈도우 컨텐츠
            const priceDisplay = property.saleType === '월세'
                ? `${property.price}/${property.monthlyRent}만원`
                : `${property.price.toLocaleString()}만원`;

            const content = `
                <div style="padding: 15px; min-width: 250px;">
                    ${property.premium ? '<div style="color: #fdcb6e; font-weight: 700; margin-bottom: 5px;">⭐ 프리미엄</div>' : ''}
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 5px;">${property.title}</div>
                    <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${property.address}</div>
                    <div style="color: #ff6b35; font-weight: 700; font-size: 16px; margin-bottom: 8px;">${priceDisplay}</div>
                    <div style="color: #666; font-size: 12px;">
                        ${property.area}㎡ | ${property.rooms}개 방 | ${property.floor}층
                    </div>
                    <button onclick="app.showPropertyModal(${property.id})"
                            style="margin-top: 10px; background: #ff6b35; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: 600;">
                        상세보기
                    </button>
                </div>
            `;

            const infowindow = new kakao.maps.InfoWindow({
                content: content
            });

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', () => {
                if (this.currentInfoWindow) {
                    this.currentInfoWindow.close();
                }
                infowindow.open(this.map, marker);
                this.currentInfoWindow = infowindow;
            });

            bounds.extend(position);
        });

        // 모든 마커가 보이도록 지도 범위 설정
        if (properties.length > 0) {
            this.map.setBounds(bounds);
        }
    }

    displayLeafletMarkers(properties) {
        const bounds = [];

        properties.forEach(property => {
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="
                        background: ${property.premium ? '#fdcb6e' : '#ff6b35'};
                        color: white;
                        padding: 8px 12px;
                        border-radius: 20px;
                        font-weight: 700;
                        font-size: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                        white-space: nowrap;
                    ">
                        ${property.saleType === '월세' ? `${property.monthlyRent}만` : `${(property.price / 10000).toFixed(0)}억`}
                    </div>
                `,
                iconSize: [60, 30],
                iconAnchor: [30, 30]
            });

            const marker = L.marker([property.lat, property.lng], { icon: icon });

            const priceDisplay = property.saleType === '월세'
                ? `${property.price}/${property.monthlyRent}만원`
                : `${property.price.toLocaleString()}만원`;

            const popupContent = `
                <div style="min-width: 250px;">
                    ${property.premium ? '<div style="color: #fdcb6e; font-weight: 700; margin-bottom: 5px;">⭐ 프리미엄</div>' : ''}
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 5px;">${property.title}</div>
                    <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${property.address}</div>
                    <div style="color: #ff6b35; font-weight: 700; font-size: 16px; margin-bottom: 8px;">${priceDisplay}</div>
                    <div style="color: #666; font-size: 12px;">
                        ${property.area}㎡ | ${property.rooms}개 방 | ${property.floor}층
                    </div>
                    <button onclick="app.showPropertyModal(${property.id})"
                            style="margin-top: 10px; background: #ff6b35; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: 600;">
                        상세보기
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.addTo(this.map);
            this.markers.push(marker);

            bounds.push([property.lat, property.lng]);
        });

        // 모든 마커가 보이도록 지도 범위 설정
        if (bounds.length > 0) {
            this.map.fitBounds(bounds);
        }
    }

    clearMarkers() {
        if (this.isKakaoAvailable) {
            this.markers.forEach(marker => marker.setMap(null));
        } else {
            this.markers.forEach(marker => this.map.removeLayer(marker));
        }
        this.markers = [];

        if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
            this.currentInfoWindow = null;
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                if (this.isKakaoAvailable) {
                    const locPosition = new kakao.maps.LatLng(lat, lng);
                    this.map.setCenter(locPosition);
                } else if (typeof L !== 'undefined') {
                    this.map.setView([lat, lng], 13);
                }
            },
            (error) => {
                console.error('위치 정보를 가져올 수 없습니다:', error);
                alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
            }
        );
    }
}

// 전역 맵 컨트롤러 인스턴스
window.mapController = new MapController();
