
(function($) {
    "use strict";
    var cfg = {
        scrollDuration : 800, 
        mailChimpURL   : ''   
    },
    $WIN = $(window);
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);
    var ssPreloader = function() {
        $("html").addClass('ss-preload');
        $WIN.on('load', function() {
            $("#loader").fadeOut("slow", function() {
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');  
        });
    };
    var ssPrettyPrint = function() {
        $('pre').addClass('prettyprint');
        $( document ).ready(function() {
            prettyPrint();
        });
    };
    var ssMoveHeader = function () {
        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight() - 170;
        $WIN.on('scroll', function () {
            var loc = $WIN.scrollTop();
            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }
            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }
            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }
        });
    };
    var ssMobileMenu = function() {
        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');
        toggleButton.on('click', function(event){
            event.preventDefault();
            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });
        if (toggleButton.is(':visible')) nav.addClass('mobile');
        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });
        nav.find('a').on("click", function() {
            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });
    };
    var ssMasonryFolio = function () {
        var containerBricks = $('.masonry');
        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });
    };
    var ssPhotoswipe = function() {
        var items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.item-folio');
            $folioItems.each( function(i) {
                var $folio = $(this),
                    $thumbLink =  $folio.find('.thumb-link'),
                    $title = $folio.find('.item-folio__title'),
                    $caption = $folio.find('.item-folio__caption'),
                    $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                    $captionText = $.trim($caption.html()),
                    $href = $thumbLink.attr('href'),
                    $size = $thumbLink.data('size').split('x'),
                    $width  = $size[0],
                    $height = $size[1];
                var item = {
                    src  : $href,
                    w    : $width,
                    h    : $height
                }
                if ($caption.length > 0) {
                    item.title = $.trim($titleText + $captionText);
                }
                items.push(item);
            });
            $folioItems.each(function(i) {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    var options = {
                        index: i,
                        showHideOpacity: true
                    }
                    var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                });
            });
    };
    var ssSlickSlider = function() {
        $('.testimonials__slider').slick({
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<div class=\'slick-prev\'><i class=\'im im-arrow-left\' aria-hidden=\'true\'></i></div>",
            nextArrow: "<div class=\'slick-next\'><i class=\'im im-arrow-right\' aria-hidden=\'true\'></i></div>",       
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    };
    var ssWaypoints = function() {
        var sections = $(".target-section"),
            navigation_links = $(".header-nav li a");
        sections.waypoint( {
            handler: function(direction) {
                var active_section;
                active_section = $('section#' + this.element.id);
                if (direction === "up") active_section = active_section.prevAll(".target-section").first();
                var active_link = $('.header-nav li a[href="#' + active_section.attr("id") + '"]');
                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");
            },
            offset: '25%'
        }); 
    };
    var ssStatCount = function() {
        var statSection = $(".s-stats"),
        stats = $(".stats__count");
        statSection.waypoint({
            handler: function(direction) {
                if (direction === "down") {
                    stats.each(function () {
                        var $this = $(this);

                        $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (curValue) {
                                $this.text(Math.ceil(curValue));
                            }
                        });
                    });
                } 
                this.destroy();
            },
            offset: "90%"

        });
    };
    var ssSmoothScroll = function() {
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
            e.preventDefault();
            e.stopPropagation();
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing', function () {
                window.location.hash = target;
            });
        });
    };
    var ssPlaceholder = function() {
        $('input, textarea, select').placeholder();  
    };
    var ssAlertBoxes = function() {
        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 
    };
    var ssContactForm = function() {
        /* local validation */
	    $('#contactForm').validate({
            /* submit via ajax */
            submitHandler: function(form) {
                var sLoader = $('.submit-loader');
                $.ajax({
                    type: "POST",
                    url: "inc/sendEmail.php",
                    data: $(form).serialize(),
                    beforeSend: function() { 
                        sLoader.slideDown("slow");
                    },
                    success: function(msg) {
                        // Message was sent
                        if (msg == 'OK') {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').fadeOut();
                            $('#contactForm').fadeOut();
                            $('.message-success').fadeIn();
                        }
                        // There was an error
                        else {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').html(msg);
                            $('.message-warning').slideDown("slow");
                        }
                    },
                    error: function() {
                        sLoader.slideUp("slow"); 
                        $('.message-warning').html("Something went wrong. Please try again.");
                        $('.message-warning').slideDown("slow");
                    }
                });
            }
        });
    };
    var ssBackToTop = function() {
        var pxShow  = 500,
        fadeInTime  = 400,
        fadeOutTime = 400,
        scrollSpeed = 300,
        goTopButton = $(".go-top")
        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };
    (function ssInit() {
        ssPreloader();
        ssPrettyPrint();
        ssMoveHeader();
        ssMobileMenu();
        ssMasonryFolio();
        ssPhotoswipe();
        ssSlickSlider();
        ssWaypoints();
        ssStatCount();
        ssSmoothScroll();
        ssPlaceholder();
        ssAlertBoxes();
        ssContactForm();
        ssBackToTop();
    })();
})(jQuery);