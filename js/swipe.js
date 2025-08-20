// 스와이프 기능 변수
let currentSlide = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
const totalSlides = 4;
let startTime = 0;

// 스와이프 기능 초기화
function initSwipe() {
    const swipeWrapper = document.getElementById('swipeWrapper');
    if (!swipeWrapper) return;

    // 터치 이벤트
    swipeWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    swipeWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    swipeWrapper.addEventListener('touchend', handleTouchEnd);

    // 마우스 이벤트 (데스크톱 테스트용)
    swipeWrapper.addEventListener('mousedown', handleMouseDown);
    swipeWrapper.addEventListener('mousemove', handleMouseMove);
    swipeWrapper.addEventListener('mouseup', handleMouseUp);
    swipeWrapper.addEventListener('mouseleave', handleMouseUp);

    // 페이지네이션 클릭
    document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // 초기 위치 설정
    goToSlide(0);
}

// 슬라이드 이동 함수
function goToSlide(slideIndex) {
    currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
    const swipeWrapper = document.getElementById('swipeWrapper');
    const translateX = -currentSlide * 100;

    swipeWrapper.style.transform = `translateX(${translateX}%)`;

    // 페이지네이션 업데이트
    document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// 터치 이벤트 핸들러들
function handleTouchStart(e) {
    // 탭이나 페이지네이션 클릭인지 확인
    if (e.target.closest('.tab') || e.target.closest('.pagination-dot')) {
        return; // 탭 클릭은 스와이프로 처리하지 않음
    }

    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    startTime = Date.now();

    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transition = 'none';
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!isDragging) return;

    // 탭이나 페이지네이션 영역이면 스와이프 무시
    if (e.target.closest('.tab') || e.target.closest('.pagination-dot')) {
        return;
    }

    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    const swipeWrapper = document.getElementById('swipeWrapper');
    const translateX = -currentSlide * 100 + (diffX / window.innerWidth) * 100;

    swipeWrapper.style.transform = `translateX(${translateX}%)`;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!isDragging) return;

    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    const diffX = currentX - startX;
    const timeDiff = Date.now() - startTime;
    const velocity = Math.abs(diffX) / timeDiff;

    // 빠른 스와이프 또는 충분한 거리
    if (velocity > 0.5 || Math.abs(diffX) > window.innerWidth * 0.25) {
        if (diffX > 0 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (diffX < 0 && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide);
        }
    } else {
        goToSlide(currentSlide);
    }

    isDragging = false;
}

// 마우스 이벤트 핸들러들 (데스크톱 테스트용)
function handleMouseDown(e) {
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    startTime = Date.now();

    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transition = 'none';
    swipeWrapper.style.cursor = 'grabbing';
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging) return;

    currentX = e.clientX;
    const diffX = currentX - startX;
    const swipeWrapper = document.getElementById('swipeWrapper');
    const translateX = -currentSlide * 100 + (diffX / window.innerWidth) * 100;

    swipeWrapper.style.transform = `translateX(${translateX}%)`;
}

function handleMouseUp(e) {
    if (!isDragging) return;

    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    swipeWrapper.style.cursor = 'grab';

    const diffX = currentX - startX;
    const timeDiff = Date.now() - startTime;
    const velocity = Math.abs(diffX) / timeDiff;

    if (velocity > 0.5 || Math.abs(diffX) > window.innerWidth * 0.25) {
        if (diffX > 0 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (diffX < 0 && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide);
        }
    } else {
        goToSlide(currentSlide);
    }

    isDragging = false;
}
