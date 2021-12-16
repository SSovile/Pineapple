/*
 * Script for our theme
 * Written By: Insight
 * */

window.insight = {};

// inViewport
(
	function( $, win ) {
		$.fn.inViewport = function( cb ) {
			return this.each( function( i, el ) {
				function insightVispx() {
					var H = $( this ).height();
					var r = el.getBoundingClientRect();
					var t = r.top;
					var b = r.bottom;
					return cb.call( el, Math.max( 0, t > 0 ? H - t : (
						b < H ? b : H
					) ) );
				}

				insightVispx();
				$( win ).on( 'resize scroll', insightVispx );
			} );
		};
	}( jQuery, window )
);

jQuery( document ).ready( function( $ ) {
	// Centered logo
	jQuery( 'header.header-01 #branding_logo' ).wrap( '<li id="branding_logo_li" class="menu-item"></li>' );
	var menuNum = jQuery( 'header.header-01 nav > ul > li' ).length;
	var menuCenter = parseInt( Math.round( menuNum / 2 ), 10 );
	var menuCenterStr = 'header.header-01 nav > ul > li:nth-child(' + menuCenter + ')';
	jQuery( '#branding_logo_li' ).insertAfter( jQuery( menuCenterStr ) );

	// Scroll to top
	jQuery( '#backtotop' ).on( 'click', function( evt ) {
		$( 'html, body' ).animate( {scrollTop: 0}, 600 );
		evt.preventDefault();
	} );

	// Search
	var topSearch = $( '.top-search' );
	jQuery( '.top-search-btn' ).on( 'click', function() {
		if ( ! topSearch.hasClass( 'open' ) ) {
			topSearch.addClass( 'open' );
			topSearch.slideDown();
			topSearch.find( 'input' ).focus();
		} else {
			topSearch.slideUp();
			topSearch.removeClass( 'open' );
		}
	} );
	jQuery( document ).on( 'click', function( e ) {
		if ( (
			     jQuery( e.target ).closest( topSearch ).length == 0
		     ) && (
			     jQuery( e.target ).closest( '.top-search-btn' ).length == 0
		     ) ) {
			if ( topSearch.hasClass( 'open' ) ) {
				topSearch.slideUp();
				topSearch.removeClass( 'open' );
			}
		}
	} );

	// Counter
	jQuery( '.insight-counter' ).find( '.number span' ).each( function() {
		var v = jQuery( this ).html();
		var o = new Odometer( {
			el: $( this )[0],
			value: 0,
		} );
		o.render();
		jQuery( this ).inViewport( function( px ) {
			if ( px ) {
				o.update( v );
			}
		} );
	} );
	jQuery( window ).trigger( 'scroll' );

	// Mini-cart
	var miniCart = jQuery( '.mini-cart-wrap' );
	miniCart.on( 'click', function( e ) {
		jQuery( this ).toggleClass( 'open' );
	} );
	jQuery( document ).on( 'click', function( e ) {
		if ( jQuery( e.target ).closest( miniCart ).length == 0 ) {
			miniCart.removeClass( 'open' );
		}
	} );

	// Add to cart notification
	jQuery( 'a.add_to_cart_button' ).on( 'click', function() {
		jQuery( 'a.add_to_cart_button' ).removeClass( 'recent-added' );
		jQuery( this ).addClass( 'recent-added' );
	} );
	jQuery( 'body' ).on( 'added_to_cart', function() {
		var productName = jQuery( '.recent-added' ).attr( 'data-product_name' );
		if ( jsVars.noticeAddedCartText != undefined ) {
			if ( productName != undefined ) {
				jQuery.growl.notice( {
					location: 'br',
					title: '',
					message: productName + ' ' + jsVars.noticeAddedCartText.toLowerCase() + ' <a href="' + jsVars.noticeCartUrl + '">' + jsVars.noticeCartText + '</a>'
				} );
			} else {
				jQuery.growl.notice( {location: 'br', fixed: true, title: '', message: jsVars.noticeAddedCartText} );
			}
		}
	} );

	// Wishlist
	$( 'body' ).on( 'woosw_change_count', function( e, count ) {
		$( '.wishlist-wrap .wishlist-btn' ).attr( 'data-count', count );
	} );

	// Cookie notice
	var tmOrganikCookieOk = insightGetCookie( 'tm_organik_cookie_ok' );
	if ( (
		     jsVars.noticeCookieEnable == 1
	     ) && (
		     tmOrganikCookieOk != 'true'
	     ) ) {
		if ( jsVars.noticeCookie != '' ) {
			jQuery.growl( {
				location: 'br',
				fixed: true,
				duration: 3600000,
				title: '',
				message: jsVars.noticeCookie
			} );
			jQuery( '.cookie_notice_ok' ).on( 'click', function() {
				jQuery( this ).parent().parent().find( '.growl-close' ).trigger( 'click' );
				insightSetCookie( 'tm_organik_cookie_ok', 'true', 365 );
				jQuery.growl.notice( {location: 'br', title: '', message: jsVars.noticeCookieOk} );
			} );
		}
	}

	// Popup
	if ( jsVars.popupEnable == 1 ) {
		var popupCtime = Math.floor( Date.now() / 1000 );
		var popupLtime = insightGetCookie( 'tm_organik_popup' );
		if ( popupLtime == '' ) {
			popupLtime = popupCtime;
			setTimeout( function() {
				jQuery( '#woo_popup_btn' ).trigger( 'click' );
				insightSetCookie( 'tm_organik_popup', popupCtime, 365 );
			}, 3000 );
		}
		var popupTime = popupCtime - popupLtime;
		if ( popupTime > jsVars.popupReOpen * 60 ) {
			setTimeout( function() {
				jQuery( '#woo_popup_btn' ).trigger( 'click' );
				insightSetCookie( 'tm_organik_popup', popupCtime, 365 );
			}, 3000 );
		}
	}

	// WooCommerce view switch
	if ( insightGetCookie( 'tm_organik_shop_view' ) != '' ) {
		var shopView = insightGetCookie( 'tm_organik_shop_view' );
	} else {
		var shopView = jsVars.shopDefaultLayout;
	}
	insightViewSwitcher( shopView );
	jQuery( '.switch-view .switcher' ).on( 'click', function() {
		var view = jQuery( this ).attr( 'rel' );
		insightSetCookie( 'tm_organik_shop_view', view, 365 );
		insightViewSwitcher( view );
	} );

	// WooCommerce up-sells slick
	jQuery( '.upsells .products' ).imagesLoaded( function() {
		jQuery( '.upsells .products' ).slick( {
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: false,
						centerMode: false
					}
				}
			]
		} );
	} );

	// WooCommerce recent viewed slick
	jQuery( '.viewed .products' ).imagesLoaded( function() {
		jQuery( '.viewed .products' ).slick( {
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: false,
						centerMode: false
					}
				}
			]
		} );
	} );

	// WooCommerce related slick
	jQuery( '.related .products' ).imagesLoaded( function() {
		jQuery( '.related .products' ).slick( {
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: false,
						centerMode: false
					}
				}
			]
		} );
	} );

	// Slick for all
	jQuery( '.upsells .products, .viewed .products, .related .products' ).on( 'init', function( event, slick ) {
		if ( slick.slideCount <= slick.options.slidesToShow ) {
			jQuery( slick.$dots ).hide();
		}
	} );

	// WooCommerce thumbnails slick
	jQuery( '.woocommerce-product-gallery ol' ).slick( {
		slide: 'li',
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3
	} );

	// WooCommerce qty minus
	$( document ).on( 'click', '.quantity .qty-plus, .quantity .qty-minus', function() {

		// Get values
		var $qty       = $( this ).siblings( '.qty' ),
		    currentVal = parseFloat( $qty.val() ),
		    max        = parseFloat( $qty.attr( 'max' ) ),
		    min        = parseFloat( $qty.attr( 'min' ) ),
		    step       = $qty.attr( 'step' );

		// Format values
		if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) {
			currentVal = 0;
		}
		if ( max === '' || max === 'NaN' ) {
			max = '';
		}
		if ( min === '' || min === 'NaN' ) {
			min = 0;
		}
		if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) {
			step = 1;
		}

		// Change the value
		if ( $( this ).is( '.qty-plus' ) ) {

			if ( max && (
				max == currentVal || currentVal > max
			) ) {
				$qty.val( max );
			} else {
				$qty.val( currentVal + parseFloat( step ) );
			}

		} else {

			if ( min && (
				min == currentVal || currentVal < min
			) ) {
				$qty.val( min );
			} else if ( currentVal > 0 ) {
				$qty.val( currentVal - parseFloat( step ) );
			}

		}

		// Trigger change event.
		$qty.trigger( 'change' );
	} );

	$( document ).on( 'blur', '.quantity .qty', function() {
		var $qty       = $( this ),
		    currentVal = parseFloat( $qty.val() ),
		    max        = parseFloat( $qty.attr( 'max' ) );

		if ( max !== '' && max !== 'NaN' && currentVal > max ) {
			$( this ).val( max );
		}
	} );

	// WooCommerce categories count
	jQuery( '.product-categories .count' ).each( function() {
		var thisCount = jQuery( this ).html();
		jQuery( this ).html( thisCount.replace( '(', '' ).replace( ')', '' ) );
	} );
} );

function insightViewSwitcher( view ) {
	var col = jQuery( '#switch-view-grid' ).attr( 'data-col' );
	jQuery( '.switch-view .switcher' ).each( function() {
		jQuery( this ).removeClass( 'active' );
	} );
	if ( view == 'list' ) {
		jQuery( '#switch-view-list' ).addClass( 'active' );
		if ( ! jQuery( 'body.archive .products' ).hasClass( 'list' ) ) {
			jQuery( 'body.archive .products' ).removeClass( 'grid' ).addClass( 'list' );
			jQuery( 'body.archive .products' ).removeClass( 'row' );
			jQuery( 'body.archive .products .product' ).each( function() {
				jQuery( this ).removeClass( col );
				jQuery( this ).addClass( 'row' );
				jQuery( this ).find( '.product-thumb' ).wrap( '<div class="col-md-4"></div>' );
				jQuery( this ).find( '.product-info' ).wrap( '<div class="col-md-8"></div>' );
			} );
		}
	} else {
		jQuery( '#switch-view-grid' ).addClass( 'active' );
		if ( jQuery( 'body.archive .products' ).hasClass( 'list' ) ) {
			jQuery( 'body.archive .products' ).removeClass( 'list' ).addClass( 'grid' );
			jQuery( 'body.archive .products' ).addClass( 'row' );
			jQuery( 'body.archive .products .product' ).each( function() {
				jQuery( this ).removeClass( 'row' );
				jQuery( this ).find( '.product-thumb' ).unwrap();
				jQuery( this ).find( '.product-info' ).unwrap();
				jQuery( this ).addClass( col );
			} );
		}
	}
}

function insightSetCookie( cname, cvalue, exdays ) {
	var d = new Date();
	d.setTime( d.getTime() + (
		exdays * 24 * 60 * 60 * 1000
	) );
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
}

function insightGetCookie( cname ) {
	var name = cname + '=';
	var ca = document.cookie.split( ';' );
	for ( var i = 0; i < ca.length; i ++ ) {
		var c = ca[i];
		while ( c.charAt( 0 ) == ' ' ) {
			c = c.substring( 1 );
		}
		if ( c.indexOf( name ) == 0 ) {
			return c.substring( name.length, c.length );
		}
	}
	return '';
}

function insightMarkProductViewed( pid ) {
	if ( insightGetCookie( 'tm_organik_viewed_products' ) != '' ) {
		var viewed = insightGetCookie( 'tm_organik_viewed_products' ).split( ',' );
		for ( var i = 0; i < viewed.length; i ++ ) {
			while ( viewed[i] == pid ) {
				viewed.splice( i, 1 );
			}
		}
		viewed.unshift( pid );
		var viewedStr = viewed.join();
		insightSetCookie( 'tm_organik_viewed_products', viewedStr, 7 );
	} else {
		insightSetCookie( 'tm_organik_viewed_products', pid, 7 );
	}
}

// Carousel
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			Carousel: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					$( '.insight-carousel' ).slick( {
						responsive: [
							{
								breakpoint: 1024,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 3,
									infinite: true,
									dots: true
								}
							}, {
								breakpoint: 800,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 2
								}
							}, {
								breakpoint: 480,
								settings: {
									slidesToShow: 1,
									slidesToScroll: 1
								}
							}
						],
						infinite: true,
						draggable: true,
					} );

					// Slider filter
					var $optionSetsPf = $( '.insight-filter' ),
						$optionLinksPf = $optionSetsPf.find( 'a' );
					$optionLinksPf.click( function() {
						var $this = $( this );
						// don't proceed if already selected
						if ( $this.hasClass( 'active' ) ) {
							return false;
						}
						var $optionSet = $this.parents( '.insight-filter' );
						$optionSet.find( '.active' ).removeClass( 'active' );
						$this.addClass( 'active' );
						// make option object dynamically, i.e. { filter: '.my-filter-class' }
						var options = {},
							key = $optionSet.attr( 'data-option-key' ),
							value = $this.attr( 'data-option-value' );

						// parse 'false' as false boolean
						value = value === 'false' ? false : value;

						$( this ).closest( '.insight-product-carousel' ).find( '.products' ).slick('slickUnfilter').slick( 'slickFilter', value );

						return false;
					} );
					$( '.insight-product-carousel .products' ).slick( {
						infinite: false,
						slidesToShow: 3,
						slidesToScroll: 3,
						nextArrow: '<span class="carousel-next ion-ios-arrow-right"></span>',
						prevArrow: '<span class="carousel-prev ion-ios-arrow-left"></span>',
						responsive: [
							{
								breakpoint: 1024,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 3,
								}
							}, {
								breakpoint: 800,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 2
								}
							}, {
								breakpoint: 480,
								settings: {
									slidesToShow: 1,
									slidesToScroll: 1
								}
							}
						],
						draggable: true,
					} );

				},

			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// Menu mobile
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			MenuMobile: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					if ( $( '#open-left' ).length > 0 ) {
						var slideout = new Slideout( {
							'panel': document.getElementById( 'page' ),
							'menu': document.getElementById( 'slideout-menu' ),
							'padding': 256,
							'tolerance': 70,
							'touch': false,
						} );
					}
					// Toggle button
					if ( $( '#open-left' ).length > 0 ) {
						document.querySelector( '#open-left' ).addEventListener( 'click', function() {
							slideout.toggle();
						} );
						$( '#page' ).on( 'click', function( e ) {
							if ( $( e.target ).closest( '#open-left' ).length === 0 ) {
								if ( slideout._opened ) {
									e.preventDefault();
								}
								slideout.close();
							}
						} );
					}

					//show submenu
					var $menu = $( '.mobile-menu' );

					$menu.find( '.sub-menu-toggle' ).on( 'click', function( e ) {
						var subMenu = $( this ).next();

						if ( subMenu.css( 'display' ) == 'block' ) {
							subMenu.css( 'display', 'block' ).slideUp().parent().removeClass( 'expand' );
						} else {
							subMenu.css( 'display', 'none' ).slideDown().parent().addClass( 'expand' );
						}
						e.stopPropagation();
					} );
				},
			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// About shortcode
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			AboutShortcode: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					$( '.insight-about--carousel' ).slick( {
						infinite: true,
						slidesToShow: 4,
						slidesToScroll: 1,
						autoplay: true,
						nextArrow: '<span class="about-next ion-ios-arrow-thin-right"></span>',
					} );
					$( '.insight-about--carousel .slick-track' ).lightGallery( {
						thumbnail: true,
						animateThumb: false,
						showThumbByDefault: false
					} );
				},

			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// MasonryBlog
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			MasonryBlog: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					var $masonry = $( '.blog-grid' );
					$masonry.isotope( {
						itemSelector: '.post',
						percentPosition: true,
					} ).imagesLoaded().progress( function() {
						$masonry.isotope( 'layout' );
					} );
				},

			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// ProductTab
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			ProductTab: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					$( 'body' ).on( 'click', '.insight-product-tab .insight-tab a', function() {
						var thisNav = $( this );
						var thisTab = thisNav.closest( '.insight-product-tab' );
						var dataTab = thisNav.attr( 'data-tab' );
						var dataPerpage = parseInt( thisTab.attr( 'data-perpage' ) );
						var dataOrder = thisTab.attr( 'data-order' );
						var dataOrderby = thisTab.attr( 'data-orderby' );
						thisTab.find( '.insight-tab a' ).removeClass( 'active' );
						thisTab.find( '.insight-tab a[data-tab="' + dataTab + '"]' ).addClass( 'active' );
						thisTab.find( '.products-tab-content-inner' ).removeClass( 'active' );
						thisTab.find( '.products-tab-content-inner[data-tab="' + dataTab + '"]' ).addClass( 'active' );
						if ( ! thisNav.hasClass( 'loaded' ) ) {
							// load products
							var data = {
								action: 'insight_ajax_load_more_tab',
								cat: dataTab,
								order: dataOrder,
								orderby: dataOrderby,
								perpage: dataPerpage,
								page: 1
							};
							$.ajax( {
								method: 'POST',
								url: jsVars.ajaxUrl,
								data: data,
								success: function( response ) {
									thisTab.find( '.products-tab-content-inner[data-tab="' + dataTab + '"] .products' ).append( response );
									thisTab.find( '.products-tab-content-inner[data-tab="' + dataTab + '"] button' ).removeClass( 'loading' );
								}
							} );
							thisNav.addClass( 'loaded' );
						}
					} );

					$( 'body' ).on( 'click', '.insight-product-tab .load-btn button', function( e ) {
						var thisBtn = $( this );
						if ( ! thisBtn.hasClass( 'loading' ) ) {
							var dataTab = thisBtn.attr( 'data-tab' );
							var dataPage = parseInt( thisBtn.attr( 'data-page' ) );
							var thisTab = thisBtn.closest( '.insight-product-tab' );
							var dataPerpage = parseInt( thisTab.attr( 'data-perpage' ) );
							var dataOrder = thisTab.attr( 'data-order' );
							var dataOrderby = thisTab.attr( 'data-orderby' );
							// load products
							var data = {
								action: 'insight_ajax_load_more_tab',
								cat: dataTab,
								order: dataOrder,
								orderby: dataOrderby,
								perpage: dataPerpage,
								page: dataPage
							};
							dataPage = dataPage + 1;
							thisBtn.addClass( 'loading' );
							$.ajax( {
								method: 'POST',
								url: jsVars.ajaxUrl,
								data: data,
								success: function( response ) {
									if ( response == 'end' ) {
										thisBtn.hide();
									} else {
										thisTab.find( '.products-tab-content-inner[data-tab="' + dataTab + '"] .products' ).append( response );
										thisBtn.attr( 'data-page', dataPage ).removeClass( 'loading' );
									}
								}
							} );
						}
						e.preventDefault();
					} );
				}

			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// GalleryLight
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			GalleryLight: {

				init: function() {
					this.build();
					this.filter();
					return this;
				},

				build: function() {
					$( '.insight-gallery-images' ).lightGallery( {
						selector: 'a',
						thumbnail: true,
						animateThumb: false,
						showThumbByDefault: false
					} );
				},

				filter: function() {
					var tmGalleryGrid = $( '.insight-gallery .insight-gallery-images' );
					var bh = tmGalleryGrid.find( '.base-item .insight-gallery-image' ).height();
					var mrgBottom = 30;

					$( window ).resize( function() {
						var tmGalleryGrid = $( '.insight-gallery .insight-gallery-images' );
						var bh = tmGalleryGrid.find( '.base-item .insight-gallery-image' ).height();
						var mrgBottom = 30;
						tmGalleryGrid.find( '.x2' ).height( bh * 2 + mrgBottom );
						tmGalleryGrid.find( '.w-x2' ).height( bh );
					} );

					tmGalleryGrid.isotope( {
						itemSelector: '.insight-gallery-item',
						transitionDuration: '0.4s'
					} ).imagesLoaded().progress( function() {
						tmGalleryGrid.find( '.x2' ).height( bh * 2 + mrgBottom );
						tmGalleryGrid.find( '.w-x2' ).height( bh );
						tmGalleryGrid.isotope( 'layout' );
					} );


					var $optionSets = $( '.insight-gallery-filter ul' ),
						$optionLinks = $optionSets.find( 'a' );
					$optionLinks.click( function() {
						var $this = $( this );
						// don't proceed if already selected
						if ( $this.hasClass( 'active' ) ) {
							return false;
						}
						var $optionSet = $this.parents( '.insight-gallery-filter ul' );
						$optionSet.find( '.active' ).removeClass( 'active' );
						$this.addClass( 'active' );
						// make option object dynamically, i.e. { filter: '.my-filter-class' }
						var options = {},
							key = $optionSet.attr( 'data-option-key' ),
							value = $this.attr( 'data-option-value' );

						// parse 'false' as false boolean
						value = value === 'false' ? false : value;
						options[key] = value;
						if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
							changeLayoutMode( $this, options );
						} else {
							// otherwise, apply new options
							$this.closest( '.insight-gallery' ).find( '.insight-gallery-images' ).isotope( options );
						}
						return false;
					} );
				},

			}
		} );
	}
).apply( this, [window.insight, jQuery] );

// ProductGridFilter filter
(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			ProductGridFilter: {

				init: function() {
					this.build();
					this.loadmore();
					return this;
				},

				build: function() {

					var tmProductGrid = $( '.insight-product-grid .products' );
					tmProductGrid.isotope( {
						itemSelector: '.product',
						transitionDuration: '0.4s'
					} ).imagesLoaded().progress( function() {
						tmProductGrid.isotope( 'layout' );
					} );

					var $optionSets = $( '.insight-grid-filter ul' ),
						$optionLinks = $optionSets.find( 'a' );
					$optionLinks.click( function() {
						var $this = $( this );
						// don't proceed if already selected
						if ( $this.hasClass( 'active' ) ) {
							return false;
						}
						var $optionSet = $this.parents( '.insight-grid-filter ul' );
						$optionSet.find( '.active' ).removeClass( 'active' );
						$this.addClass( 'active' );
						// make option object dynamically, i.e. { filter: '.my-filter-class' }
						var options = {},
							key = $optionSet.attr( 'data-option-key' ),
							value = $this.attr( 'data-option-value' );

						// parse 'false' as false boolean
						value = value === 'false' ? false : value;
						options[key] = value;
						if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
							changeLayoutMode( $this, options );
						} else {
							// otherwise, apply new options
							$this.closest( '.insight-product-grid' ).find( '.products' ).isotope( options );
						}
						return false;
					} );
				},

				loadmore: function() {
					$( '.btn-loadmore' ).on( 'click', function() {
						var boxContainerEl = $( '.insight-product-grid ' + $( this ).data( 'box-container' ) + ' .products' );
						var page = $( this ).data( 'next-page' );
						var maxPages = $( this ).data( 'max-pages' );

						if ( page == 0 ) {
							$( this ).parent().css( {display: 'none'} );
							return;
						}

						$( this ).data( 'next-page', (
							page + 1
						) );
						var $thiss = $( this );

						$( this ).addClass( 'btn-transparent' ).html( '<div class="loading loader-inner ball-pulse"><div></div><div></div><div></div></div>' );
						$.get( $( this ).data( 'url' ) + '=' + page, function( html ) {
							var content = $( html ).find( '.insight-product-grid .products' );
							var $newItems = $( content[0].innerHTML );
							boxContainerEl.isotope( 'insert', $newItems );

							boxContainerEl.imagesLoaded().progress( function() {
								boxContainerEl.isotope( 'layout' );
							} );

							$thiss.removeClass( 'btn-transparent' ).html( $thiss.data( 'text' ) );

							if ( page == maxPages ) {
								$thiss.parent().css( {display: 'none'} );
								return;
							}
							return false;
						} );
					} );
				}
			}
		} );
	}
).apply( this, [window.insight, jQuery] );

(
	function( insight, $ ) {
		insight = insight || {};
		$.extend( insight, {

			Animate: {

				init: function() {
					this.build();
					return this;
				},

				build: function() {
					$( '.tm-animation' ).inViewport( function( px ) {
						if ( px ) {
							$( this ).addClass( 'animate' );
						}
					} );
					$( window ).trigger( 'scroll' );
				}
			}

		} );
	}
).apply( this, [window.insight, jQuery] );

(
	function( insight, $ ) {
		function insightOnReady() {
			// Menu mobile
			if ( typeof insight.MenuMobile !== 'undefined' ) {
				insight.MenuMobile.init();
			}
			// Carousel
			if ( typeof insight.Carousel !== 'undefined' ) {
				insight.Carousel.init();
			}
			// AboutShortcode
			if ( typeof insight.AboutShortcode !== 'undefined' ) {
				insight.AboutShortcode.init();
			}
			// MasonryBlog
			if ( typeof insight.MasonryBlog !== 'undefined' ) {
				insight.MasonryBlog.init();
			}
			// ProductGridFilter
			if ( typeof insight.ProductGridFilter !== 'undefined' ) {
				insight.ProductGridFilter.init();
			}
			// ProductTab
			if ( typeof insight.ProductTab !== 'undefined' ) {
				insight.ProductTab.init();
			}
			// GalleryLight
			if ( typeof insight.GalleryLight !== 'undefined' ) {
				insight.GalleryLight.init();
			}
			// Animate
			if ( typeof insight.Animate !== 'undefined' ) {
				insight.Animate.init();
			}
		}

		$( document ).ready( function() {
			insightOnReady();
		} );
	}.apply( this, [window.insight, jQuery] )
);


// Accordion
(
	function( $ ) {
		$.fn.insightAccordion = function() {
			var thisAcc = this;
			thisAcc.find( '.title' ).on( 'click', function() {
				thisAcc.find( '.item' ).removeClass( 'active' );
				$( this ).parent().addClass( 'active' );
			} );
		};
	}( jQuery )
);
