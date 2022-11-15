// noinspection JSVoidFunctionReturnValueUsed
$(document).ready((function ($) {
    'use strict';

    var host = 'http://127.0.0.1:8000/',
        port = (window.location.port) ? ':' + window.location.port : '',
        appHost = window.location.protocol + '//' +
            window.location.hostname +
            port;

    function signOut() {
        window.location.href = appHost;
    }

    $.ajax({
        type: 'GET',
        url: host + 'api/current_user/',
        xhrFields: {withCredentials: true},
        success: function (res) {
            $('#preloader').fadeOut();
        },
        error: signOut
    });

    $('.signout-button').click(function () {
        var path = 'api/signout/',
            url = host + path;

        $.ajax({
            type: 'POST',
            url: url,
            xhrFields: {withCredentials: true},
            success: signOut,
            error: signOut
        });
    });

    var mobileToggler = $('.t-header-mobile-toggler');

    mobileToggler.on('click', function () {
        $('.page-body').toggleClass('sidebar-collpased');
    });

    var statsLineOptions = {
        scales: {
            responsive: false,
            maintainAspectRatio: true,
            yAxes: [{
                display: false
            }],
            xAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        },
        elements: {
            point: {
                radius: 0
            }
        },
        stepsize: 100
    }

    var charts = [
        {
            'element': $('#stat-line_1'),
            'colors': {
                'dark': '#2c4964',
                'light': '#1977cc',
            }
        },
        {
            'element': $('#stat-line_2'),
            'colors': {
                'dark': '#008d71',
                'light': '#51ba9c',
            }
        },
        {
            'element': $('#stat-line_3'),
            'colors': {
                'dark': '#FEE140',
                'light': '#db504a',
            }
        },
        {
            'element': $('#stat-line_4'),
            'colors': {
                'dark': '#1977cc',
                'light': '#3291e6',
            }
        },
    ];

    $.each(charts, function (index, chart) {
        if (chart.element.length) {
            var lineChartCanvas = chart.element
                    .get(0)
                    .getContext('2d'),
                gradientStroke = lineChartCanvas
                    .createLinearGradient(100, 60, 30, 0);

            gradientStroke.addColorStop(0, chart.colors.dark);
            gradientStroke.addColorStop(1, chart.colors.light);

            var _ = new Chart(lineChartCanvas, {
                type: 'line',
                data: {
                    labels: [
                        'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
                        'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11',
                        'Day 12', 'Day 13'
                    ],
                    datasets: [{
                        label: 'Profit',
                        data: [7, 6, 9, 7, 8, 6, 8, 5, 7, 8, 6, 7, 7],
                        borderColor: gradientStroke,
                        borderWidth: 3,
                        fill: false
                    }]
                },
                options: statsLineOptions
            });
        }
    });

    var $barChart = $('#followers-bar-chart');

    if ($barChart.length) {
        var options = {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                responsive: !0,
                maintainAspectRatio: !0,
                yAxes: [{
                    display: !0,
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.03)',
                        drawBorder: !1
                    },
                    ticks: {
                        min: 20,
                        max: 80,
                        stepSize: 20,
                        fontColor: '#212529',
                        maxTicksLimit: 3,
                        callback: function (a, e, r) {
                            return a + ' K';
                        },
                        padding: 10
                    }
                }],
                xAxes: [{
                    display: !1,
                    barPercentage: 0.3,
                    gridLines: {
                        display: !1,
                        drawBorder: !1
                    }
                }]
            },
            legend: {
                display: !1
            }
        };

        var _ = new Chart($barChart, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thus', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Follower',
                    data: [62, 52, 73, 58, 63, 72],
                    backgroundColor: [
                        '#1977cc', '#1977cc', '#1977cc',
                        '#1977cc', '#1977cc', '#1977cc'
                    ],
                    borderColor: '#1977cc',
                    borderWidth: 0
                }]
            },
            options: options
        });
    }

    var $radialChart = $('#radial-chart');

    if ($radialChart.length) {
        var radialOptions = {
            chart: {
                height: 230,
                type: 'radialBar'
            },
            series: [67],
            colors: ['#2c4964'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: 'rgba(255,255,255,0.1)'
                    },
                    track: {
                        dropShadow: {
                            enabled: !0,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.02
                        }
                    },
                    dataLabels: {
                        name: {
                            offsetY: -10,
                            color: '#adb5bd',
                            fontSize: '13px'
                        },
                        value: {
                            offsetY: 5,
                            color: '#000',
                            fontSize: '20px',
                            show: !0
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'vertical',
                    gradientToColors: ['#1977cc'],
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Progress']
        };
        var radialChart = new ApexCharts($radialChart[0], radialOptions)

        radialChart.render();
    }

})(jQuery));