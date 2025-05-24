// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
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
let sCurveChart, performanceChart, varianceChart, benefitsChart, heroChart;

// Data for different scenarios
const scenarios = {
    baseline: {
        pv: [0, 5, 15, 30, 45, 60, 75, 85, 92, 97, 100],
        ev: [0, 4, 14, 28, 43, 58, 73, 84, 91, 95, 98],
        ac: [0, 4, 13, 27, 42, 56, 71, 82, 89, 93, 95],
        spi: [1.0, 0.95, 0.98, 0.96, 0.97, 0.98, 0.97, 0.99, 0.99, 0.98, 0.98],
        cpi: [1.0, 1.02, 1.04, 1.03, 1.02, 1.03, 1.03, 1.02, 1.02, 1.02, 1.03],
        spiValue: '0.98',
        cpiValue: '1.03',
        eacValue: '$9.7M'
    },
    delayed: {
        pv: [0, 5, 15, 30, 45, 60, 75, 85, 92, 97, 100],
        ev: [0, 3, 10, 22, 35, 48, 62, 72, 80, 86, 90],
        ac: [0, 4, 12, 25, 38, 52, 66, 76, 84, 90, 94],
        spi: [1.0, 0.6, 0.67, 0.73, 0.78, 0.8, 0.83, 0.85, 0.87, 0.89, 0.9],
        cpi: [1.0, 0.75, 0.83, 0.88, 0.92, 0.92, 0.94, 0.95, 0.95, 0.96, 0.96],
        spiValue: '0.90',
        cpiValue: '0.96',
        eacValue: '$10.4M'
    },
    accelerated: {
        pv: [0, 5, 15, 30, 45, 60, 75, 85, 92, 97, 100],
        ev: [0, 7, 20, 38, 55, 72, 85, 94, 98, 100, 100],
        ac: [0, 6, 18, 35, 52, 68, 82, 91, 96, 98, 98],
        spi: [1.0, 1.4, 1.33, 1.27, 1.22, 1.2, 1.13, 1.11, 1.07, 1.03, 1.0],
        cpi: [1.0, 1.17, 1.11, 1.09, 1.06, 1.06, 1.04, 1.03, 1.02, 1.02, 1.02],
        spiValue: '1.15',
        cpiValue: '1.05',
        eacValue: '$9.5M'
    },
    overbudget: {
        pv: [0, 5, 15, 30, 45, 60, 75, 85, 92, 97, 100],
        ev: [0, 4, 14, 28, 43, 58, 73, 84, 91, 95, 98],
        ac: [0, 6, 18, 35, 53, 71, 88, 98, 105, 110, 115],
        spi: [1.0, 0.95, 0.98, 0.96, 0.97, 0.98, 0.97, 0.99, 0.99, 0.98, 0.98],
        cpi: [1.0, 0.67, 0.78, 0.8, 0.81, 0.82, 0.83, 0.86, 0.87, 0.86, 0.85],
        spiValue: '0.98',
        cpiValue: '0.85',
        eacValue: '$11.8M'
    }
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroChart();
    initializeCharts();
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

// Initialize main dashboard charts
function initializeCharts() {
    // S-Curve Chart
    const sCurveCtx = document.getElementById('sCurveChart');
    if (sCurveCtx) {
        sCurveChart = new Chart(sCurveCtx, {
            type: 'line',
            data: {
                labels: ['Start', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 
                        'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Complete'],
                datasets: [{
                    label: 'Planned Value (PV)',
                    data: scenarios.baseline.pv,
                    borderColor: '#1e3a8a',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Earned Value (EV)',
                    data: scenarios.baseline.ev,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Actual Cost (AC)',
                    data: scenarios.baseline.ac,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Percentage Complete (%)'
                        }
                    }
                }
            }
        });
    }

    // Performance Indices Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 
                        'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10'],
                datasets: [{
                    label: 'SPI',
                    data: scenarios.baseline.spi.slice(1),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }, {
                    label: 'CPI',
                    data: scenarios.baseline.cpi.slice(1),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Performance Index'
                        },
                        min: 0.5,
                        max: 1.5
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 1,
                                yMax: 1,
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderWidth: 2,
                                borderDash: [5, 5]
                            }
                        }
                    }
                }
            }
        });
    }

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
                labels: ['Early Problem Detection', 'Cost Control', 'Schedule Management', 
                        'Stakeholder Communication', 'Risk Mitigation', 'Decision Making'],
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

// Update scenario function
function updateScenario(scenario) {
    const data = scenarios[scenario];
    
    // Update S-Curve
    if (sCurveChart) {
        sCurveChart.data.datasets[0].data = data.pv;
        sCurveChart.data.datasets[1].data = data.ev;
        sCurveChart.data.datasets[2].data = data.ac;
        sCurveChart.update();
    }
    
    // Update Performance Chart
    if (performanceChart) {
        performanceChart.data.datasets[0].data = data.spi.slice(1);
        performanceChart.data.datasets[1].data = data.cpi.slice(1);
        performanceChart.update();
    }
    
    // Update metrics display
    document.getElementById('spiValue').textContent = data.spiValue;
    document.getElementById('cpiValue').textContent = data.cpiValue;
    document.getElementById('eacValue').textContent = data.eacValue;
    
    // Update button states
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
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