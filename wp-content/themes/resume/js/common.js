(function($){
	
	//transitionTime
	var EaseTransTime = 350,
		maxWidth = 960,
		menuWidth = 900,
		basePadding = 35,
		easeTiles = false,
		isWebkit = true;
		try{
			WebKitPoint;
		} catch(e) {
			isWebkit = false;
		}
		
	$(document).ready(function(){
		//console.log('hello common ready');
		
		$('html.ie').length ? Ease.ie = true : Ease.ie = false;
		$('html.lte8').length ? Ease.lte8 = true : Ease.lte8 = false;
		typeof WebKitPoint !== 'undefined' ? Ease.webkit = true : Ease.webkit = false;
				
		//autoMenu();


		//console.log( 'eyt', eyt );

		worksPage();
		videosPage();
		locationsPage();
		replaceResumeLink();
		subwayTiles();
	});	


	
	function replaceResumeLink(){
		if( $('#resumeHref').length ){
			var href = $('#resumeHref').text(),
				navlinks = $('#header').find('a'),
				link = findNavLink('resume');
						
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

	function findNavLink( title ){
		if( !title ) return false;
		
		var navlinks = $('#header').find('a'),
			link = false;
			
			$.each( navlinks, function(){
				if( $(this).text().toLowerCase() == title ){
					link = $(this);
					return false;
				}
			});
			navlinks = null;
			
			return link;
	}

	function subwayTiles(){
		//handle click on the stLink to open up the interface, but only do it for webkit cause webkit is awesome
		var stLink = findNavLink('pictures');
		
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
	
	function videosPage(){
		if( $('#videos').length )
			new EaseYouTubePlayer({
				user: 'nakedincorners',
				playerIsPopup: true,
				//localCallUrl: Ease.TemplateUrl + '/js/videos.php',
				maxResults: 6 //google limit is 50			
			});
	}
	
	function worksPage(){
		if( $('#worksTop').length ){
			
	        var bttns = $('#worksTop').find('a'),
				topOff = $('#header').outerHeight() + $('#worksTop').outerHeight(),
				works = $('#works');

			//set the margin on the top in case there are too many buttons pushing down the fixed positioning.
			works.css({ marginTop: $('#worksTop').outerHeight() - 18 });
	
			var bttnClick = function(e){
				e.preventDefault();
                
				var href = $(this).attr('href');
				
				href = href.substr(1, href.length);
                
				var off = $('#works').find("#" + href).offset();
                
				$('html, body').animate({scrollTop: off.top - topOff + 'px'}, 2 * EaseTransTime);
                
				off = null;
                href = null;				
			};
	
	        $.each(bttns, function() {
	            var href = $(this).attr('href');

				if (href && href.indexOf("#") === 0)
	                $(this).click( bttnClick );
	
	            href = null
	        });

	        bttns = null;

			var thumbClick = function(e){
				$(this).addClass('active').siblings().removeClass('active');
				$(this).parent().parent().next().find('img').attr('src', $(this).attr('full'));
			};
			
			works.find('img').click( thumbClick );
			
			//preload the big images
			var pics = works.find('.pics').find('img');
			
			//console.log( pics );
			
			var preloadBigPics = function(){
				var src = $(this).attr('full');
				
				var img = new Image();
				img.src = src;
				return;
			};
			
			$.each( pics, preloadBigPics );
			
			pics = null;
			works = null;
		}
		
	}
	
/*	
	function pageReadMore(){
//		if ( $('.page-read-more').length ){
//			var readMore = $('.page-read-more'),
		if ( $('.entry-content .more-link').length ){
			var readMore = $('.entry-content .more-link'),
				rest = $('.entry-full');
			
			rest.find('span[id]').each(function(){
				$(this).siblings('br').remove();
				$(this).remove();
			});	
			
			//readMore.append('<div class="tri"></div>').click(function(e){
			readMore.click(function(e){
				
				e.preventDefault();
				
				$(this).fadeOut(EaseTransTime);
				rest.slideDown(EaseTransTime * 2, function(){
					$(window).trigger('resize');
				});
				
				//return false;
			});;
		}
	}
*/	
	
	//this project has a right and a left primary nav menu.
	function autoMenu(){
		if ( $('#header nav').length ) {
			
			$('#header nav').each(function(){
				
				var nav = $(this),
					lis = $(this).find('li'),
					innerMargin = 75;
		
				var sizeItUp = function(){
								
					//make total item width
					var lisW = 0;
					
					lis.each(function(){
						lisW += $(this).width();
					});
					
					//now calculate the right margin for the lis
					//var margin = Math.floor( ( nav.width() - lisW ) / (lis.length - 1) - 3 );
					var margin = Math.floor( ( menuWidth/2 - innerMargin - basePadding - lisW ) / (lis.length - 1) - 3 );
					
					if( nav.is('#accessLeft') ){
						//console.log('accessLeft', nav );
						lis.not(':first').css({ marginLeft: margin });
					} else {
						//console.log('accessRight', nav );
						lis.not(':last').css({ marginRight: margin });
					}
					
					//lis.not(':last').css({ marginRight: margin });
				};
				
				//size up the menu		
				$(window).resize( sizeItUp );
				
				//find the current_page item if it is a special post type archive
				lis.each(function(){				
					if ( $(this).find('a').attr('href') === window.location.href ) {
						$(this).addClass('current-menu-item current_page_item');
					}
				});
				
			});
						
//			var sizeItUp = function(){
//				if ( $(window).width() >= maxWidth ){
//				
//					//to make total item width
//					var	lisW = 0;
//					
//					lis.each(function(){
//						lisW += $(this).width();
//					});
//					
//					//now calculate the right margin for the lis
//					var margin = Math.floor( ( nav.width() - lisW ) / (lis.length - 1) - 3 );
//					
//					lis.not(':last').css({ marginRight: margin });
//					
//					//console.log('fit those nav items', nav, nav.width(), lisW, margin);
//				}
//			};

			//size up the menu		
			$(window).resize();
			
			
		}
	}
	
	
})(jQuery);


  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28492745-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();