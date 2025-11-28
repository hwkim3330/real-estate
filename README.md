# 집다 부동산 플랫폼

> 한국형 부동산 중개 플랫폼 - 현대적이고 직관적인 UI/UX

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 프로젝트 개요

서울 주요 지역(강남, 서초, 마포, 용산, 성동, 송파 등)의 부동산 매물을 검색하고 비교할 수 있는 웹 플랫폼입니다.
직방과 유사한 깔끔한 디자인과 사용자 친화적인 인터페이스로 최적의 매물 검색 경험을 제공합니다.

## 주요 기능

### 매물 검색 및 필터링
- **다양한 검색 옵션**: 지역, 매물 유형, 거래 유형, 가격대, 방 개수
- **실시간 검색**: 키워드 입력 시 즉시 필터링되는 반응형 검색
- **스마트 필터**: 월세/전세/매매에 따른 동적 가격 범위 필터

### 프리미엄 매물 시스템
- **⭐ 프리미엄 배지**: 상위 노출 매물 표시
- **차별화된 UI**: 금색 테두리 및 배지로 시각적 강조
- **우선 정렬**: 검색 결과에서 프리미엄 매물 우선 표시

### 지도 연동 (Kakao Maps API)
- **인터랙티브 지도**: 매물 위치를 지도에서 직접 확인
- **커스텀 마커**: 프리미엄 여부에 따른 차별화된 마커
- **정보 창**: 마커 클릭 시 매물 요약 정보 표시
- **자동 범위 조정**: 검색된 매물들을 모두 볼 수 있도록 지도 자동 조정

### 찜하기 기능
- **로컬 스토리지**: 브라우저에 찜 목록 저장
- **찜 필터**: 찜한 매물만 모아보기
- **실시간 동기화**: 찜 상태가 모든 뷰에서 동기화

### 매물 상세 정보
- **풀 스크린 모달**: 매물 상세 정보를 깔끔한 모달로 표시
- **상세 옵션**: 에어컨, 냉장고, 세탁기 등 모든 옵션 표시
- **중개사 정보**: 담당 중개사 연락처 및 정보
- **원클릭 액션**: 전화하기, 방문 예약 버튼

### 정렬 옵션
- 최신순
- 낮은 가격순
- 높은 가격순
- 넓은 평수순
- 인기순 (조회수)

### 반응형 디자인
- **모바일 최적화**: 스마트폰, 태블릿에서 완벽한 UX
- **터치 친화적**: 모바일 터치 제스처 지원
- **적응형 레이아웃**: 화면 크기에 따라 자동 조정

## 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, Animations
- **Vanilla JavaScript**: ES6+ 문법, 모듈화 설계

### API & Libraries
- **Kakao Maps API**: 지도 표시 및 마커 관리
- **Leaflet** (대체): Kakao Maps 미사용 시 OpenStreetMap 활용
- **LocalStorage**: 찜 목록 영구 저장

### Design
- **직방 스타일 UI**: 현대적이고 깔끔한 카드 기반 레이아웃
- **커스텀 CSS 변수**: 일관된 컬러 팔레트 및 스타일링
- **애니메이션**: 부드러운 전환 효과 및 호버 인터랙션

## 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd real-estate
```

### 2. Kakao Maps API 키 설정

1. [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 생성
2. JavaScript 키 발급
3. `index.html` 파일에서 API 키 교체:

```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY"></script>
```

### 3. 웹 서버로 실행

**방법 1: Python 내장 서버**
```bash
python -m http.server 8000
# 또는
python3 -m http.server 8000
```

**방법 2: Node.js http-server**
```bash
npm install -g http-server
http-server -p 8000
```

**방법 3: VS Code Live Server**
- VS Code에서 `index.html` 우클릭
- "Open with Live Server" 선택

### 4. 브라우저에서 열기

```
http://localhost:8000
```

## 프로젝트 구조

```
real-estate/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css         # 전체 스타일시트 (직방 스타일)
├── js/
│   ├── app.js             # 메인 애플리케이션 로직
│   ├── data.js            # 매물 데이터 (50+ properties)
│   └── map.js             # 지도 컨트롤러 (Kakao/Leaflet)
└── README.md              # 프로젝트 문서
```

## 매물 데이터

### 서울 주요 지역 50+ 매물
- **강남구**: 신논현, 강남역, 압구정, 역삼, 대치, 청담, 삼성, 개포, 도곡
- **서초구**: 교대, 방배, 양재, 내곡, 반포, 서초
- **마포구**: 홍대입구, 합정, 망원, 공덕, 신촌, 연남, 상암
- **용산구**: 이촌, 용산, 한남
- **성동구**: 성수, 왕십리, 뚝섬, 금호
- **송파구**: 잠실, 문정, 가락시장, 방이, 석촌
- **기타**: 여의도, 건대, 목동, 광화문, 서울대, 성북, 노원, 신도림, 천호, 답십리, 혜화

### 매물 유형
- 원룸 / 투룸
- 아파트
- 오피스텔
- 빌라
- 단독주택

### 거래 유형
- 월세
- 전세
- 매매

### 가격 범위
- **월세**: 50만원 ~ 90만원+
- **전세**: 2.8억 ~ 9.5억
- **매매**: 11.2억 ~ 42억

## 수익 모델

### 1. 프리미엄 매물 등록
- 월 19,900원 ~ 99,000원
- 상위 노출 및 프리미엄 배지
- 검색 결과 우선 표시
- 금색 테두리 강조 표시

### 2. 광고 배너
- 홈페이지 상단/하단 배너
- 검색 결과 중간 삽입 광고
- CPM (노출당 과금) 또는 CPC (클릭당 과금) 모델

### 3. 중개사 멤버십
- 월 구독 모델
- 무제한 매물 등록
- 분석 대시보드 제공
- API 연동 지원

### 4. 제휴 수수료
- 부동산 대출 중개
- 이사 업체 연결
- 인테리어 업체 매칭

## 향후 개발 계획

### Phase 2
- [ ] 회원 가입 / 로그인 시스템
- [ ] 매물 등록 기능 (중개사용)
- [ ] 실시간 채팅 상담
- [ ] 푸시 알림 (신규 매물, 가격 변동)

### Phase 3
- [ ] AI 추천 시스템
- [ ] 가격 예측 분석
- [ ] VR 투어 연동
- [ ] 모바일 앱 (React Native)

### Phase 4
- [ ] 블록체인 기반 계약 시스템
- [ ] 대출 계산기 및 시뮬레이터
- [ ] 커뮤니티 게시판
- [ ] 부동산 뉴스 / 정보 섹션

## 스크린샷

### 홈페이지
![Homepage Screenshot](https://via.placeholder.com/800x500?text=Homepage+Screenshot)

*검색 바와 히어로 섹션*

### 매물 목록
![Property List](https://via.placeholder.com/800x500?text=Property+List)

*카드 기반 매물 목록 뷰*

### 매물 상세
![Property Detail](https://via.placeholder.com/800x500?text=Property+Detail+Modal)

*상세 정보 모달 뷰*

### 지도 뷰
![Map View](https://via.placeholder.com/800x500?text=Map+View)

*인터랙티브 지도에서 매물 확인*

### 모바일 반응형
![Mobile View](https://via.placeholder.com/400x800?text=Mobile+Responsive+View)

*모바일 최적화 뷰*

## 브라우저 지원

- ✅ Chrome (최신 2개 버전)
- ✅ Firefox (최신 2개 버전)
- ✅ Safari (최신 2개 버전)
- ✅ Edge (최신 2개 버전)
- ⚠️ IE11 (부분 지원)

## 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 기여

프로젝트에 기여하고 싶으시다면:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.

## 참고 자료

- [Kakao Maps API 문서](https://apis.map.kakao.com/web/)
- [직방 웹사이트](https://www.zigbang.com/)
- [다방 웹사이트](https://www.dabangapp.com/)
- [네이버 부동산](https://land.naver.com/)

---

**Made with ❤️ for better real estate experience**

© 2025 Real Estate Platform. All rights reserved.
