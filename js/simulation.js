// 실시간 시뮬레이션 기능 - 플랫폼을 생동감 있게 만들기

class RealEstateSimulation {
    constructor() {
        this.isRunning = false;
        this.intervals = [];
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        // 조회수 자동 증가 (3-8초마다)
        this.intervals.push(setInterval(() => {
            this.incrementRandomViews();
        }, Math.random() * 5000 + 3000));

        // 새 매물 추가 (30-60초마다)
        this.intervals.push(setInterval(() => {
            this.addNewProperty();
        }, Math.random() * 30000 + 30000));

        // "방금 거래 완료" 알림 (20-40초마다)
        this.intervals.push(setInterval(() => {
            this.showSoldNotification();
        }, Math.random() * 20000 + 20000));

        // 가격 변동 시뮬레이션 (40-80초마다)
        this.intervals.push(setInterval(() => {
            this.simulatePriceChange();
        }, Math.random() * 40000 + 40000));
    }

    stop() {
        this.isRunning = false;
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }

    // 랜덤 매물의 조회수 증가
    incrementRandomViews() {
        if (properties.length === 0) return;

        // 1-3개의 매물 조회수 증가
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * properties.length);
            const property = properties[randomIndex];

            // 조회수 1-5 증가
            const increment = Math.floor(Math.random() * 5) + 1;
            property.views += increment;

            // UI 업데이트 (카드가 화면에 있으면)
            const card = document.querySelector(`[data-property-id="${property.id}"]`);
            if (card) {
                const viewsElement = card.querySelector('.property-views');
                if (viewsElement) {
                    viewsElement.textContent = `조회 ${property.views.toLocaleString()}`;
                    // 애니메이션 효과
                    viewsElement.style.color = '#ff6b35';
                    setTimeout(() => {
                        viewsElement.style.color = '';
                    }, 1000);
                }
            }
        }
    }

    // 새로운 매물 추가
    addNewProperty() {
        const newId = Math.max(...properties.map(p => p.id)) + 1;

        const districts = ['강남구', '서초구', '성남시 분당구'];
        const types = ['원룸', '투룸', '오피스텔'];
        const saleTypes = ['월세', '전세'];

        const district = districts[Math.floor(Math.random() * districts.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const saleType = saleTypes[Math.floor(Math.random() * saleTypes.length)];

        const newProperty = {
            id: newId,
            title: `${district} 신규 ${type} 매물`,
            type: type,
            saleType: saleType,
            price: saleType === '월세' ? Math.floor(Math.random() * 3000) + 1000 : Math.floor(Math.random() * 40000) + 20000,
            monthlyRent: saleType === '월세' ? Math.floor(Math.random() * 40) + 50 : 0,
            address: `서울시 ${district} ${Math.floor(Math.random() * 999) + 1}-${Math.floor(Math.random() * 99) + 1}`,
            district: district,
            area: Math.floor(Math.random() * 30) + 25,
            rooms: type === '투룸' ? 2 : 1,
            bathrooms: 1,
            floor: Math.floor(Math.random() * 15) + 3,
            totalFloors: Math.floor(Math.random() * 10) + 15,
            buildYear: Math.floor(Math.random() * 5) + 2020,
            options: ["에어컨", "냉장고", "세탁기", "인덕션"],
            description: `신규 등록된 ${type} 매물입니다.`,
            lat: 37.3943 + (Math.random() - 0.5) * 0.05,
            lng: 127.1105 + (Math.random() - 0.5) * 0.05,
            image: `https://picsum.photos/seed/new${newId}/400/300`,
            agent: {
                name: "김부동산",
                phone: "010-1234-5678",
                company: "집다부동산"
            },
            premium: Math.random() > 0.7,
            views: Math.floor(Math.random() * 50) + 1,
            createdAt: new Date().toISOString().split('T')[0]
        };

        properties.unshift(newProperty);

        // 알림 표시
        this.showNotification(`🏠 새 매물이 등록되었습니다!<br>${newProperty.title}`, 'success');

        // UI 새로고침 (app.js에 함수가 있다면)
        if (typeof window.app !== 'undefined' && window.app.renderProperties) {
            window.app.renderProperties();
        }
    }

    // "방금 거래 완료" 알림
    showSoldNotification() {
        const districts = ['강남구', '서초구', '판교', '분당', '마포구', '용산구', '성수동', '송파구'];
        const types = ['원룸', '투룸', '오피스텔', '아파트'];

        const district = districts[Math.floor(Math.random() * districts.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const minutesAgo = Math.floor(Math.random() * 10) + 1;

        const message = `✅ ${district} ${type} ${minutesAgo}분 전 거래 완료!`;
        this.showNotification(message, 'sold');
    }

    // 가격 변동 시뮬레이션
    simulatePriceChange() {
        if (properties.length === 0) return;

        const randomIndex = Math.floor(Math.random() * properties.length);
        const property = properties[randomIndex];

        // 가격 변동 방향 (올림/내림)
        const direction = Math.random() > 0.5 ? 1 : -1;
        const changePercent = (Math.random() * 0.05 + 0.02) * direction; // 2-7% 변동

        const oldPrice = property.saleType === '월세' ? property.monthlyRent : property.price;

        if (property.saleType === '월세') {
            const change = Math.floor(property.monthlyRent * changePercent);
            property.monthlyRent = Math.max(30, property.monthlyRent + change);
        } else {
            const change = Math.floor(property.price * changePercent);
            property.price = Math.max(10000, property.price + change);
        }

        const newPrice = property.saleType === '월세' ? property.monthlyRent : property.price;
        const changeAmount = newPrice - oldPrice;
        const emoji = changeAmount > 0 ? '📈' : '📉';
        const text = changeAmount > 0 ? '인상' : '인하';

        // 알림 표시
        const message = `${emoji} ${property.title}<br>가격 ${text}: ${Math.abs(changeAmount).toLocaleString()}만원`;
        this.showNotification(message, changeAmount > 0 ? 'warning' : 'info');

        // UI 업데이트
        if (typeof window.app !== 'undefined' && window.app.renderProperties) {
            window.app.renderProperties();
        }
    }

    // 알림 표시 함수
    showNotification(message, type = 'info') {
        // 알림 컨테이너가 없으면 생성
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }

        // 알림 요소 생성
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const colors = {
            success: '#00b894',
            sold: '#0984e3',
            warning: '#fdcb6e',
            info: '#74b9ff'
        };

        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type] || colors.info};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: start; gap: 10px;">
                <div style="flex: 1; font-size: 14px; line-height: 1.5;">
                    ${message}
                </div>
                <button style="background: none; border: none; cursor: pointer; font-size: 18px; color: #666; padding: 0; line-height: 1;">
                    ×
                </button>
            </div>
        `;

        // 닫기 버튼 이벤트
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // 클릭시 닫기
        notification.addEventListener('click', (e) => {
            if (e.target !== closeBtn) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        });

        container.appendChild(notification);

        // 5초 후 자동 제거
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// 애니메이션 스타일 추가
if (!document.getElementById('simulation-styles')) {
    const style = document.createElement('style');
    style.id = 'simulation-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .notification:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
}

// 전역 시뮬레이션 인스턴스 생성
window.realEstateSimulation = new RealEstateSimulation();

// 페이지 로드 시 자동 시작
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.realEstateSimulation.start(), 2000);
    });
} else {
    setTimeout(() => window.realEstateSimulation.start(), 2000);
}
