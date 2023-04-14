$(document).ready(function() {

    $('.burger-link').click(function(e) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('burger-menu-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css('margin-top', -curScroll);
        e.preventDefault();
    });

    $('.burger-menu-close').click(function(e) {
        $('html').removeClass('burger-menu-open');
        $('.wrapper').css('margin-top', 0);
        $('body').css({'margin-right': '0'});
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.main-prefs-list').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        slidesPerRow: 5,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    slidesPerRow: 1,
                    arrows: false
                }
            }
        ]
    });

    $('.main-peoples-list').slick({
        infinite: false,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    variableWidth: false
                }
            }
        ]
    });

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        $('.window-link').removeClass('last-active');
        curLink.addClass('last-active');
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.events-more a', function(e) {
        $('.events-more').addClass('loading');
        var curLink = $(this);
        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            $('.events').append($(html).find('.events').html())
            if ($(html).find('.events-more').length == 1) {
                $('.events-more a').attr('href', $(html).find('.events-more a').attr('href'));
            } else {
                $('.events-more').remove();
            }
            $('.events-more').removeClass('loading');
        });
        e.preventDefault();
    });

    $('body').on('click', '.selection-filter-group-title', function() {
        $(this).parent().toggleClass('open');
    });

    $('.selection-filter-size input').change(function() {
        updateFilterSize();
    });

    updateFilterSize();

    $('.selection-filter-reset button').click(function(e) {
        var curForm = $('.selection-filter-container form');
        $('.selection-filter input:checked').prop('checked', false);
        curForm.find('input[type="checkbox"]').each(function() {
            var curInput = $(this);
            var curName = curInput.attr('name');
            var curValue = curInput.prop('checked');
            $.cookie(curName, curValue, {expires: 365});
        });
        updateFilterSize();
        updateCatalogue();
        e.preventDefault();
    });

    $('body').on('click', '.selection-more a', function(e) {
        $('.selection-more').addClass('loading');
        var curLink = $(this);
        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            $('.selection-list').append($(html).find('.selection-list').html())
            if ($(html).find('.selection-more').length == 1) {
                $('.selection-more a').attr('href', $(html).find('.selection-more a').attr('href'));
            } else {
                $('.selection-more').remove();
            }
            $('.selection-more').removeClass('loading');
        });
        e.preventDefault();
    });

    $('.selection-filter-mobile-link').click(function(e) {
        var curScroll = $(window).scrollTop();
        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        $('html').addClass('selection-filter-open');

        e.preventDefault();
    });

    $('.selection-filter-mobile-close a').click(function(e) {
        $('html').removeClass('selection-filter-open');

        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));

        e.preventDefault();
    });

    $('.detail-furniture-switch a').click(function(e) {
        $('.detail-preview').toggleClass('view-furniture');
        e.preventDefault();
    });

    $('.detail-group-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.selection-filter-container form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        if (validator) {
            validator.destroy();
        }
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                curForm.find('input[type="checkbox"]').each(function() {
                    var curInput = $(this);
                    var curName = curInput.attr('name');
                    var curValue = curInput.prop('checked');
                    $.cookie(curName, curValue, {expires: 365});
                });
                updateCatalogue();
            }
        });

        curForm.find('input[type="checkbox"]').each(function() {
            var curInput = $(this);
            var curName = curInput.attr('name');
            if (typeof $.cookie(curName) != 'undefined' && $.cookie(curName) == 'true') {
                curInput.prop('checked', true);
            } else {
                curInput.prop('checked', false);
            }
        });

        updateFilterSize();

        updateCatalogue();
    });

});

$(window).on('scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.main-architecture-gallery').each(function() {
        if ((windowScroll + windowHeight / 2) > $('.main-architecture-gallery-item-2').offset().top) {
            var curTop = ((windowScroll + windowHeight / 2) - $('.main-architecture-gallery-item-2').offset().top) / 4;
            var curMax = $('.main-architecture-gallery-item-2').height() - $('.main-architecture-gallery-item-1').height();
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-1').css({'transform': 'translateY(' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-1').css({'transform': 'translateY(0)'});
        }
        if ((windowScroll + windowHeight) > $('.main-architecture-gallery-item-3').offset().top) {
            var curTop = ((windowScroll + windowHeight) - $('.main-architecture-gallery-item-3').offset().top) / 6;
            var curMax = $('.main-author').offset().top - ($('.main-architecture-gallery-item-4').offset().top);
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-4').css({'transform': 'translateX(' + curTop + 'px)'});
            $('.main-architecture-gallery-item-5').css({'transform': 'translateX(' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-4').css({'transform': 'translateX(0)'});
            $('.main-architecture-gallery-item-5').css({'transform': 'translateX(0)'});
        }
        if ((windowScroll + windowHeight) > $('.main-architecture-gallery-item-1').offset().top) {
            var curTop = ((windowScroll + windowHeight) - $('.main-architecture-gallery-item-1').offset().top) / 6;
            var curMax = $('.main-architecture-gallery').outerWidth() - $('.main-architecture-gallery-item-1').outerWidth();
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-1 img').css({'transform': 'translateX(' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-1 img').css({'transform': 'translateX(0)'});
        }
        if ((windowScroll + windowHeight) > $('.main-architecture-gallery-item-2').offset().top) {
            var curTop = ((windowScroll + windowHeight) - $('.main-architecture-gallery-item-2').offset().top) / 6;
            var curMax = $('.main-architecture-gallery').outerWidth() - $('.main-architecture-gallery-item-2').outerWidth();
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-2 img').css({'transform': 'translateX(-' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-2 img').css({'transform': 'translateX(0)'});
        }
        if ((windowScroll + windowHeight / 2) > $('.main-architecture-gallery-group').offset().top) {
            var curTop = ((windowScroll + windowHeight / 2) - $('.main-architecture-gallery-group').offset().top) / 6;
            var curMax = $('.main-architecture-gallery-group').height() - $('.main-architecture-gallery-item-3').height();
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-3 img').css({'transform': 'translateY(' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-3 img').css({'transform': 'translateY(0)'});
        }
        if ((windowScroll + windowHeight / 2) > $('.main-architecture-gallery-group').offset().top) {
            var curTop = ((windowScroll + windowHeight / 2) - $('.main-architecture-gallery-group').offset().top) / 6;
            var curMax = $('.main-architecture-gallery-group').height() - $('.main-architecture-gallery-item-4').height();
            if (curTop > curMax) {
                curTop = curMax;
            }
            $('.main-architecture-gallery-item-4 img').css({'transform': 'translateY(-' + curTop + 'px)'});
        } else {
            $('.main-architecture-gallery-item-4 img').css({'transform': 'translateY(0)'});
        }
    });
});

$(window).on('load', function() {
    window.setTimeout(function() {
        $('body').removeClass('loading');
        if ($('body').hasClass('page-main')) {
            $(window).scrollTop(0);
        }
    }, 500);
    window.setTimeout(function() {
        $('body').removeClass('loading-title');
    }, 2000);
    window.setTimeout(function() {
        $('body').removeClass('loading-main-start');
    }, 3500);
});

$(window).on('load resize', function() {
    $('.main-pleasure').each(function() {
        $('.main-pleasure').css({'height': $('.main-pleasure-inner').outerHeight()});
    });
});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($('body').hasClass('page-main')) {
        if (windowScroll > 0) {
            $('body').removeClass('loading-main');
        } else {
            $('body').addClass('loading-main');
        }
    }

    if ($('.main-pleasure').length == 1) {
        if (windowScroll + $('header').outerHeight() >= $('.main-pleasure').offset().top) {
            $('.main-pleasure').addClass('fixed');
        } else {
            $('.main-pleasure').removeClass('fixed');
        }
    }

    if ($('.selection-filter-mobile-link').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.selection-filter-mobile-link').css({'margin-bottom': (windowScroll + windowHeight) - ($('footer').offset().top + 80)});
        } else {
            $('.selection-filter-mobile-link').css({'margin-bottom': 0});
        }
    }

    if ($('.detail-order').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.detail-order').css({'margin-bottom': (windowScroll + windowHeight) - ($('footer').offset().top + 80)});
        } else {
            $('.detail-order').css({'margin-bottom': 0});
        }
    }

    $('.business-download').each(function() {
        if (windowScroll + 104 > $('.business-download').offset().top) {
            $('.business-download').addClass('fixed');
            if (windowScroll + 104 + $('.business-download-inner').outerHeight() > $('.business-container').offset().top + $('.business-container').outerHeight()) {
                $('.business-download-inner').css({'margin-top': -((windowScroll + 104 + $('.business-download-inner').outerHeight()) - ($('.business-container').offset().top + $('.business-container').outerHeight())) + 'px'});
            } else {
                $('.business-download-inner').css({'margin-top': 0});
            }
        } else {
            $('.business-download').removeClass('fixed');
            $('.business-download-inner').css({'margin-top': 0});
        }
    });

    if ($('.business-link').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.business-link').css({'margin-bottom': (windowScroll + windowHeight) - ($('footer').offset().top + 80)});
        } else {
            $('.business-link').css({'margin-bottom': 0});
        }
    }

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');


    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                curForm.addClass('loading');
                var formData = new FormData(form);

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    curForm.find('.message').remove();
                    curForm.append('<div class="message">Сервис временно недоступен, попробуйте позже.</div>')
                    curForm.removeClass('loading');
                }).done(function(data) {
                    curForm.find('.message').remove();
                    curForm.html('<div class="message">' + data.message + '</div>')
                    curForm.removeClass('loading');
                });
            } else {
                form.submit();
            }
        }
    });

}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close">Свернуть<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });

    });
}

function windowClose() {
    if ($('.window').length > 0) {

        var isEmptyForm = true;
        $('.window .form-input input').each(function() {
            if ($(this).val() != '') {
                isEmptyForm = false;
            }
        });
        if (isEmptyForm) {
            $('.window-container').addClass('window-container-preload');
            window.setTimeout(function() {
                $('.window').remove();
                $('html').removeClass('window-open');
                $('body').css({'margin-right': 0});
                $('.wrapper').css({'top': 0});
                $(window).scrollTop($('.wrapper').data('curScroll'));
            }, 500);
        } else {
            if (confirm('Закрыть форму?')) {
                $('.window .form-input input').val('');
                windowClose();
            }
        }
    }
}

function updateFilterSize() {
    $('.selection-filter-size').each(function() {
        if ($('.selection-filter-size input:checked').length > 0) {
            $('.selection-filter-size-text-from').html($('.selection-filter-size input:checked').eq(0).parent().find('span').html());
            $('.selection-filter-size-text-to').html($('.selection-filter-size input:checked').last().parent().find('span').html());
        } else {
            $('.selection-filter-size-text-from').html($('.selection-filter-size input').eq(0).parent().find('span').html());
            $('.selection-filter-size-text-to').html($('.selection-filter-size input').last().parent().find('span').html());
        }
    });
}

function updateCatalogue() {
    $('.selection-filter-container').addClass('loading');
    var curForm = $('.selection-filter-container form');
    var curData = curForm.serialize();
    $.ajax({
        type: 'POST',
        url: curForm.attr('action'),
        dataType: 'html',
        data: curData,
        cache: false
    }).done(function(html) {
        $('.selection-container').html(html)
        $('.selection-filter-container').removeClass('loading');
    });
}