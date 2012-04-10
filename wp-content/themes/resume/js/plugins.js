// place any jQuery/helper plugins in here, instead of separate, slower script files.


/*
 * Try/Catch the console
 */
try{
    console.log('Hello Console.');
} catch(e) {
    window.console = {};
    var cMethods = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");
    for (var i=0; i<cMethods.length; i++) {
        console[ cMethods[i] ] = function(){};
    }
}


/**
 * Original author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 * this is a modified version made for Jordan Price
 */
(function ($) {
	//BA - I added this because I want to work with the fixed positioning
	var navHeight = $('#access').outerHeight();
	
    $.fn.menuview = function(options) {
    	options = $.extend({
     	    optionOne: 'defaultValue',
            optionTwo: { partOne: 'defaultValue' }
	}, options)};

    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
		var outDirection = 'out';
		var inDirection = 'in';
		var topDirection = 'top';
		var bottomDirection = 'bottom';
		var vpH = getViewportHeight(),
			scrolltop = (document.documentElement.scrollTop ?
			    document.documentElement.scrollTop :
			    document.body.scrollTop),
			elems = [];

		//BA = ADD THE FIXED NAV HEIGHT TO IT;
        scrolltop = scrolltop + navHeight;


		// naughty, but this is how it knows which elements to check for
		$.each($.cache, function () {
			if (this.events && this.events.menuview) {
				if(this.events.menuview){
					var lMainDiv = $(this.handle.elem);
					var lAssociatedDiv = this.events.menuview[0].data["additional_div"];
					lMainDiv.data('associated_div', lAssociatedDiv);
		//			$(this.handle.elem).data('associated_div', this.events.menuview[0]["additional_div"]);
				}
				
				elems.push(this.handle.elem);
			}
		});

	        if (elems.length) {
	            $(elems).each(function () {
	                var $el = $(this),
	                    top = $el.offset().top,
	                    height = $el.height(),
	                    menuview = $el.data('menuview') || false;
					var $item = $el.data('associated_div');
					var lDivHeight = $item.height();


	                if (scrolltop < top || scrolltop + vpH > top + height + (vpH - lDivHeight)) {
	                    if (menuview) {
							var lDirection;
							if(scrolltop + navHeight + vpH > top + height + (vpH - lDivHeight) )
								lDirection = bottomDirection;
							else if(scrolltop + navHeight < top){
								lDirection = topDirection;
						}	
	                        $el.data('menuview', false);
	                        $el.trigger('menuview', [ true, outDirection, lDirection ]);                        
	                    }
                	} else if ( scrolltop >= top - lDivHeight || 
			     		scrolltop + vpH <= top + height
					) {
                    	if (!menuview) {
			
							var lDirection = topDirection;
							if(scrolltop + vpH > top + height){
								lDirection = bottomDirection;
						}
                        $el.data('menuview', true);
                        $el.trigger('menuview', [ true, inDirection, lDirection ]);
                    }
                }
            });
        }
    });
    
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'menuview'
    $(function () {
        $(window).trigger('scroll');
    });
})(jQuery);



(function($){

	function EaseYouTubePlayer(config){
		//default configurable variables
		var me = this,
			defaults = {
				user: 'benjrallen',
				playlist: false,
				maxResults: 8, //google limit is 50
				page: 1,
				playerId: 'easeYtPlayer',
				playerContId: 'easeVideoPlayer',
				thumbsContId: 'easeVideoBlocks',
				loadingMaskId: 'easeLoadingMask',
				thumbBlockClass: 'easeThumbBlock',
				imgContClass: 'easeImg',
				imgLinkClass: 'easeImgLink',
				imgClass: 'easeVideoThumb',
				titleEl: 'div',
				titleClass: 'easeThumbTitle',
				descClass: 'easeDesc',
				playClass: 'easePlay',
				playText: 'Play',
				playerCloseId: 'easeClose',
				playerIsPopup: false, //used to decide if we need to lightbox and position the player or not
				playerCloseText: 'x',
				playerMaxHeight: 853,
				playerPercent: 0.8,
				playerRatioW: 16, //used when calculating dimensions.  default ratio is 16/9
				playerRatioH: 9, //used when calculating dimensions.  default ratio is 16/9
				paginateContId: 'easePagin',
				navClass: 'easeNav',
				navPrevText: '<< Prev',
				navNextText: 'Next >>',
				//no longer make the local call
				//localCallUrl: window.location.protocol + '//' + window.location.host + window.location.pathname + 'js/videos.php',
				flashPlayerSrc: 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js' //used in lte7, google cdn by default
			};
	
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
	
		for (var key in defaults) {
			me[key] = defaults[key];
		}
	
		//non-configurable constants
		me.CONSTANT = 'constant';
		
		//for communicating with google api
		me.API_URL = 'https://gdata.youtube.com/feeds/api/videos';
		me.API_USER_UPLOADS = 'https://gdata.youtube.com/feeds/api/users/'+me.user+'/uploads';
		me.API_USER_PLAYLISTS = 'https://gdata.youtube.com/feeds/api/users/'+me.user+'/playlists';
		me.API_PLAYLIST_FEED = 'https://gdata.youtube.com/feeds/api/playlists/';
//		me.ALT = 'json-in-script';
		me.ALT = 'jsonc';
		me.START_INDEX = null; //gets update in init
		me.TOTAL_ITEMS = null; //get set in json callback
		
		me.LOADING = true;
		me.loadTimeout = null;
		me.swfTimeout = null;
		me.FIRST_LOAD = true;
		me.CURRENT_VIDEO = null;
		me.player = null;
		me.showPlayer = false;
		me.IS_LTE7 = $('.lte7').length;
		me.IS_LTE8 = $('.lte8').length;
		me.IS_FLASH = false;
		
		me.API_READY = false;
		me.PLAYER_READY = false;
		
		//me.init();
		me.init = function(){	
			
			//load the youtube player.  SWFObject if lte IE7, else iFrameAPI	
			me.IS_LTE7 ? me.loadSWFObject() : me.loadIFrameAPI();
			//me.loadSWFObject();
			
			//find playerCont and blocks cont
			me.playerCont = $('#'+me.playerContId);
			me.thumbsCont = $('#'+me.thumbsContId);
			//return alert if not there.
			if ( !me.playerCont.length || !me.thumbsCont.length )
				return alert('script won\'t run because video script has no place to put the player or the videos! please provide ids.');
			
			//position thumbsCont as relative (do it here in case container used elsewhere in site)
			me.thumbsCont.addClass('easeVideos'); //added for css
			
			//update start index
			me.updateStartIndex();
			
			
			//find and define loading mask
			me.loadingMask = $('#'+me.loadingMaskId);
			//if not there, create it
			if (!me.loadingMask.length)
				me.loadingMask = $('<div />', { id: me.loadingMaskId }).prependTo( me.thumbsCont );
			
			//show it in case it is hidden
			me.loadingMask.show();
			
			if( me.playerIsPopup ){
				//find and define playerClose button
				me.playerClose = $('#'+me.playerCloseId);
				//not there? create it.
				if (!me.playerClose.length)
					me.playerClose = $('<a />', { 
						id: me.playerCloseId, 
						text: me.playerCloseText, 
						title: 'Close video'
					}).insertBefore( me.playerCont );
							
				//attach the handler to the body
				$('body').click(me.onPlayerClose);

				//attach window resize and document scroll paramaters
				$(window).resize(me.positionPlayer);
				$(document).scroll(me.positionPlayer);
			}
			
			//get the data... running through our own little url getter script cause IE can't do cross-domain http requests.  PHP can, and it will send us back the data.
			return me.getVideos();
		};
		
		//gets called for the iframe being ready, or when swfobject is loaded
		me.onYouTubePlayerAPIReady = function(){
			me.API_READY = true;
			return me.loadPlayer();
		};

		//loads the iframe api asynchrounously per google's examples
		me.loadIFrameAPI = function(){			
			//set the playerAPIReady function global for the api load ~event to work
			window['onYouTubePlayerAPIReady'] = me.onYouTubePlayerAPIReady;		

			var tag = document.createElement('script');
			tag.src = 'http://www.youtube.com/player_api';
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			//this inserts into the head, and calls a global function (onYouTubePlayerAPIReady)... defined and exposed below.
		};
		
		me.checkForSWFObject = function(){
			return ( typeof swfobject === 'undefined' ? me.swfTimeout = setTimeout( me.checkForSWFObject, 10 ) : me.onYouTubePlayerAPIReady() );
		};
		
		//used for IE7 and below, to load swfObject. (there has to be a better way to do this. . . )
		me.loadSWFObject = function(){
			me.IS_FLASH = true;
			
			var tag = document.createElement('script');
			//tag.onload = me.flashPlayerLoaded;
			tag.src = me.flashPlayerSrc;
			tag.async = true;
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
			return me.checkForSWFObject();
		};
		
		//USED ONLY TO LOG OUT PLAYLISTS SO WE CAN GRAB THE IDS TO LOAD THE LIST FOR CLIENT
		me.getUserPlaylists = function(){
			if( me.user ){
				var request = {
					alt: me.ALT,
					v: 2	
				};
				
				return $.getJSON( me.API_USER_PLAYLISTS+'?callback=?', request, function(json){
					console.log('user: '+me.user+', playlists: ', json);
				});
			}
		};
		
		//TODO:  only use local php shiv if necessary (thinking IE here)
		me.getVideos = function(){
			var request = {
				//apiUrl: me.API_USER_UPLOADS,
				alt: me.ALT, //alt is json-c, which somehow magically gets around parsing of json data and cross-domain origin restrictions... but ie can't natively handle it.
				'max-results': me.maxResults,
				'start-index': me.START_INDEX,
				v: 2 //api version 2... defaults to 1
			};
			//console.log( 'me.getVideos', request );
						
			var url = ( me.playlist ? me.API_PLAYLIST_FEED + me.playlist : me.API_USER_UPLOADS ); 
			
			//get the data... append callback=? to make the request for jsonp.
		 	return $.getJSON( url+'?callback=?', request, me.printVideoBlocks );
		};
		
		
		//used as callback on load user videos
		me.printVideoBlocks = function(json, status){
			//console.log('me.printVideoBlocks', json );
			
			me.LOADING = false;
			
			if (status === "success" && json.data) {
				
				if ( json.data.items ) {
					//set total items
					me.TOTAL_ITEMS = json.data.totalItems;
					
					//remove container and paginating if existing already
					$('.easeCont, #'+me.paginateContId).remove();
					
					//make continer
					var cont = $('<div />', {}).addClass('easeCont').appendTo( me.thumbsCont );
					
					//make a block for each video returned
					for (var i=0, j=json.data.items.length; i<j; i++) {
						//playlist feed is different than video feed;
						var video = ( me.playlist ? json.data.items[i].video : json.data.items[i] );
						me.makeVideoBlock( video ).appendTo( cont );
						video = null;
					}
					
					//make the pagination
					if ( json.data.totalItems > me.maxResults )
						me.makePagination().insertAfter( me.thumbsCont );
					
					//loaded!
					me.loadingMask.hide();
					
					//open first video in player
					if (me.FIRST_LOAD) {
						me.FIRST_LOAD = false;
						me.CURRENT_VIDEO = ( me.playlist ? json.data.items[0].video : json.data.items[0] );
						//me.loadPlayer();
					}
				} else {
					//no items returned... this is a weird case when a playlist contains 'rejected' videos that youtube won't dish out.  case i have seen is that it is a duplicate video to one already uploaded.  if that is the only video being fetched when the new pageblock loads, nothing will show.
					
					//so, let's load the first page instead, as long as it's not supposed to be the first load.
					if( !me.FIRST_LOAD ){
						me.page = 1;
						//update start index
						me.updateStartIndex();						
						me.LOADING = true;
						return me.getVideos();
					}
				}
			} else if ( json.error && json.error.message ){
				me.thumbsCont.text( json.error.message );
			}
		};
		
		//callback for loading the youtube flash embed
		me.onYouTubePlayerReady = function(playerId){
			me.onPlayerReady(); //sets a variable
			//set the player
			return me.player = document.getElementById( playerId );
		};
		
		me.loadPlayer = function(){
			//console.log('load player', me.CURRENT_VIDEO);
			if ( !me.API_READY || !me.CURRENT_VIDEO )
				return me.loadTimeout = setTimeout( me.loadPlayer, 10 );
			
			var dim = me.makePlayerDimensions();
			
			if( !me.IS_FLASH ){		
				
			    me.player = new YT.Player( me.playerContId, {
				//return me.player = new YT.Player( me.playerContId, {
			    	height: dim.playerHeight,
			    	width: dim.playerWidth,
			    	videoId: me.CURRENT_VIDEO.id,
			    	events: {
			    		'onReady': me.onPlayerReady
			    	}
			    }); 
			
				//return me.playerCont = $('#'+me.playerContId);
			} else {
				//we are using the flash player				
				//set the global player ready callback
				window['onYouTubePlayerReady'] = me.onYouTubePlayerReady;
				
				var params = { allowScriptAccess: 'always' };
				var atts = { id: me.playerContId };
				swfobject.embedSWF(
					//swfUrlStr - the video location string with added params
					'http://www.youtube.com/v/'+me.CURRENT_VIDEO.id+'?enablejsapi=1&playerapiid='+me.playerContId+'&version=3',
					//replaceElemIdStr
					me.playerContId,
					//widthStr
					dim.playerWidth,
					//heightStr
					dim.playerHeight,
					//swfVersionStr
					'8',
					//xiSwfUrlStr - (Optional) Specifies the URL of your express install SWF. Not used in this example.
					null,
					//flashVarsObj - (Optional) Specifies your FlashVars in name:value pairs. Not used in this example.
					null,
					//parObj - parameters for embed object
					params,
					//AttObj - attributes for the embed object
					atts
				);
			}

			return me.playerCont = $('#'+me.playerContId);
		};
		
		me.onPlayerReady = function(){
			me.PLAYER_READY = true;
		};
		
		//this is used to calculate the optimal dimensions for the player to be used in different places in this class
		me.makePlayerDimensions = function(){			
			var bW = $(window).width(),
				bH = $(window).height(),
				pW = 0,
				pH = 0;
			
			//if player is lightbox style, then numbers are based on the window width & height
			if ( me.playerIsPopup ){
				var adjW = Math.floor( bW * me.playerPercent );
				
				//uses 16/9 ratio for the window
				if ( bW < bH ){
					pW = adjW;
				} else {
					pW = Math.floor( bH * me.playerPercent * me.playerRatioW / me.playerRatioH );
				}
	
				if ( pW > adjW )
					pW = adjW;
				
				if ( pW > me.playerMaxHeight )
					pW = me.playerMaxHeight;
				
				pH = Math.floor( me.playerRatioH / me.playerRatioW * pW );
				//set after condition

			} else {
				//otherwise, player hight is based on the width of the container
				pW = $('#'+me.playerContId).width();
				
			}

			pH = Math.floor( me.playerRatioH / me.playerRatioW * pW );
			//console.log( 'player dimensions', bW, pW, bH, pH );
			
			return {
				baseWidth: bW,
				baseHeight: bH,
				playerWidth: pW,
				playerHeight: pH
			};
		};

		me.positionPlayer = function(){			
			if ( me.player && me.showPlayer && me.PLAYER_READY ) {
				var	dimensions = me.makePlayerDimensions(),
					bW = dimensions.baseWidth,
					bH = dimensions.baseHeight,
					pW = dimensions.playerWidth, //player width
					pH = dimensions.playerHeight;
				
				//console.log( 'position player', dimensions, bW, bH, pW );
								
				var left = Math.floor( (bW - pW) /2 ),
					//top = Math.floor( $(document).scrollTop() + bH * 0.1 );
					top = Math.floor(  bH * 0.1 );
					
				//console.log( 'positionPlayer', $(me.player), me.player.getPlaybackQuality() );		
				//player.width( pW ).height( pH );
				
				//flash player size is set by dimensions of container, iframe by an API method
				!me.IS_FLASH ?
					me.player.setSize( pW, pH ) :
					me.playerCont.width( pW ).height( pH );
				
				me.playerCont.css({ left: left, top: top });
				
				//console.log( me.playerCont, left);
				me.playerClose.css({ left: left + pW, top: top });
			}
		};
		
		me.loadVideo = function(){
			//console.log( 'me.loadVideo', me.CURRENT_VIDEO, me.player, me.PLAYER_READY);
			//if (me.player) {
			if (me.player && me.PLAYER_READY) {
				me.showPlayer = true;
				me.player.loadVideoById( me.CURRENT_VIDEO.id, 0, 'large');
				
				//position it?
				if( me.playerIsPopup )
					me.positionPlayer();
				
				me.player.playVideo();
			}			
		};
		
		me.closePlayer = function(){
			if (me.player && me.showPlayer) {
				me.showPlayer = false;
				me.player.stopVideo();
								
				//$(me.player).css({ left: -10000 });
				me.playerCont.css({ left: -10000 });
				me.playerClose.css({ left: -10000 });
			}
		};
		
		me.makePagination = function(){
			var block = $('<div />', {
					id: me.paginateContId
				});
			
			//clearfix
			$('<div />').addClass('clearfix').appendTo( block );
			
			//prev button
			$('<a />', { text: me.navPrevText }).addClass( me.navClass+' prev' ).click( me.onPaginClick ).appendTo( block );
			
			//next button
			$('<a />', { text: me.navNextText }).addClass( me.navClass+' next' ).click( me.onPaginClick ).appendTo( block );
			
			//text
			$('<span />', {
				text: 'Page '+me.page+' of '+Math.ceil( me.TOTAL_ITEMS / me.maxResults )
			}).appendTo( block );
			
			//clearfix
			$('<div />').addClass('clearfix').appendTo( block );
			
			return block;
		};
		
		//makes dom element with proper handlers?
		me.makeVideoBlock = function( item ){
			if ( !item ) return false;
			//console.log('me.makeVideoBlock', item );
			
			//create the block, attach data and click handler
			var block = $('<div />', {}).addClass(me.thumbBlockClass).data({ itemData: item }).click(me.onBlockPlay);
			
			if ( item.thumbnail.sqDefault ) {
				$('<div />', {
					html: '<a class="'+me.imgLinkClass+'" title="'+(item.title||'')+': '+(item.description||'')+'"><img src="'+item.thumbnail.sqDefault+'" class="'+me.imgClass+'" /></a>'
				}).addClass( me.imgContClass ).appendTo( block );
			}
			
			if ( item.title ) {
				$('<'+me.titleEl+' />', {
					//html: '<a>'+item.title+'</a>'
					html: item.title
				}).addClass( me.titleClass ).appendTo( block );
			}
			
			if ( item.description ) {
				$('<div />', {
					html: item.description
				}).addClass( me.descClass ).appendTo( block );
			}
			
			$('<a />', {
				text: me.playText
			}).addClass( me.playClass )
			//.click( me.onBlockPlay )
			.appendTo( block );

			return block;
		};
		
		me.onPaginClick = function(e){
			//console.log('onPaginClick!', e, $(this));
			if (!me.LOADING) {
				
				if ( $(this).hasClass('next') ){
					//go next
					me.page === Math.ceil( me.TOTAL_ITEMS / me.maxResults ) ?
						me.page = 1 :
						me.page++;
				} else {
					//go prev
					me.page === 1 ?
						me.page = Math.ceil( me.TOTAL_ITEMS / me.maxResults ) :
						me.page--;
				}
				
				//update start index
				me.updateStartIndex();
	
				//show loadingMask case it is hidden
				me.loadingMask.show();
				
				me.LOADING = true;
				
				return me.getVideos();
			}
		};
		
		me.onPlayerClose = function(e){
			//console.log('onPlayerClose', e, $(this), e.target );
			//prevent click on player from closing the player
			if ( e.target !== me.player )
				me.closePlayer();	
		};
		
		me.onBlockPlay = function(e){
			//console.log('onBlockPlay!', e, $(this));
			e.stopPropagation();
			
			me.CURRENT_VIDEO = $(this).data('itemData');
			
			return me.loadVideo();			
		};
		
		me.updateStartIndex = function(){
			return me.START_INDEX = ( (me.page - 1) * me.maxResults + 1 );
		};
		
		me.init();
	};

	window['EaseYouTubePlayer'] = EaseYouTubePlayer;
	
})(jQuery);



(function($){
		
	//google maps custom integration
	function EaseMap(config){
		//default configurable variables
		var me = this,
			defaults = {
				zoom: 4,
				//center on Salina kansas for good full us view
				centerLat: 38.7902935,
				centerLng: -97.64023729999997,
				mapHeight: 380,
				minZoom: 3, //used to set the zoom level on marker click
				fitMarkers: false, //fit all the markers on the map?  overrides centerLatLng and zoom
				contId: 'gmapCont',
				dataCont: '.distributor-wrap',
				dataBlock: '.distributor',
				dataAttr: 'dist-data',
				locationKey: 'distributor_street_address',
				fallbackLocationKey: 'distributor_mailing_address',
				zoomControlStyle: 'DEFAULT',
				streetViewControl: false,
				scrollwheel: false,
				mapTypeId: 'ROADMAP',
				blocksAreClickable: false,
				directionsLink: false,
				globalInitID: 'EaseMapInit' //used to expose the setupConstants (used in init) function globally for googles async callback... change this to something unique for each instance running
			};
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
		for (var key in defaults) {
			me[key] = defaults[key];
		}
		
		me.loadingGoogle = false;
		
		//here i am going to load the 
		me.setupConstants = function(){
			if ( typeof google !== 'undefined' ) {
				
				//remove global access to this setup function
				if ( window[me.globalInitID] )
					window[me.globalInitID] = undefined;
				
				//constants
				me.loadingGoogle = false;
				
				me.infowindow = new google.maps.InfoWindow();
				
				me.directionsService = new google.maps.DirectionsService();
				//me.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
				me.directionsDisplay = new google.maps.DirectionsRenderer();
				//keep that map out of it for now.
				me.directionsDisplay.setMap( null );
				//geocoder used to take address and convert it to latLng and make marker
				me.geocoder = new google.maps.Geocoder();
				me.center = null;
				me.cont = null;
				me.map = null;
				me.form = null;
				me.startAddy = '';
				me.endAddy = '';
				me.currentRoute = null;
				me.confirmBttn = null;
				//me.waypoints = [];
				me.dblclickListener = null;
			
				me.data = [];
				me.markers = [];
				
				return me.init();
				
			} else {
				//console.log('no google');
				
				if (!me.loadingGoogle) {
					me.loadingGoogle = true;

					//make this setup function available globally
					window[me.globalInitID] = me.setupConstants;
					
					var script = document.createElement("script");
					script.type = "text/javascript";
					script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback="+me.globalInitID;
					document.body.appendChild(script);
				}
				
				
			}
		};
		
		me.init = function(){
			//console.log('herro init', me, 'google', google);
			
			
			//gather data from page elements
			me.setupMarkerData();

			//console.log( 'data', me.data );
			
			//setup the map and initialize it.
			me.setupMap();

			//setup markers
			me.setupMarkers();
						
		};
		
		me.setupMap = function(){
			//find the container
			me.cont = document.getElementById( me.contId );
			
			//check dimensions
			if ( !$(me.cont).height() )
				$(me.cont).height( me.mapHeight );
			
			//console.log( 'me.cont', $(me.cont).width(), $(me.cont).height() );
			
			//set the google center
			me.center = new google.maps.LatLng( me.centerLat, me.centerLng );
			
			//get the map
			me.map = new google.maps.Map( me.cont, {
				center: me.center,
				zoom: me.zoom,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle[ me.zoomControlStyle ]
				},
				streetViewControl: me.streetViewControl,
				scrollwheel: me.scrollwheel,
				mapTypeId: google.maps.MapTypeId[ me.mapTypeId ]
			});

		};
		
		me.setupMarkers = function(){
			if ( me.data.length ) {
				//start bounds here for fitmarkers option later down
				var latLngBounds = new google.maps.LatLngBounds();
				
				//iterate through markers
				$.each(me.data, function(i){
					//console.log( i, this );

					var dataObj = this,
						address = dataObj[ me.locationKey ] || dataObj[ me.fallbackLocationKey ];
					
					if ( address ) {
					
						//console.log( 'address', address, me.stripTags( address ) );
						me.geocoder.geocode({
							
							address: me.stripTags( address )
							
						}, function(results, status){
							
							if (status === google.maps.GeocoderStatus.OK) {
								
								me.markers[i] = new google.maps.Marker({
									map: me.map,
									position: results[0].geometry.location,
									item: dataObj
								});
								
								//bind the click listener
								google.maps.event.addListener( me.markers[i], 'mousedown', me.handleMarkerClick );
								
								//attach click handler to block if set
								if ( me.blocksAreClickable ) {
								
									$(dataObj.DOM).attr({ markerIndex: i }).mousedown( me.handleBlockClick ).find('a').click(me.preventBlockLinks);
									
								}
																
								if (me.fitMarkers) {
									//extend the auto bounds
									latLngBounds.extend( me.markers[i].position );
									me.map.fitBounds( latLngBounds );
								}
								
								//console.log( dataObj.DOM );
							} else {
								//something went wrong.
								alert("Geocode was not successful for the following reason: " + status);
							}
						});
					}
					
				});
//				
//				//add an idle listener to fit the markers
//				if (me.fitMarkers) {
//					//console.log( 'BOUNDS', new google.maps.LatLngBounds() );
//					google.maps.event.addListenerOnce(me.map, 'idle', function(){
//						//console.log( 'IDLE', me.markers)
//						var latLngBounds = new google.maps.LatLngBounds();
//						for ( var l=0; l<me.markers.length; l++ ){
//							latLngBounds.extend( me.markers[l].position );
//						}
//						me.map.fitBounds( latLngBounds );
//						
//					});
//				}
			}
		};
		
		me.preventBlockLinks = function(e){
			e.preventDefault();
		};
		
		me.handleBlockClick = function(e){
			//find associated marker, and setup the coords like google does
			var marker = me.markers[ $(this).attr('markerIndex') ],
				coords = { latLng: marker.position };
			
			//at least put the map a little bit lower
			if( me.map.getZoom() < me.minZoom )
				me.map.setZoom( me.minZoom );

			//console.log('me.handleBlockClick', e, this, marker, coords);
			return me.handleMarkerClick.apply( marker, [coords] );
		};
		
		me.handleMarkerClick = function(coords){

			//console.log('me.handleMarkerClick', coords, this);

			var content = '<div class="mapInfoDom">'+$(this.item.DOM).html();			
			
			//here is where we print out a directions link
			if (me.directionsLink) {
				var addy = this.item[me.locationKey].replace(/ /g,'+').replace(/\n/g,',+'),
					//dUrl = 'http://maps.google.com/maps?saddr=&daddr='+addy+'&z=14'
					dUrl = 'http://maps.google.com/maps?saddr=&daddr='+addy
				
				//console.log( addy );
				
				content += '<a class="directionsLink" href="'+dUrl+'" title="Get directions to this site" target="_blank">Get Driving Directions</a>';
			}
			
			content += '</div>';
			
			//console.log( this.item.DOM );
			
			me.infowindow.setContent( content );				
									
			me.infowindow.open(me.map, this);
			
		};


		me.setupMarkerData = function(){
			//dataBlock supplied in config
			return $(me.dataCont).find(me.dataBlock).each(function(){
				//console.log( $(this).attr( me.dataAttr ) );
				var item = JSON.parse( $(this).attr( me.dataAttr ) );
				//var item = JSON.parse( $(this).find( '.'+me.dataAttr ).text() );
				item.DOM = this;
				me.data.push( item );
			});			
		};
		
		//used to clean the address html for google.
		me.stripTags = function(s){
			//s = String
			if (typeof s !== 'string')
				return false;
			return s.replace(/<([^>]+)>/g,'').replace(/\n|\r/g,' ');
			//return s.replace(/\\n/g,'');
		};
		
		
		//following block not in use for my resume site
		/*
		me.getRoute = function(){
			//console.log( 'me.getRoute', me.startAddy, me.endAddy, me.waypoints );
			me.directionsService.route({
				//origin: ttp.geo.userLocation,
				origin: me.startAddy,
				destination: me.endAddy,
				travelMode: google.maps.TravelMode.DRIVING,
				optimizeWaypoints: true,
				waypoints: me.waypoints
			}, me.directionsServiceCallback);
		};
		me.directionsServiceCallback = function(response, status){
			if (status == google.maps.DirectionsStatus.OK) {
				me.currentRoute = response.routes;
				//disable double click zoom when route is showing
				me.map.setOptions({ disableDoubleClickZoom: true });
				//console.log('directions gotten', response, me.currentRoute);
				//make a confirm button
				me.printConfirmBttn();
				//display the directions on the map
				me.directionsDisplay.setMap( me.map );
				me.directionsDisplay.setDirections(response);
			} else {
				//the directions couldn't be found for some reason, most likely cause there is no route, but could be server error
				//too many waypoints?
				if ( status == 'MAX_WAYPOINTS_EXCEEDED' ) {
					me.waypoints.pop();
					alert('Sorry, but you have provided as many waypoints as we can handle');
				} else {
					alert('Something went wrong fetching the directions: ' + status);
				}
				//me.currentRoute = null;
				//me.map.setOptions({ disableDoubleClickZoom: false });
			}
		};
		me.printConfirmBttn = function(){
			if ( !me.confirmBttn ) {
				me.confirmBttn = $('<button />', { id: 'add_commute_confirm', text: 'Route is correct' })
					.click(me.confirmClick)
					.insertBefore( me.cont );
			} else {
				me.confirmBttn.show();
			}
		};
		me.confirmClick = function(){
			//everything is alright, so submit the form
			//console.log('confirmation clicked', me.form.serialize(), me.waypoints );
			if ( me.waypoints.length )
				me.form.find('[name="waypoints"]').val( JSON.stringify( me.waypoints ) );
	              $.post(window.location.href, $('#add_commute_form').serialize())
		};
		*/
		
		me.setupConstants();
		return me;
	}
	
	window['EaseMap'] = EaseMap;
	
})(jQuery);


/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.5.0
 *
 */
(function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            threshold    : 0,
            failurelimit : 0,
            event        : "scroll",
            effect       : "show",
            container    : window
        };
                
        if(options) {
            $.extend(settings, options);
        }

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        var elements = this;
        if ("scroll" == settings.event) {
            $(settings.container).bind("scroll", function(event) {
                
                var counter = 0;
                elements.each(function() {
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                            /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                            $(this).trigger("appear");
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        }
                    }
                });
                /* Remove image from array so it is not looped next time. */
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }
        
        this.each(function() {
            var self = this;
            
            /* Save original only if it is not defined in HTML. */
            if (undefined == $(self).attr("original")) {
                $(self).attr("original", $(self).attr("src"));     
            }

            if ("scroll" != settings.event || 
                    undefined == $(self).attr("src") || 
                    settings.placeholder == $(self).attr("src") || 
                    ($.abovethetop(self, settings) ||
                     $.leftofbegin(self, settings) || 
                     $.belowthefold(self, settings) || 
                     $.rightoffold(self, settings) )) {
                        
                if (settings.placeholder) {
                    $(self).attr("src", settings.placeholder);      
                } else {
                    $(self).removeAttr("src");
                }
                self.loaded = false;
            } else {
                self.loaded = true;
            }
            
            /* When appear is triggered load original image. */
            $(self).one("appear", function() {
                if (!this.loaded) {
                    $("<img />")
                        .bind("load", function() {
                            $(self)
                                .hide()
                                .attr("src", $(self).attr("original"))
                                [settings.effect](settings.effectspeed);
                            self.loaded = true;
                        })
                        .attr("src", $(self).attr("original"));
                };
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if ("scroll" != settings.event) {
                $(self).bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $(self).trigger("appear");
                    }
                });
            }
        });
        
        /* Force initial check if images should appear. */
        $(settings.container).trigger(settings.event);
        
        return this;

    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold" : "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold"  : "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold"   : "!$.rightoffold(a, {threshold : 0, container: window})"
    });
    
})(jQuery);



(function($){
	function SyndicatedSubwayTiles( config ){
		var me = this,
			defaults = {
				url: 'http://subwaytiles.bennya.com',
				wrapId: 'content',
				count: 1,
				speed: 15,
				loadFromBottom: 5000, //px from bottom of container before loading next post
				navEl: 'nav#jsui',
				scrollSpeed: 1000,
				smoothScroll: false,
				placeholderImage: Ease.TemplateUrl+'/images/transparent.gif'
			};

		for (var key in config) {
		    defaults[key] = config[key] || defaults[key];
		}

		for (var key in defaults) {
		    me[key] = defaults[key];
		}

		//CONSTANTS
		// me.data;
		// me.currentPost = 0;
		//me.digesting = true;
		me.nav;
		me.navUl;
		me.wrap;
		me.timeout;
		me.placeholder = '';
		me.page = 1;
		me.getting = false;
		me.localUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
		
		me.init = function(){
			
			me.placeholder = me.placeholderImage;
			me.nav = $(me.navEl);
			me.navUl = me.nav.find('#posts');
			
			me.nav.find('#menuToggle').click(function(){
				me.navUl.slideToggle(200);
			});
			
			if ( !$('#'+me.wrapId).length ) {
				me.wrap = $('<div />', { id: me.wrapId }).appendTo('body');
			} else {
				me.wrap = $('#'+me.wrapId)
			}
			
			me.getPosts();

			//a form of 'infinite' scrolling
			$(me.wrap).parent().scroll(function(e){

				if (!me.getting){
					if ( $(this).scrollTop() > $(me.wrap).height() - me.loadFromBottom ) {
						me.getPosts();	
					}
				}

			});
		};

		me.getPosts = function(){
			//stop multiple requests
			me.getting = true;
			
			var request = '?json=get_recent_posts&';
				me.count > 0 ? request += 'count='+me.count+'&' : $.noop();
				//request += 'page='+me.page+'&';
				request += 'page='+me.page;
			
			//console.log('getting', me.url + request )
			
			$.getJSON( me.url + request, function(json){
				//console.log('request success', json);
				
				if( json.posts.length )
					$.each( json.posts, me.printPost );
				
				me.page += 1;
			});

		};

		me.printPost = function(i, post){
			//console.log( 'me.printPost', i, post);
            
			//var cont = $('<span />', { id: post.slug }).appendTo(me.wrap);
			var cont = $('<span />', { id: post.id }).appendTo(me.wrap);
            
			//$('<a />', {href: '#'+post.slug})
			$('<a />', {href: '#'+post.id})
            	.html( post.title )
            	.appendTo( me.navUl )
            	.wrap('<li>')
				.click( me.navClick );

			var k = 0;
			
			me.timeoutPrint( k, cont, post );
		};
		
		me.navClick = function( e ){
			if( me.smoothScroll ){
				e.preventDefault();
               
				var href = $(this).attr('href');
			
				href = href.substr(1, href.length);
               
				var off = $(me.wrap).find("#" + href).position();
	            var child = $(me.wrap).find("#" + href).children().first();
				if ( child.length )
					off = child.position();
				child = null;

				//console.log( href, $(me.wrap), $(me.wrap).find("#" + href) );

				$(me.wrap).parent().animate({scrollTop: off.top + 'px'}, me.scrollSpeed);
               
				off = null;
	            href = null;	

				return false;
			}
		}
		
		me.timeoutPrint = function( l, cont, post ){
			
			if ( l < post.attachments.length ) {
				var attachment = post.attachments[l];
				
				if ( attachment.mime_type.indexOf('image') > -1 ){
                	var full = attachment.images.full;
					
					//console.log('making image', l, post.attachments.length);
					
					$('<img />', {
						src: full.url,
						height: full.height,
						width: full.width
					}).appendTo( cont )
					.lazyload({
			    	 	placeholder : me.placeholder,
			    	 	effect      : "fadeIn",
						container	: me.wrap.parent()
			    	});
				}
				//and call itself again.
				me.timeout = setTimeout(function(){ me.timeoutPrint(l+1, cont, post); }, me.speed );
			} else {
				clearTimeout( me.timeout );
				me.getting = false;
			}
			
		};

		me.init();

		return me;
	}

	window['SyndicatedSubwayTiles'] = SyndicatedSubwayTiles;
	
})(jQuery);
