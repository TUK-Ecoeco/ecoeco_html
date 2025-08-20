// 초기화
document.addEventListener('DOMContentLoaded', function () {
    // 데스크톱/태블릿 차트 생성
    charts.co2 = initChart('co2Chart', data.co2[1].values, '#059669', '이산화탄소 배출량');
    charts.carbon = initChart('carbonChart', data.carbon[1].values, '#059669', '탄소발자국');
    charts.energy = initChart('energyChart', data.energy[1].values, '#059669', '에너지 소비량');
    charts.water = initChart('waterChart', data.water[1].values, '#059669', '물 사용량');

    // 모바일 차트 생성
    mobileCharts.co2 = initChart('co2ChartMobile', data.co2[1].values, '#059669', '이산화탄소 배출량');
    mobileCharts.carbon = initChart('carbonChartMobile', data.carbon[1].values, '#059669', '탄소발자국');
    mobileCharts.energy = initChart('energyChartMobile', data.energy[1].values, '#059669', '에너지 소비량');
    mobileCharts.water = initChart('waterChartMobile', data.water[1].values, '#059669', '물 사용량');

    // 스와이프 기능 초기화
    initSwipe();

    // 탭 이벤트 리스너 - 터치와 클릭 모두 처리
    document.querySelectorAll('.tab').forEach(tab => {
        // 클릭 이벤트
        tab.addEventListener('click', function (e) {
            e.stopPropagation();
            handleTabClick(this);
        });

        // 터치 이벤트 (모바일용)
        let tabTouchStart = false;
        tab.addEventListener('touchstart', function (e) {
            tabTouchStart = true;
            e.stopPropagation();
        });

        tab.addEventListener('touchend', function (e) {
            if (tabTouchStart) {
                e.preventDefault();
                e.stopPropagation();
                handleTabClick(this);
                tabTouchStart = false;
            }
        });

        tab.addEventListener('touchmove', function (e) {
            tabTouchStart = false; // 드래그 중이면 클릭 취소
        });
    });

    function handleTabClick(tab) {
        const cardType = tab.dataset.card;
        const scale = tab.dataset.scale;

        // 같은 카드 내의 다른 탭들 비활성화
        tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 모바일과 데스크톱 차트 모두 업데이트
        updateChart(cardType, scale, false); // 데스크톱
        updateChart(cardType, scale, true);  // 모바일
    }

    // 화면 크기 변경 감지
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            // 차트 리사이즈
            Object.values(charts).forEach(chart => {
                if (chart && chart.resize) chart.resize();
            });
            Object.values(mobileCharts).forEach(chart => {
                if (chart && chart.resize) chart.resize();
            });

            // 모바일에서 스와이프 위치 재조정
            if (window.innerWidth <= 768) {
                goToSlide(currentSlide);
            }
        }, 300);
    });
});
