// noinspection JSVoidFunctionReturnValueUsed

$(document).ready((function ($) {
    "use strict";

    var navMenu = '.nav-menu',
        body = 'body',
        port = (window.location.port) ? ':' + window.location.port : '',
        appHost = window.location.protocol + '//' +
            window.location.hostname +
            port;

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
        $(document).on('click', '.mobile-nav-toggle', function (e) {
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
        });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
        $(".mobile-nav, .mobile-nav-toggle").hide();
    }

    function getFormData($form) {
        var data = {};

        $.each($form.serializeArray(), function (i, field) {
            if (field.name !== 'terms') {
                data[field.name] = field.value;
            } else {
                data[field.name] = true;
            }
        });
        $form.find(
            'input[type="checkbox"]:not(:checked)'
        ).each(function () {
            if ($.inArray(this.name, data) === -1) {
                data[this.name] = $(this).prop('checked')
            }
        });
        return data;
    }

    $('.signin-button').click(function () {
        var $form = $('.auth-form'),
            data = getFormData($form),
            host = 'http://127.0.0.1:8000/',
            path = 'api/signin/',
            url = host + path;

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            xhrFields: {withCredentials: true},
            success: function () {
                window.location.href = appHost + '/dashboard/';
            },
            error: function (res) {
                console.log(res);
                console.log('error');
            }
        });

        return false;
    });

    $('.signup-button').click(function () {
        var $form = $('.auth-form'),
            data = getFormData($form),
            host = 'http://127.0.0.1:8000/',
            path = 'api/signup/',
            url = host + path;

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            beforeSend: function () {
                $form.find('input').each(function () {
                    $(this).removeClass('is-invalid');
                })
            },
            success: function (res) {
                $('#header .alert-success').fadeIn(function () {
                    $(this).fadeOut(14000);
                });
                $form.find('input').each(function () {
                    var $signupField = $(this)

                    if ($signupField.is(':checked')) {
                        $(this).prop('checked', false);
                    } else {
                        $(this).val('');
                    }
                })
            },
            error: function (res) {
                $.each(res.responseJSON, function (fieldID, errorMessage) {
                    var $input = $('#' + fieldID),
                        $feedback = $input.parent().find('.invalid-feedback');

                    $feedback.text(errorMessage);
                    $input.addClass('is-invalid');
                });
            }
        });
        return false;
    });
    $('.alert .close').click(function () {
        var $alert = $(this).parent();

        $alert.fadeOut();
        $alert.dequeue();
    })
})(jQuery));
