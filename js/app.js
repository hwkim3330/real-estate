// 부동산 플랫폼 메인 애플리케이션
class RealEstateApp {
    constructor() {
        this.properties = properties;
        this.filteredProperties = [...properties];
        this.favorites = this.loadFavorites();
        this.currentView = 'list';
        this.filters = {
            search: '',
            district: '전체',
            saleType: '전체',
            propertyType: '전체',
            priceRange: '전체',
            rooms: '전체',
            onlyPremium: false,
            onlyFavorites: false
        };
        this.sortBy = 'recent';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProperties();
        this.updateResultCount();
    }

    setupEventListeners() {
        // 검색
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // 필터
        const districtFilter = document.getElementById('districtFilter');
        const saleTypeFilter = document.getElementById('saleTypeFilter');
        const propertyTypeFilter = document.getElementById('propertyTypeFilter');
        const priceRangeFilter = document.getElementById('priceRangeFilter');
        const roomsFilter = document.getElementById('roomsFilter');

        if (districtFilter) {
            districtFilter.addEventListener('change', (e) => {
                this.filters.district = e.target.value;
                this.applyFilters();
            });
        }

        if (saleTypeFilter) {
            saleTypeFilter.addEventListener('change', (e) => {
                this.filters.saleType = e.target.value;
                this.updatePriceRangeOptions(e.target.value);
                this.applyFilters();
            });
        }

        if (propertyTypeFilter) {
            propertyTypeFilter.addEventListener('change', (e) => {
                this.filters.propertyType = e.target.value;
                this.applyFilters();
            });
        }

        if (priceRangeFilter) {
            priceRangeFilter.addEventListener('change', (e) => {
                this.filters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        if (roomsFilter) {
            roomsFilter.addEventListener('change', (e) => {
                this.filters.rooms = e.target.value;
                this.applyFilters();
            });
        }

        // 필터 칩
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                if (chip.dataset.filter === 'premium') {
                    this.filters.onlyPremium = !this.filters.onlyPremium;
                    chip.classList.toggle('active');
                } else if (chip.dataset.filter === 'favorites') {
                    this.filters.onlyFavorites = !this.filters.onlyFavorites;
                    chip.classList.toggle('active');
                }
                this.applyFilters();
            });
        });

        // 정렬
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortProperties();
                this.renderProperties();
            });
        }

        // 뷰 전환
        const listViewBtn = document.getElementById('listViewBtn');
        const mapViewBtn = document.getElementById('mapViewBtn');

        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => {
                this.switchView('list');
                listViewBtn.classList.add('active');
                mapViewBtn.classList.remove('active');
            });
        }

        if (mapViewBtn) {
            mapViewBtn.addEventListener('click', () => {
                this.switchView('map');
                mapViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');

                // 지도 초기화
                if (window.mapController) {
                    window.mapController.initMap();
                    window.mapController.displayProperties(this.filteredProperties);
                }
            });
        }

        // 모달 닫기
        const modal = document.getElementById('propertyModal');
        const modalClose = document.getElementById('modalClose');

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
    }

    updatePriceRangeOptions(saleType) {
        const priceRangeFilter = document.getElementById('priceRangeFilter');
        if (!priceRangeFilter) return;

        const ranges = PRICE_RANGES[saleType] || PRICE_RANGES['월세'];
        priceRangeFilter.innerHTML = ranges.map(range =>
            `<option value="${range}">${range}</option>`
        ).join('');
    }

    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // 검색어 필터
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const matchesSearch =
                    property.title.toLowerCase().includes(searchLower) ||
                    property.address.toLowerCase().includes(searchLower) ||
                    property.district.toLowerCase().includes(searchLower);

                if (!matchesSearch) return false;
            }

            // 지역 필터
            if (this.filters.district !== '전체' && property.district !== this.filters.district) {
                return false;
            }

            // 거래 유형 필터
            if (this.filters.saleType !== '전체' && property.saleType !== this.filters.saleType) {
                return false;
            }

            // 매물 유형 필터
            if (this.filters.propertyType !== '전체' && property.type !== this.filters.propertyType) {
                return false;
            }

            // 가격 범위 필터
            if (this.filters.priceRange !== '전체') {
                if (!this.matchesPriceRange(property)) {
                    return false;
                }
            }

            // 방 개수 필터
            if (this.filters.rooms !== '전체') {
                const roomCount = parseInt(this.filters.rooms);
                if (property.rooms !== roomCount) {
                    return false;
                }
            }

            // 프리미엄 필터
            if (this.filters.onlyPremium && !property.premium) {
                return false;
            }

            // 찜 목록 필터
            if (this.filters.onlyFavorites && !this.favorites.includes(property.id)) {
                return false;
            }

            return true;
        });

        this.sortProperties();
        this.renderProperties();
        this.updateResultCount();
    }

    matchesPriceRange(property) {
        const range = this.filters.priceRange;

        if (property.saleType === '월세') {
            const rent = property.monthlyRent;
            if (range === '50만원 이하') return rent <= 50;
            if (range === '50-70만원') return rent > 50 && rent <= 70;
            if (range === '70-90만원') return rent > 70 && rent <= 90;
            if (range === '90만원 이상') return rent > 90;
        } else {
            const price = property.price;
            if (range === '3억 이하') return price <= 30000;
            if (range === '3-5억') return price > 30000 && price <= 50000;
            if (range === '5-7억') return price > 50000 && price <= 70000;
            if (range === '7억 이상') return price > 70000;
            if (range === '10억 이하') return price <= 100000;
            if (range === '10-15억') return price > 100000 && price <= 150000;
            if (range === '15-20억') return price > 150000 && price <= 200000;
            if (range === '20억 이상') return price > 200000;
        }

        return true;
    }

    sortProperties() {
        switch(this.sortBy) {
            case 'recent':
                this.filteredProperties.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            case 'price-low':
                this.filteredProperties.sort((a, b) => {
                    const priceA = a.saleType === '월세' ? a.monthlyRent : a.price;
                    const priceB = b.saleType === '월세' ? b.monthlyRent : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                this.filteredProperties.sort((a, b) => {
                    const priceA = a.saleType === '월세' ? a.monthlyRent : a.price;
                    const priceB = b.saleType === '월세' ? b.monthlyRent : b.price;
                    return priceB - priceA;
                });
                break;
            case 'area':
                this.filteredProperties.sort((a, b) => b.area - a.area);
                break;
            case 'views':
                this.filteredProperties.sort((a, b) => b.views - a.views);
                break;
        }
    }

    renderProperties() {
        const grid = document.getElementById('propertyGrid');
        if (!grid) return;

        if (this.filteredProperties.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 조건으로 검색해보세요</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredProperties.map(property =>
            this.createPropertyCard(property)
        ).join('');

        // 카드 클릭 이벤트
        grid.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) {
                    const propertyId = parseInt(card.dataset.id);
                    this.showPropertyModal(propertyId);
                }
            });
        });

        // 찜 버튼 이벤트
        grid.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.id);
                this.toggleFavorite(propertyId);
            });
        });
    }

    createPropertyCard(property) {
        const isFavorite = this.favorites.includes(property.id);
        const priceDisplay = property.saleType === '월세'
            ? `${property.price}/${property.monthlyRent}`
            : property.price.toLocaleString();
        const priceUnit = property.saleType === '월세' ? '만원' : '만원';

        return `
            <div class="property-card ${property.premium ? 'premium' : ''}" data-id="${property.id}">
                <img src="${property.image}" alt="${property.title}" class="property-image">

                ${property.premium ? `
                    <div class="premium-badge">
                        ⭐ 프리미엄
                    </div>
                ` : ''}

                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-id="${property.id}">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>

                <div class="property-info">
                    <span class="property-type">${property.type}</span>
                    <h3 class="property-title">${property.title}</h3>
                    <p class="property-location">📍 ${property.address}</p>
                    <div class="property-price">
                        ${priceDisplay} <small>${priceUnit}</small>
                    </div>
                    <div class="property-features">
                        <span class="feature">📐 ${property.area}㎡</span>
                        <span class="feature">🛏️ ${property.rooms}개</span>
                        <span class="feature">🏢 ${property.floor}층</span>
                    </div>
                </div>
            </div>
        `;
    }

    showPropertyModal(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;

        const modal = document.getElementById('propertyModal');
        const modalBody = document.getElementById('modalBody');

        const isFavorite = this.favorites.includes(property.id);
        const priceDisplay = property.saleType === '월세'
            ? `${property.price}/${property.monthlyRent}만원`
            : `${property.price.toLocaleString()}만원`;

        modalBody.innerHTML = `
            <img src="${property.image}" alt="${property.title}" class="modal-image">

            <div class="modal-header">
                ${property.premium ? `<div class="premium-badge">⭐ 프리미엄 매물</div>` : ''}
                <h2>${property.title}</h2>
                <p class="modal-location">📍 ${property.address}</p>
                <div class="modal-price">${priceDisplay}</div>
            </div>

            <div class="modal-details">
                <div class="detail-item">
                    <h4>전용면적</h4>
                    <p>${property.area}㎡</p>
                </div>
                <div class="detail-item">
                    <h4>방/욕실</h4>
                    <p>${property.rooms}개 / ${property.bathrooms}개</p>
                </div>
                <div class="detail-item">
                    <h4>층수</h4>
                    <p>${property.floor}층 / ${property.totalFloors}층</p>
                </div>
                <div class="detail-item">
                    <h4>건축년도</h4>
                    <p>${property.buildYear}년</p>
                </div>
                <div class="detail-item">
                    <h4>거래유형</h4>
                    <p>${property.saleType}</p>
                </div>
                <div class="detail-item">
                    <h4>매물유형</h4>
                    <p>${property.type}</p>
                </div>
            </div>

            <div class="modal-section">
                <h3>매물 설명</h3>
                <p>${property.description}</p>
            </div>

            <div class="modal-section">
                <h3>옵션</h3>
                <div class="options-list">
                    ${property.options.map(option => `
                        <div class="option-item">
                            <span>✓</span>
                            <span>${option}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="modal-section">
                <h3>담당 중개사</h3>
                <div class="agent-info">
                    <div class="agent-avatar">${property.agent.name.charAt(0)}</div>
                    <div class="agent-details">
                        <h4>${property.agent.name}</h4>
                        <p>${property.agent.company}</p>
                        <p>📞 ${property.agent.phone}</p>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn-contact" onclick="alert('전화 연결 기능은 데모 버전에서 지원되지 않습니다.')">
                    📞 전화하기
                </button>
                <button class="btn-tour" onclick="alert('방문 예약 기능은 데모 버전에서 지원되지 않습니다.')">
                    🏠 방문 예약
                </button>
                <button class="btn-tour ${isFavorite ? 'favorited' : ''}" onclick="app.toggleFavorite(${property.id}); app.showPropertyModal(${property.id});">
                    ${isFavorite ? '❤️ 찜 해제' : '🤍 찜하기'}
                </button>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('propertyModal');
        modal.classList.remove('active');
    }

    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);

        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(propertyId);
        }

        this.saveFavorites();
        this.renderProperties();
    }

    loadFavorites() {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    switchView(view) {
        this.currentView = view;

        const propertyGrid = document.getElementById('propertyGrid');
        const mapContainer = document.getElementById('map-container');

        if (view === 'list') {
            propertyGrid.style.display = 'grid';
            mapContainer.classList.remove('active');
        } else {
            propertyGrid.style.display = 'none';
            mapContainer.classList.add('active');
        }
    }

    updateResultCount() {
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `총 ${this.filteredProperties.length}개의 매물`;
        }
    }
}

// 앱 초기화
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new RealEstateApp();
});
