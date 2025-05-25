// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Note: Removed misplaced initializeSecondaryCharts() call from here
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
    initializeSecondaryCharts(); // Correct placement of this call

    // Intersection Observer for animations (moved from injected locations)
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
    const animateElements = document.querySelectorAll('.method-card, .step, .finding-card, .benefit-category');
    animateElements.forEach(el => observer.observe(el));

    // Add CSS for animations (moved from injected locations)
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
        ctx.lineTo(width - padding, height - padding); // X-axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding); // Y-axis
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
        ctx.strokeStyle = '#1e3a8a'; // Blue for PV
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding); // Start at 0,0
        for (let t = 0; t <= 100; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            const y = height - padding - (chartHeight / 100) * t; // PV increases linearly with time
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw EV line (based on actual progress with schedule offset)
        ctx.strokeStyle = '#10b981'; // Green for EV
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        for (let t = 0; t <= currentTime; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            // EV is based on evProgress at currentTime, scaled for current t
            const currentEvProgress = (evProgress / currentTime) * t;
            const y = height - padding - (chartHeight / 100) * Math.min(currentEvProgress, 100); // Cap EV progress at 100%
            if (t <= currentTime) { // Only draw up to current time
                 ctx.lineTo(x, y);
            }
        }
        ctx.stroke();


        // Draw AC line (based on cost performance)
        ctx.strokeStyle = '#ef4444'; // Red for AC
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        for (let t = 0; t <= currentTime; t += 2) {
            const x = padding + (chartWidth / 100) * t;
            // AC is EV * costMultiplier, scaled for current t
            const currentEvProgress = (evProgress / currentTime) * t;
            const cost = currentEvProgress * costMultiplier;
            const y = height - padding - (chartHeight / 100) * Math.min(cost, 100 * costMultiplier); // AC can exceed BAC
             if (t <= currentTime) { // Only draw up to current time
                ctx.lineTo(x, y);
            }
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
        const legendY = padding - 30 < 15 ? 15 : padding - 30; // Adjust legend position if padding is too small
        const legendItems = [
            { color: '#1e3a8a', label: 'PV (Planned Value)' },
            { color: '#10b981', label: 'EV (Earned Value)' },
            { color: '#ef4444', label: 'AC (Actual Cost)' }
        ];

        legendItems.forEach((item, index) => {
            const legendX = padding + 20 + index * 150;
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, legendY - 10, 20, 3); // Line for legend
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, legendX + 25, legendY);
        });

        // Draw value markers at current time
        const markerX = currentX;
        const pvAtCurrentTime = currentTime; // PV is % of time
        const evAtCurrentTime = evProgress;
        const acAtCurrentTime = evProgress * costMultiplier;

        const pvY = height - padding - (chartHeight / 100) * pvAtCurrentTime;
        const evY = height - padding - (chartHeight / 100) * evAtCurrentTime;
        const acY = height - padding - (chartHeight / 100) * acAtCurrentTime;

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

        const pvValue = (BAC * pvAtCurrentTime) / 100;
        const evValue = (BAC * evAtCurrentTime) / 100;
        const acValue = evValue * costMultiplier; // AC is based on EV * multiplier

        // Corrected fillText lines
        ctx.fillText('$' + (pvValue/1000000).toFixed(1) + 'M', markerX + 10, pvY + 4);
        ctx.fillText('$' + (evValue/1000000).toFixed(1) + 'M', markerX + 10, evY + 4);
        ctx.fillText('$' + (acValue/1000000).toFixed(1) + 'M', markerX + 10, acY + 4);
    }

    // Update simulation function
    function updateSimulation() {
        const pvAtCurrentTime = (BAC * currentTime) / 100; // PV at current time
        const evProgressValue = Math.max(0, Math.min(100, currentTime + scheduleOffset));
        const ev = (BAC * evProgressValue) / 100; // EV at current time based on progress
        const ac = ev * costMultiplier; // AC is EV * costMultiplier

        // Calculate performance indices
        const spi = pvAtCurrentTime > 0 ? ev / pvAtCurrentTime : 1;
        const cpi = ac > 0 ? ev / ac : 1; // Corrected CPI, if ac is 0, cpi is 1 or handle as per business logic.
        const sv = ev - pvAtCurrentTime;
        const cv = ev - ac;

        // Update display values
        document.getElementById('spiValue').textContent = spi.toFixed(2);
        document.getElementById('cpiValue').textContent = cpi.toFixed(2);
        // Corrected textContent lines
        document.getElementById('svValue').textContent = '$' + (sv/1000).toFixed(0) + 'K';
        document.getElementById('cvValue').textContent = '$' + (cv/1000).toFixed(0) + 'K';


        // Update indicator colors
        updateIndicatorColor('spiIndicator', spi, 0.95, 1.0); // Typical thresholds
        updateIndicatorColor('cpiIndicator', cpi, 0.95, 1.0); // Typical thresholds
        updateIndicatorColor('svIndicator', sv, - (0.05 * BAC), (0.05 * BAC)); // Example: 5% of BAC
        updateIndicatorColor('cvIndicator', cv, - (0.05 * BAC), (0.05 * BAC)); // Example: 5% of BAC


        // Redraw chart
        drawEVMChart();
    }

    function updateIndicatorColor(id, value, badThreshold, goodThreshold) {
        const indicator = document.getElementById(id);
        if (!indicator) return;

        indicator.classList.remove('good', 'warning', 'bad');

        if (id.includes('svIndicator') || id.includes('cvIndicator')) { // For Variance, positive is good
             if (value >= goodThreshold) { // Using goodThreshold as a positive buffer
                indicator.classList.add('good');
            } else if (value > badThreshold) { // badThreshold is a negative buffer
                indicator.classList.add('warning');
            } else {
                indicator.classList.add('bad');
            }
        } else { // For Indices, >1 is good
            if (value >= goodThreshold) {
                indicator.classList.add('good');
            } else if (value >= badThreshold) {
                indicator.classList.add('warning');
            } else {
                indicator.classList.add('bad');
            }
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
            if (canvas.offsetParent !== null) { // Check if canvas is visible
                 drawEVMChart();
            }
        }, 250);
    });

    // Initialize
    // A short delay can help ensure the canvas is fully rendered in the DOM, especially if there are CSS transitions affecting layout.
    setTimeout(() => {
         if (canvas.offsetParent !== null) { // Check if canvas is visible before first draw
            updateSimulation();
        }
    }, 100);
}

// Initialize secondary charts (this is the correctly placed one)
function initializeSecondaryCharts() {
    // Variance Chart with Fixed Legend Colors
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
                        return value < 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
                    },
                    borderColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)';
                    },
                    borderWidth: 1
                }, {
                    label: 'Schedule Variance (%)',
                    data: [-1, 2, 3, -2, 1, 0],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(251, 146, 60, 0.8)' : 'rgba(59, 130, 246, 0.8)';
                    },
                    borderColor: function(context) {
                        const value = context.parsed.y;
                        return value < 0 ? 'rgba(251, 146, 60, 1)' : 'rgba(59, 130, 246, 1)';
                    },
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            generateLabels: function(chart) {
                                return [
                                    {
                                        text: 'Cost Variance - Positive',
                                        fillStyle: 'rgba(16, 185, 129, 0.8)', // Green
                                        strokeStyle: 'rgba(16, 185, 129, 1)',
                                        lineWidth: 1,
                                        hidden: false,
                                        pointStyle: 'rect'
                                    },
                                    {
                                        text: 'Cost Variance - Negative',
                                        fillStyle: 'rgba(239, 68, 68, 0.8)', // Red
                                        strokeStyle: 'rgba(239, 68, 68, 1)',
                                        lineWidth: 1,
                                        hidden: false,
                                        pointStyle: 'rect'
                                    },
                                    {
                                        text: 'Schedule Variance - Positive',
                                        fillStyle: 'rgba(59, 130, 246, 0.8)', // Blue
                                        strokeStyle: 'rgba(59, 130, 246, 1)',
                                        lineWidth: 1,
                                        hidden: false,
                                        pointStyle: 'rect'
                                    },
                                    {
                                        text: 'Schedule Variance - Negative',
                                        fillStyle: 'rgba(251, 146, 60, 0.8)', // Orange
                                        strokeStyle: 'rgba(251, 146, 60, 1)',
                                        lineWidth: 1,
                                        hidden: false,
                                        pointStyle: 'rect'
                                    }
                                ];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                const status = value >= 0 ? 'Positive' : 'Negative';
                                return `${label}: ${value}% (${status})`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Variance (%)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Project Phase',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
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
                    data: [5, 5, 5, 6, 4, 5],
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

// Highlight metric function for dashboard (ensure it's defined if used in HTML onclick)
function highlightMetric(element) {
    const cards = document.querySelectorAll('.metric-card.compact'); // More specific selector
    cards.forEach(card => card.classList.remove('pulse')); // Assuming 'pulse' is the class
    element.classList.add('pulse');
}
