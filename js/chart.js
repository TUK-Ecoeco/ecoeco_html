// 최대값 하이라이트 플러그인
const highlightMaxPlugin = {
    id: 'highlightMax',
    afterDatasetsDraw(chart) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { y } } = chart;
        const dataset = data.datasets[0].data;
        const maxValue = Math.max(...dataset);
        const maxIndex = dataset.indexOf(maxValue);
        const yPos = y.getPixelForValue(maxValue);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left, yPos);
        ctx.lineTo(right, yPos);
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 라벨 텍스트
        ctx.fillStyle = '#FF8C00';
        ctx.font = '12px sans-serif';
        ctx.fillText(getAnnotationLabel(chart.canvas.id, maxValue), right - 120, yPos - 10);
        ctx.restore();
    }
};

// 텍스트 설명 함수
function getAnnotationLabel(chartId, value) {
    if (chartId.includes('co2')) return `= 생수 ${Math.round(value / 0.5)}병`;
    if (chartId.includes('carbon')) return `= 나무 ${Math.round(value / 0.5)}그루 흡수량`;
    if (chartId.includes('energy')) return `= 냉장고 ${Math.round(value / 1.2)}대 전력`;
    if (chartId.includes('water')) return `= 샤워 ${Math.round(value * 1000 / 50)}회분`;
    return '';
}

// 차트 초기화 변수
const charts = {};
const mobileCharts = {};

// 차트 초기화 함수
function initChart(chartId, data, color, label) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return null;

    const chart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: color + '20',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.06)'
                    },
                    ticks: {
                        color: '#6b7280',

                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.06)'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            }
        },
        plugins: [highlightMaxPlugin]
    });

    return chart;
}

// 차트 업데이트 함수
function updateChart(chartType, scale, isMobile = false) {
    const chartData = data[chartType][scale];
    const chartObj = isMobile ? mobileCharts[chartType] : charts[chartType];

    if (!chartObj) return;

    chartObj.data.datasets[0].data = chartData.values;
    chartObj.update('active');

    // 통계 업데이트
    const suffix = isMobile ? 'Mobile' : '';
    if (chartType === 'co2') {
        const totalEl = document.getElementById('co2Total' + suffix);
        const monthlyEl = document.getElementById('co2Monthly' + suffix);
        if (totalEl) totalEl.textContent = chartData.total;
        if (monthlyEl) monthlyEl.textContent = chartData.monthly;
    } else if (chartType === 'carbon') {
        const totalEl = document.getElementById('carbonTotal' + suffix);
        const compareEl = document.getElementById('carbonMonthly' + suffix);
        if (totalEl) totalEl.textContent = chartData.total;
        if (compareEl) compareEl.textContent = chartData.monthly;
    } else if (chartType === 'energy') {
        const totalEl = document.getElementById('energyTotal' + suffix);
        const renewableEl = document.getElementById('energyMonthly' + suffix);
        if (totalEl) totalEl.textContent = chartData.total;
        if (renewableEl) renewableEl.textContent = chartData.monthly;
    } else if (chartType === 'water') {
        const totalEl = document.getElementById('waterTotal' + suffix);
        const dailyEl = document.getElementById('waterMonthly' + suffix);
        if (totalEl) totalEl.textContent = chartData.total;
        if (dailyEl) dailyEl.textContent = chartData.monthly;
    }
}
