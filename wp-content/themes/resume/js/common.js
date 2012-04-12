(function($){
	
	//transitionTime
	var EaseTransTime = 350,
		navHeight = null,
		//maxWidth = 960,
		//menuWidth = 900,
		//basePadding = 35,
		easeTiles = false,
		isWebkit = true;
		
		if( typeof WebKitPoint === 'undefined' )
			isWebkit = false;
		// try{
		// 	WebKitPoint;
		// } catch(e) {
		// 	isWebkit = false;
		// }
		
	$(document).ready(function(){
		//console.log('hello common ready');
		
		$('html.ie').length ? Ease.ie = true : Ease.ie = false;
		$('html.lte8').length ? Ease.lte8 = true : Ease.lte8 = false;
		typeof WebKitPoint !== 'undefined' ? Ease.webkit = true : Ease.webkit = false;
				
		//autoMenu();
		navHeight = $('#access').outerHeight();

		//console.log( 'eyt', eyt );

		worksPage();
		//videosPage();
		locationsPage();
		replaceResumeLink();
		scrollToLinks();
		subwayTiles();
		
		$('.page-title strong').tooltip({
			placement: 'right'
			//animation: 'show',
			//title: 'hello',
			//content: 'You can hire me!'
		});
		
	});	


	function scrollToLinks(){
		var links = [
			//{ key: '#work', el: findNavLink('portfolio') },
			{ key: '#about', el: $('#topLink') },
			{ key: '#places', el: $('.page-title strong') },
			{ key: '#contact', el: $('a.contact') }
		];
				
		$.each( links, function(){
			if( $(this.key).length && this.el.length ){
				var $this = this;
				
				var scrollToThis = function(e){
					e.preventDefault();

					var off = $($this.key).offset(),
						scrollTop = $(window).scrollTop();
					
					//lazyload throws off the scroll to elements beneath it.
					//if( off.top - navHeight !== scrollTop ){
						$that = this,
						$args = arguments;
						
						$('html, body').stop(false).animate({scrollTop: off.top - navHeight + 'px'}, 4 * EaseTransTime, function(){
							//if( off.top - navHeight - scrollTop > 300 )
							var off = $($this.key).offset(),
								scrollTop = $(window).scrollTop();

								//console.log( $this, 'scrolling', $(window).height(), off.top - navHeight, scrollTop );
							if( off.top - navHeight - scrollTop > $(window).height() ){
								scrollToThis.apply($that, $args);
							}
						});
					//}
					
					// $('#header').find('.active').removeClass('active');
					// if( $('#header').find(this).length ){
					// 	$this.el.parent().addClass('active');
					// }
					
				};
				
				$this.el.click(scrollToThis);
			}
		});

		links = null;
	}
	
	
	function replaceResumeLink(){
		if( $('#resumeHref').length ){
			var href = $('#resumeHref').text(),
				navlinks = $('#header').find('a'),
				//link = findNavLink('resume');
				link = $('#resume');
						
			if( link ){
				link.attr({
					href: href,
					target: '_blank'
				});
			}
			href = null;
			link = null;
		}
	}
	// 
	// function findNavLink( title ){
	// 	if( !title ) return false;
	// 	
	// 	var navlinks = $('#header').find('a'),
	// 		link = false;
	// 		
	// 		$.each( navlinks, function(){
	// 			if( $(this).text().toLowerCase() == title ){
	// 				link = $(this);
	// 				return false;
	// 			}
	// 		});
	// 		navlinks = null;
	// 		
	// 		return link;
	// }
	// 
	function subwayTiles(){
		//handle click on the stLink to open up the interface, but only do it for webkit cause webkit is awesome
		//var stLink = findNavLink('pictures');
		var stLink = $('#subwayTilesLink');
		
		if( stLink ){
			
			if( !Ease.ie ){

				var wrap = $('#subwayTilesWrap'),
					speed = 250;

				stLink.click( function(e){
					//kills the href on the link
					e.preventDefault();
			
					if ( !easeTiles ) {
						easeTiles = new SyndicatedSubwayTiles({
							wrapId: 'subwayTiles',
							smoothScroll: true
						});
					}
			
					wrap.show( speed );
				});
				
				//click x to close
				$('#closeSubwayTiles').click(function(){
					wrap.hide(speed);
				});

			} else {
				stLink.attr({
					href: 'http://subwaytiles.bennya.com',
					target: '_blank'
				});
			}
			
		}
		stLink = null;

	}

	
	function locationsPage(){
		if ( $('#places').length ){
			var eMap = new EaseMap({
				zoom: 2,
				streetViewControl: true,
				fitMarkers: true,
				//now center on tulsa cause we live in tulsa
				centerLat: 36.153982,
				centerLng: -95.992775,
				dataCont: '#locationList',
				contId: 'gMap',
				dataBlock: '.locationItem',
				dataAttr: 'ease-data',
				locationKey: 'ba_place_address',
				directionsLink: false,
				blocksAreClickable: true
			});
			
		}
	}	
	
	// function videosPage(){
	// 	if( $('#videos').length )
	// 		new EaseYouTubePlayer({
	// 			user: 'nakedincorners',
	// 			playerIsPopup: true,
	// 			//localCallUrl: Ease.TemplateUrl + '/js/videos.php',
	// 			maxResults: 6 //google limit is 50			
	// 		});
	// }
	
	function worksPage(){
		if( $('#work').length ) {
			var cont = $('#work'),
				pics = cont.find('.pics'),
				storeStr = 'store_margin';
			
			var follow_scroll = function(el){
                //var scrollTop = $(window).scrollTop(),
				var	margin_left = parseInt( el.css('margin-left').replace('px',''), 10) || 0,
					margin_top = parseInt( el.css('margin-top').replace('px',''), 10) || 0;
								
				el.data( storeStr, {
					left: margin_left,
					top: margin_top
				});
				
				el.css({
					position: 'fixed',
					top: navHeight,
					left: el.offset().left,
					//marginTop: '1em',
					marginLeft: 0,
					marginTop: 0
				});
				
				margin_left = null;
				margin_right = null;
			}
			
			var unfollow_scroll = function( el, reference_el, unset_top ){
				
				var scrollTop = $(window).scrollTop(),
					top = ( unset_top ? 0 : reference_el.outerHeight() - el.outerHeight() ),
					data = el.data(storeStr);
								
				el.css({
					position: 'relative',
					top: top,
					left: 0,
					marginLeft: data.left,
					marginTop: data.top
				});
				
				scrollTop = null;
				data = null;
				top = null
			};
			
			var bind_it = function(i){
				var $this = $(this),
					menu = $(this).parent().children('.entry-box');
				
				//console.log( $(this), menu );
				
				//lazyload the images
				$this.find('img').each(function(){
					// $('<img />', {
					// 	src: full.url,
					// 	height: full.height,
					// 	width: full.width
					// }).appendTo( cont )
					$(this).lazyload({
			    	 	placeholder : Ease.TemplateUrl+'/images/transparent.gif',
			    	 	effect      : "fadeIn"
						//container	: me.wrap.parent()
			    	});
				});
				
				$this.bind('menuview', {additional_div: menu}, function (event, visible, inOrOut, direction) {
					if( visible ){
						if( inOrOut === 'in' ){
							follow_scroll( menu );
						} else if( direction === 'bottom' ) {
							unfollow_scroll( menu, $this, false );
						} else {
							unfollow_scroll( menu, $this, true );
						}
					}
				});
			};

			pics.each( bind_it );
			
		}		
	}
	
	
})(jQuery);