// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
// Initialize secondary charts
function initializeSecondaryCharts() {
    // Variance Chart
    const varianceCtx = document.getElementById('varianceChart');
    if (varianceCtx) {
        varianceChart = new Chart(varianceCtx, {
            type: 'bar',
            data: {
                labels: ['Piling', 'Foundation', 'Structure', 'Beams', 'Bridge Deck', 'Finishing'],
                datasets: [{
                    label: 'Cost Variance (%)',
                    data: [2, -3, 4, 1, -2, 3],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)';
                    }
                }, {
                    label: 'Schedule Variance (%)',
                    data: [-1, 2, 3, -2, 1, 0],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(251, 146, 60, 0.7)' : 'rgba(59, 130, 246, 0.7)';
                    }
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Variance (%)'
                        }
                    }
                }
            }
        });
    }

    // Benefits Chart
    const benefitsCtx = document.getElementById('benefitsChart');
    if (benefitsCtx) {
        benefitsChart = new Chart(benefitsCtx, {
            type: 'radar',
            data: {
                labels: ['Early Detection', 'Cost Control', 'Schedule Mgmt', 
                        'Communication', 'Risk Mitigation', 'Decision Making'],
                datasets: [{
                    label: 'Without EVM',
                    data: [3, 4, 3, 2, 3, 3],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    pointBackgroundColor: '#ef4444'
                }, {
                    label: 'With EVM',
                    data: [9, 8, 9, 8, 8, 9],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--bg-primary)';
        navbar.style.backdropFilter = 'none';
    }
});

// Chart configurations
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        }
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false
            }
        },
        y: {
            display: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        }
    }
};

// Initialize charts
let evmChart, varianceChart, benefitsChart, heroChart;

// Global variables for EVM simulation
const BAC = 10000000; // Budget at Completion ($10M)
let currentTime = 50; // Current time as percentage
let scheduleOffset = 0; // Schedule performance offset
let costMultiplier = 1; // Cost performance multiplier

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroChart();
    initializeEVMChart();
    initializeSecondaryCharts();
});

// Hero Chart
function initializeHeroChart() {
    const ctx = document.getElementById('heroChart');
    if (!ctx) return;

    heroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Planned Value',
                data: [0, 15, 30, 45, 60, 75],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }, {
                label: 'Earned Value',
                data: [0, 14, 28, 43, 58, 73],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize main EVM chart
function initializeEVMChart() {
    const canvas = document.getElementById('evmChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Custom drawing function for the EVM chart
    function drawEVMChart() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = padding + (chartHeight / 10) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Time (%)', width / 2, height - 20);
        
        // Y-axis label
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Value ($M)', 0, 0);
        ctx.restore();

        // Calculate values
        const evProgress = Math.max(0, Math.min(100, currentTime + scheduleOffset));
        
        // Draw PV line (diagonal from 0,0 to 100,BAC)
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        for (let t = 0; t <= 100; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            const y = height - padding - (chartHeight / 100) * t;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw EV line (based on actual progress with schedule offset)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        for (let t = 0; t <= currentTime; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            const actualProgress = (evProgress / currentTime) * t;
            const y = height - padding - (chartHeight / 100) * actualProgress;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw AC line (based on cost performance)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        for (let t = 0; t <= currentTime; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            const actualProgress = (evProgress / currentTime) * t;
            const cost = actualProgress * costMultiplier;
            const y = height - padding - (chartHeight / 100) * cost;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw current time line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const currentX = padding + (chartWidth / 100) * currentTime;
        ctx.moveTo(currentX, padding);
        ctx.lineTo(currentX, height - padding);
        ctx.stroke();
        ctx.setLineDash([]);

        // Legend
        const legendY = padding + 20;
        const legendItems = [
            { color: '#1e3a8a', label: 'PV (Planned Value)' },
            { color: '#10b981', label: 'EV (Earned Value)' },
            { color: '#ef4444', label: 'AC (Actual Cost)' }
        ];

        legendItems.forEach((item, index) => {
            const legendX = padding + 20 + index * 150;
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, legendY, 20, 3);
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, legendX + 25, legendY + 5);
        });

        // Draw value markers at current time
        const markerX = currentX;
        const pvY = height - padding - (chartHeight / 100) * currentTime;
        const evY = height - padding - (chartHeight / 100) * evProgress;
        const acY = height - padding - (chartHeight / 100) * (evProgress * costMultiplier);

        // PV marker
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(markerX, pvY, 6, 0, Math.PI * 2);
        ctx.fill();

        // EV marker
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(markerX, evY, 6, 0, Math.PI * 2);
        ctx.fill();

        // AC marker
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(markerX, acY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Value labels at markers
        ctx.fillStyle = '#374151';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        
        const pv = (BAC * currentTime) / 100;
        const ev = (BAC * evProgress) / 100;
        const ac = ev * costMultiplier;
        
        ctx.fillText('

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Highlight metric function for dashboard
function highlightMetric(element) {
    const cards = document.querySelectorAll('.metric-card');
    cards.forEach(card => card.classList.remove('pulse'));
    element.classList.add('pulse');
} + (pv/1000000).toFixed(1) + 'M', markerX + 10, pvY);
        ctx.fillText('

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); + (ev/1000000).toFixed(1) + 'M', markerX + 10, evY);
        ctx.fillText('

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); + (ac/1000000).toFixed(1) + 'M', markerX + 10, acY);
    }

    // Update simulation function
    function updateSimulation() {
        const pv = (BAC * currentTime) / 100;
        const evProgress = Math.max(0, Math.min(100, currentTime + scheduleOffset));
        const ev = (BAC * evProgress) / 100;
        const ac = ev * costMultiplier;

        // Calculate performance indices
        const spi = pv > 0 ? ev / pv : 1;
        const cpi = ac > 0 ? ev / ac : 1;
        const sv = ev - pv;
        const cv = ev - ac;

        // Update display values
        document.getElementById('spiValue').textContent = spi.toFixed(2);
        document.getElementById('cpiValue').textContent = cpi.toFixed(2);
        document.getElementById('svValue').textContent = '

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); + (sv/1000).toFixed(0) + 'K';
        document.getElementById('cvValue').textContent = '

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); + (cv/1000).toFixed(0) + 'K';

        // Update indicator colors
        updateIndicatorColor('spiIndicator', spi, 0.9, 1.1);
        updateIndicatorColor('cpiIndicator', cpi, 0.9, 1.1);
        updateIndicatorColor('svIndicator', sv, -50000, 50000);
        updateIndicatorColor('cvIndicator', cv, -50000, 50000);

        // Redraw chart
        drawEVMChart();
    }

    function updateIndicatorColor(id, value, badThreshold, goodThreshold) {
        const indicator = document.getElementById(id);
        if (!indicator) return;
        
        indicator.classList.remove('good', 'warning', 'bad');
        
        if (value >= goodThreshold) {
            indicator.classList.add('good');
        } else if (value >= badThreshold) {
            indicator.classList.add('warning');
        } else {
            indicator.classList.add('bad');
        }
    }

    // Event listeners for sliders
    const progressSlider = document.getElementById('progressSlider');
    if (progressSlider) {
        progressSlider.addEventListener('input', function(e) {
            currentTime = parseInt(e.target.value);
            document.getElementById('progressValue').textContent = currentTime + '%';
            updateSimulation();
        });
    }

    const scheduleSlider = document.getElementById('scheduleSlider');
    if (scheduleSlider) {
        scheduleSlider.addEventListener('input', function(e) {
            scheduleOffset = parseInt(e.target.value);
            const label = scheduleOffset > 0 ? `${scheduleOffset}% Ahead` : 
                         scheduleOffset < 0 ? `${Math.abs(scheduleOffset)}% Behind` : 
                         'On Schedule';
            document.getElementById('scheduleValue').textContent = label;
            updateSimulation();
        });
    }

    const costSlider = document.getElementById('costSlider');
    if (costSlider) {
        costSlider.addEventListener('input', function(e) {
            costMultiplier = parseInt(e.target.value) / 100;
            const percentage = Math.round((costMultiplier - 1) * 100);
            const label = percentage > 0 ? `${percentage}% Over` : 
                         percentage < 0 ? `${Math.abs(percentage)}% Under` : 
                         'On Budget';
            document.getElementById('costValue').textContent = label;
            updateSimulation();
        });
    }

    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            drawEVMChart();
        }, 250);
    });

    // Initialize
    setTimeout(() => {
        updateSimulation();
    }, 100);
}

// Initialize secondary charts
function initializeSecondaryCharts() {
    // Variance Chart
    const varianceCtx = document.getElementById('varianceChart');
    if (varianceCtx) {
        varianceChart = new Chart(varianceCtx, {
            type: 'bar',
            data: {
                labels: ['Piling', 'Foundation', 'Structure', 'Super-T', 'Bridge Deck', 'Finishing'],
                datasets: [{
                    label: 'Cost Variance (%)',
                    data: [2, -3, 4, 1, -2, 3],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)';
                    }
                }, {
                    label: 'Schedule Variance (%)',
                    data: [-1, 2, 3, -2, 1, 0],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(251, 146, 60, 0.7)' : 'rgba(59, 130, 246, 0.7)';
                    }
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Variance (%)'
                        }
                    }
                }
            }
        });
    }

    // Benefits Chart
    const benefitsCtx = document.getElementById('benefitsChart');
    if (benefitsCtx) {
        benefitsChart = new Chart(benefitsCtx, {
            type: 'radar',
            data: {
                labels: ['Early Detection', 'Cost Control', 'Schedule Mgmt', 
                        'Communication', 'Risk Mitigation', 'Decision Making'],
                datasets: [{
                    label: 'Without EVM',
                    data: [3, 4, 3, 2, 3, 3],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    pointBackgroundColor: '#ef4444'
                }, {
                    label: 'With EVM',
                    data: [9, 8, 9, 8, 8, 9],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .method-card, .step, .finding-card, .benefit-category {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
