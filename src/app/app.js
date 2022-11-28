// noinspection JSVoidFunctionReturnValueUsed
$(document).ready((function ($) {
    'use strict';

    var root = null,
        useHash = true,
        hash = '#',
        router = new Navigo(root, useHash, hash),
        navMenu = '.nav-menu',
        body = 'body';

    var css = {
        'app': [
            'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
            '/vendor/bootstrap/css/bootstrap.min.css',
            '/vendor/icofont/icofont.min.css',
            '/vendor/boxicons/css/boxicons.min.css',
            '/css/app.css',
            '/css/global.css',
        ],
        'dashboard': [
            'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
            '/vendor/icofont/materialdesignicons.css',
            '/vendor/admin-template/css/template.style.css',
            '/vendor/admin-template/css/layout.style.css',
            '/css/dashboard.css',
            '/css/global.css',
        ]
    };

    window.user = null;
    window.state = null;
    window.router = router;
    window.routes = {
        '': {
            'state': 'app',
            'selector': '#app',
            'template': '/home/home.html',
            'controller': '/home/home.js',
            'menuItems': '#header .container nav ul li',
            'css': css.app,
        },
        'signin': {
            'state': 'app',
            'selector': '#app',
            'template': '/signin/signin.html',
            'controller': '/auth/auth.js',
            'menuItems': '#header .container nav ul li',
            'css': css.app,
        },
        'signup': {
            'state': 'app',
            'selector': '#app',
            'template': '/signup/signup.html',
            'controller': '/auth/auth.js',
            'menuItems': '#header .container nav ul li',
            'css': css.app,
        },
        'dashboard': {
            'state': 'dashboard',
            'selector': '#dashboard',
            'template': '/dashboard/dashboard.html',
            'controller': '/dashboard/dashboard.js',
            'css': css.dashboard,
            'menuItems': '.sidebar .navigation-menu li',
        },
        'dashboard/reports': {
            'state': 'dashboard',
            'selector': '#dashboard',
            'template': '/dashboard/reports/reports.html',
            'controller': '/dashboard/reports/reports.js',
            'css': css.dashboard,
            'menuItems': '.sidebar .navigation-menu li',
        }
    };

    if ($(navMenu).length) {
        var $mobileNav = $(navMenu).clone().prop({
            class: 'mobile-nav d-lg-none'
        });
        $(body).append($mobileNav);
        $(body).prepend(
            '<button ' +
            'type="button" ' +
            'class="mobile-nav-toggle d-lg-none">' +
            '<i class="icofont-navigation-menu"></i>' +
            '</button>'
        );
        $(body).append(
            '<div class="mobile-nav-overly"></div>'
        );
        $(document).on('click', '.mobile-nav-toggle', function () {
            $(body).toggleClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass(
                'icofont-navigation-menu icofont-close'
            );
            $('.mobile-nav-overly').toggle();
        });
        $(document).on(
            'click',
            '.mobile-nav .drop-down > a',
            function (e) {
                e.preventDefault();
                $(this).next().slideToggle(300);
                $(this).parent().toggleClass('active');
            });

        $('.mobile-nav ul li a').click(function () {
            $('.mobile-nav-toggle').click();
        });

        $(document).click(function (e) {
            var container = $(".mobile-nav, .mobile-nav-toggle"),
                isTarget = (
                    !container.is(e.target) &&
                    container.has(e.target).length === 0
                ),
                mobileMenuActive = $(body).hasClass('mobile-nav-active');

            if (isTarget && mobileMenuActive) {
                $(body).removeClass('mobile-nav-active');
                $('.mobile-nav-toggle i').toggleClass(
                    'icofont-navigation-menu icofont-close'
                );
                $('.mobile-nav-overly').fadeOut();
            }
            setActiveNavItem(
                Object.values(router.current)[0].url,
                $('.mobile-nav ul li')
            );
        });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
        $(".mobile-nav, .mobile-nav-toggle").hide();
    }

    function toggleAuthMenu(state) {
        $('#header .container .nav-menu ul .auth-required').toggle(state);
        $('.mobile-nav.d-lg-none ul .auth-required').toggle(state);
        $('#header .container .nav-menu ul .authenticated').toggle(!state);
        $('.mobile-nav.d-lg-none ul .authenticated').toggle(!state);
    }

    function setActiveNavItem(currentRoute, $menuItems) {
        $menuItems.each(function (index, element) {
            $(element).removeClass('active');

            var hrefElement = $(element).find('a'),
                notHref = (
                    hrefElement.length === 0 ||
                    hrefElement.hasClass('nav-category-divider')
                );

            if (notHref) {
                return; // continue
            }

            var href = hrefElement.attr('href');

            if (href.startsWith('/')) {
                href = href.substr(1);
            }
            if (href.endsWith('/')) {
                var lastSlashIndex = href.length - 1;

                href = (
                    href.substring(0, lastSlashIndex) +
                    href.substring(
                        lastSlashIndex + 1,
                        href.length
                    )
                );
            }

            var setActive = (
                currentRoute === href ||
                (currentRoute === '' && href === '/')
            );

            if (setActive) {
                $(element).addClass('active');
            }
        });
    }

    function toggleAppElements(state) {
        $('#topbar').toggleClass('d-lg-flex', state);
        $('header').toggle(state);
        $('.mobile-nav').toggle(state);
        $('.mobile-nav-toggle').toggle(state);
    }

    function toggleDashboardElements(state) {
        $('.t-header').toggle(state);
        $('.page-body').toggle(state);
        $('body').toggleClass('header-fixed', state);
    }

    function before(done, match) {

        var route = window.routes[match.route.path];

        if (window.state !== route.state) {
            $('#preloader').show();
            $('body').removeClass('hidden');

            $('head link').each(function (index, element) {
                element.remove();
            });

            for (
                var index = 0;
                index < route.css.length;
                index++
            ) {
                $('head').prepend(
                    (
                        '<link rel="stylesheet" href="' +
                        Object.assign([], route.css).reverse()[index] +
                        '">'
                    )
                );
            }

            toggleAppElements(route.state === 'app');
            toggleDashboardElements(route.state === 'dashboard');

            $('#app').empty();
            $('#dashboard').empty();
        }

        setActiveNavItem(
            match.route.path,
            $(route.menuItems)
        );

        function loadPage() {
            $(route.selector).load(
                route.template,
                function () {
                    $.ajax({
                        url: route.controller,
                        dataType: 'script'
                    });
                    window.router.updatePageLinks();
                }
            );

            done();
        }

        function success(currentUserResponse) {
            if ($.inArray(match.route.path, ['signin', 'signup']) !== -1) {
                window.router.navigate('/');
                done(false);
            } else {
                window.user = currentUserResponse;

                $('.user-name').text(window.user.name);

                toggleAuthMenu(false);
                loadPage();
            }
        }

        function error() {
            if (route.state === 'dashboard') {
                window.router.navigate('/');
                done(false);
            } else {
                toggleAuthMenu(true);
                loadPage();
            }
        }

        $.ajax({
            type: 'GET',
            url: window.config.api + 'api/current_user/',
            xhrFields: {withCredentials: true},
            success: success,
            error: error
        });
    }

    function after(match) {
        window.state = window.routes[match.route.path].state;
    }

    router
        .on('/',
            function () {
            },
            {
                before: before,
            })
        .on('/signin',
            function () {
            },
            {
                before: before,
                after: after,
            })
        .on('/signup',
            function () {
            },
            {
                before: before,
                after: after,
            })
        .on('/dashboard',
            function () {
            },
            {
                before: before,
                after: after,
            })
        .on('/dashboard/reports',
            function () {
            },
            {
                before: before,
                after: after,
            })
        .notFound(function () {
            router.navigate('/');
        })
        .resolve();

})(jQuery));