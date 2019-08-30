/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/

/* 01 - VARIABLES */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

jQuery(function($) {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, headerH, winScr, footerTop, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), _isFF = 'MozAppearance' in document.documentElement.style, mainBannerHeight,homePagesOffset;

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
		homePagesOffset = $('#homePage').offset().top;
		mainBannerHeight = $('.mainBanner').outerHeight();
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/
	if(_ismobile) $('body').addClass('mobile');
	_functions.pageCalculations();

	setTimeout( function() {
		$('.preloader').fadeOut(300);
		_functions.initSwiper();
		//counters
		$('.detailInfoWrapper').viewportChecker({
			offset: 100,
			callbackFunction: function(elem, action){
				elem.find('.numberCounter').countTo();		
			}		
		});
	}, 1500);

	/*============================*/
	/* 04 - function on page load */
	/*============================*/
	$(window).load(function(){
		$('body').addClass('loaded');
		$(".customScroll").mCustomScrollbar({
			theme: "minimal-dark", 
            scrollInertia: 1000,
		});
		if ($('.grid').length) {
	        $('.grid').isotope({
		        itemSelector: '.grid-item',
		        layoutMode: 'masonry',
		        percentPosition: true,
		        stamp: ".stamp",
		        masonry: {
		          columnWidth: '.grid-sizer'
		        }
	        });
	    }
		pageScroll();
	    if($(window).width() > 992) {
	    	revealInit();
	    	if ($('.jarallax').length) {
		   		$('.jarallax').jarallax({
				    speed: 0.5
				});
	    	}
	    }
	    animationVisible();
	});

	/*==============================*/
	/* 05 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 06 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	winScr = $(window).scrollTop();
	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
		pageScroll();
		if (winW > 992) {
			animationVisible();
		}
		if (winScr > 400) {
			$('.fixedNav').addClass('showFixedNav');
		} else {
			$('.fixedNav').removeClass('showFixedNav');
		}
	};

	/*=====================*/
	/* 07 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('>.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);

			var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
			if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: slidesPerViewVar,
		        autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
		        loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
				autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
		        breakpoints: ($t.is('[data-breakpoints]'))? { 
		        	767: {slidesPerView: parseInt($t.attr('data-xs-slides'), 10) },
		        	991: {slidesPerView: parseInt($t.attr('data-sm-slides'), 10),  centeredSlides: parseInt($t.attr('data-md-centered'), 10) }, 
		        	1199: {slidesPerView: parseInt($t.attr('data-md-slides'), 10), centeredSlides: parseInt($t.attr('data-md-centered'), 10)}, 
		        	1366: {slidesPerView: parseInt($t.attr('data-lg-slides'), 10)} } : {},
		        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
		        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
		        keyboardControl: true,
		        mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
		        mousewheelReleaseOnEdges: true,
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
				spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
				parallax: (_isFF)?($t.data('parallax'), 0): ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
				centeredSlides: ($t.is('[data-centered]'))?parseInt($t.data('centered'), 10):0,
			});
			swipers['swiper-'+index].update();
			initIterator++;
		});
		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).parent().find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).parent().find('.swiper-control-top').attr('id')];
		});
	};

	/*==============================*/
	/* 08 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	$(document).on('click', '.open-popup', function(){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	});

	$(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(){
		$('.popup-wrapper, .popup-content').removeClass('active');
		$('html').removeClass('overflow-hidden');
		setTimeout(function(){
			$('.ajax-popup').remove();
		},300);
		return false;
	});
	
	//Function OpenPopup
	function openPopup(foo){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+foo+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	}

	//Tabs
	var tabsFinish = 0;
	$('.tab-menu').on('click', function() {
		if($(this).hasClass('active') || tabsFinish) return false;
		tabsFinish = 1;
        var tabsWrapper = $(this).closest('.tabs-block'),
        	tabsMenu = tabsWrapper.find('.tab-menu'),
        	tabsItem = tabsWrapper.find('.tab-entry'),
        	index = tabsMenu.index(this);
        
        tabsItem.filter(':visible').fadeOut(function(){
        	tabsItem.eq(index).fadeIn(function(){
        		tabsFinish = 0;
        	});
        });
        if ($(".responsiveTab").is(':visible')) {
        	$(this).closest('.tabMenuWrapper').slideToggle(600);
        	$('.responsiveTab i').removeClass('iconRotate');
        }
        tabsMenu.removeClass('active');
        $(this).addClass('active');
    });

    //burger-menu
    $('.burger-menu').on('click', function() {
    	$(this).toggleClass('open-menu');
    	$('nav').toggleClass('activeMenu');
    });

    // Responsive tav
    $('.responsiveTab').on('click', function() {
    	$(this).find('i').toggleClass('iconRotate');
    	$(this).closest('.tabs-block').find('.tabMenuWrapper').slideToggle(600);
    });

    //init reveal animate function
	function revealInit(){
		$('.reveal-animate').each(function(){
			$(this).data('top', $(this).offset().top + $(this).outerHeight());
		});
	}

	// Choose template
	$('.scrollToButton').on('click', function(e) {
		e.preventDefault();
		$('body, html').animate({scrollTop: homePagesOffset -80}, 900);
	});

	$('nav p').on('click', function() {
		$(this).parent().find(' >ul').slideToggle(300);
		$(this).parent().find('i').toggleClass('iconRotate');
	});

	$('.fixedNav li').on('click', function() {
		$('.fixedNav li').removeClass('fixNavActive');
		$(this).addClass('fixNavActive');
	});

    function pageScroll() {
		if (winScr > 150) {
			$('header').addClass('pageScrolled');
		} else {
			$('header').removeClass('pageScrolled');
		}
	}

	function animationVisible() {
		$('body.loaded .reveal-animate').each(function(){

				var animateBlockHeight = $(this).outerHeight() - 50;			
				if($(this).data('top')<(winScr+winH) + animateBlockHeight ){
					$(this).addClass('visible');
				} 
			});
	}

});