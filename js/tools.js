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
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg>Листай</button>',
        nextArrow: '<button type="button" class="slick-next">Листай<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></button>',
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
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg>Листай</button>',
        nextArrow: '<button type="button" class="slick-next">Листай<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    variableWidth: false,
                    arrows: false
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

    $('.selection-filter-build input').change(function() {
        updateFilterSizesList();
    });

    $('.selection-filter-rooms input').change(function() {
        updateFilterSizesList();
    });

    $('.selection-filter-size input').change(function() {
        updateFilterSize();
    });

    updateFilterSizesList();
    updateFilterSize();

    $('.selection-filter-reset button').click(function(e) {
        var curForm = $('.selection-filter-container form');
        $('.selection-filter input:checked').prop('checked', false);
        curForm.find('input[type="checkbox"]').each(function() {
            var curInput = $(this);
            var curIndex = curForm.find('input[type="checkbox"]').index(curInput);
            var curChecked = curInput.prop('checked');
            $.cookie('filter_checkbox_' + curIndex, curChecked, {expires: 365});
        });
        updateFilterSizesList();
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
        $(window).trigger('scroll');
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
                    var curIndex = curForm.find('input[type="checkbox"]').index(curInput);
                    var curChecked = curInput.prop('checked');
                    $.cookie('filter_checkbox_' + curIndex, curChecked, {expires: 365});
                });
                updateCatalogue();
            }
        });

        curForm.find('input[type="checkbox"]').each(function() {
            var curInput = $(this);
            var curIndex = curForm.find('input[type="checkbox"]').index(curInput);
            if (typeof $.cookie('filter_checkbox_' + curIndex) != 'undefined' && $.cookie('filter_checkbox_' + curIndex) == 'true') {
                curInput.prop('checked', true);
            } else {
                curInput.prop('checked', false);
            }
        });

        updateFilterSizesList();
        updateFilterSize();

        updateCatalogue();
    });

    $('[data-fancybox]').fancybox({
        hideScrollbar: false,
        buttons : [
            'close'
        ],
        lang : 'ru',
        i18n : {
            'ru' : {
                CLOSE   : 'Закрыть'
            }
        }
    });

    $('.idea-carousel').slick({
        infinite: false,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg>Листай</button>',
        nextArrow: '<button type="button" class="slick-next">Листай<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-arrow"></use></svg></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    arrows: false
                }
            }
        ]
    });

    if ($('.detail').length == 1) {
        $('html').addClass('detail-page');
    }

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
    $('.simple-header').each(function() {
        $('.simple-header').css({'height': $('.simple-header').outerHeight()});
    });
    $('.idea-header').each(function() {
        $('.idea-header').css({'height': $('.idea-header-inner').outerHeight()});
    });
    $('.detail-wrapper').each(function() {
        $('.detail-wrapper').css({'height': $('.detail-inner').outerHeight()});
    });
    $('.business-header').each(function() {
        $('.business-header').css({'height': $('.business-header-inner').outerHeight()});
    });
});

$(window).on('load', function() {
    $('.idea-header-inner').addClass('fixed');
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

    if ($('.simple-header').length == 1) {
        if (windowScroll + $('header').outerHeight() >= $('.simple-header').offset().top) {
            $('.simple-header').addClass('fixed');
        } else {
            $('.simple-header').removeClass('fixed');
        }
    }

    if ($('.business-header').length == 1) {
        if (windowScroll + $('header').outerHeight() >= $('.business-header').offset().top) {
            $('.business-header').addClass('fixed');
        } else {
            $('.business-header').removeClass('fixed');
        }
    }

    if ($('.selection-filter-mobile-link').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.selection-filter-mobile-link').addClass('before-footer');
            $('.selection-filter-mobile-link').css({'margin-bottom': $('footer').outerHeight() - 80});
        } else {
            $('.selection-filter-mobile-link').removeClass('before-footer');
            $('.selection-filter-mobile-link').css({'margin-bottom': 0});
        }
    }

    if ($('.detail-order').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.detail-order').addClass('before-footer');
            $('.detail-order').css({'margin-bottom': $('footer').outerHeight() - 80});
        } else {
            $('.detail-order').removeClass('before-footer');
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
            $('.business-link').addClass('before-footer');
            $('.business-link').css({'margin-bottom': $('footer').outerHeight() - 80});
        } else {
            $('.business-link').removeClass('before-footer');
            $('.business-link').css({'margin-bottom': 0});
        }
    }

    $('.simple-download').each(function() {
        var curLink = $(this);
        var curContainer = curLink.parents().filter('.simple-container');
        if (windowScroll + 104 > curLink.offset().top) {
            curLink.addClass('fixed');
            if (windowScroll + 104 + curLink.find('.simple-download-inner').outerHeight() > curContainer.offset().top + curContainer.outerHeight()) {
                curLink.find('.simple-download-inner').css({'margin-top': -((windowScroll + 104 + curLink.find('.simple-download-inner').outerHeight()) - (curContainer.offset().top + curContainer.outerHeight())) + 'px'});
            } else {
                curLink.find('.simple-download-inner').css({'margin-top': 0});
            }
        } else {
            curLink.removeClass('fixed');
            curLink.find('.simple-download-inner').css({'margin-top': 0});
        }
    });

    if ($('.simple-btn').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top + 80) {
            $('.simple-btn').addClass('before-footer');
            $('.simple-btn').css({'margin-bottom': $('footer').outerHeight() - 80});
        } else {
            $('.simple-btn').removeClass('before-footer');
            $('.simple-btn').css({'margin-bottom': 0});
        }
    }

    $('.idea-header').each(function() {
        if (windowScroll > $('.idea-container').offset().top - 104) {
            $('header').removeClass('invert');
        } else {
            $('header').addClass('invert');
        }
    });

    $('.idea-secure').each(function() {
        var curIMG = $(this);
        if (windowScroll + windowHeight > curIMG.offset().top - windowHeight / 3) {
            curIMG.addClass('animate');
        } else {
            curIMG.removeClass('animate');
        }
    });

    if ($('.detail-wrapper').length == 1) {
        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.detail-wrapper').addClass('fixed');
            $('.detail-wrapper').css({'top': ($('.detail-wrapper').outerHeight() - windowHeight - 80) + 'px'});
        } else {
            $('.detail-wrapper').removeClass('fixed');
            $('.detail-wrapper').css({'top': 'auto'});
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
                    url: curForm.attr('attr-action'),
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
            var windowLink = $('.window-link.last-active');
            if (windowLink.length == 1 && typeof windowLink.attr('data-hiddenname') != 'undefined' && typeof windowLink.attr('data-hiddenvalue') != 'undefined') {
                $(this).append('<input type="hidden" name="' + windowLink.attr('data-hiddenname') + '" value="' + windowLink.attr('data-hiddenvalue') + '">');
            }
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

function updateFilterSizesList() {
    $('.selection-filter-size').each(function() {
        $('.selection-filter-size label.visible').removeClass('visible');
        var listBuilds = $('.selection-filter-build input:checked');
        if (listBuilds.length == 0) {
            listBuilds = $('.selection-filter-build input');
        }
        listBuilds.each(function() {
            var curBuild = $(this).attr('value');
            var listRooms = $('.selection-filter-rooms input:checked');
            if (listRooms.length == 0) {
                listRooms = $('.selection-filter-rooms input');
            }
            listRooms.each(function() {
                var curRooms = $(this).attr('value');
                $('.selection-filter-size label').each(function() {
                    var curSize = $(this);
                    if (curSize.attr('data-build').split(',').indexOf(curBuild) != -1 && curSize.attr('data-rooms').split(',').indexOf(curRooms) != -1) {
                        curSize.addClass('visible');
                    }
                });
            });
        });
        updateFilterSize();
    });
}

function updateFilterSize() {
    $('.selection-filter-size').each(function() {
        if ($('.selection-filter-size label.visible input:checked').length > 0) {
            $('.selection-filter-size-text-from').html($('.selection-filter-size label.visible input:checked').eq(0).parent().find('span').html());
            $('.selection-filter-size-text-to').html($('.selection-filter-size label.visible input:checked').last().parent().find('span').html());
        } else {
            $('.selection-filter-size-text-from').html($('.selection-filter-size label.visible input').eq(0).parent().find('span').html());
            $('.selection-filter-size-text-to').html($('.selection-filter-size label.visible input').last().parent().find('span').html());
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
        $('.selection-container').html(html);
        $('.selection-filter-container').removeClass('loading');
        $(window).trigger('scroll');
    });
}