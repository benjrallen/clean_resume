<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html <?php language_attributes(); ?> class="no-js ie ie6 lte7 lte8 lte9"><![endif]-->
<!--[if IE 7 ]><html <?php language_attributes(); ?> class="no-js ie ie7 lte7 lte8 lte9"><![endif]-->
<!--[if IE 8 ]><html <?php language_attributes(); ?> class="no-js ie ie8 lte8 lte9"><![endif]-->
<!--[if IE 9 ]><html <?php language_attributes(); ?> class="no-js ie ie9 lte9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	<head>
    <link href='http://fonts.googleapis.com/css?family=Raleway:100|Crimson+Text:400,400italic,600,600italic' rel='stylesheet' type='text/css'>		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<title><?php
			/*
			 * Print the <title> tag based on what is being viewed.
			 * We filter the output of wp_title() a bit -- see
			 * boilerplate_filter_wp_title() in functions.php.
			 */
			wp_title( '|', true, 'right' );
		?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="shortcut icon"  href="<?php bloginfo( 'url' ); ?>/favicon.png">
		<meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" /> 
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<link rel="stylesheet" href="<?php bloginfo( 'template_directory' ); ?>/css/application.css?v=2" />
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

		<script type="text/javascript">
			var Ease = Ease || {};
			Ease.Url = '<?php bloginfo( 'url' ); ?>';
			Ease.TemplateUrl = '<?php bloginfo('template_directory'); ?>';
			Ease.isFrontPage = <?php if(is_front_page()) { echo 'true'; }else{ echo 'false'; } ?>;
			Ease.wpVersion = '<?php echo trim(get_bloginfo("version")); ?>';
		</script>

		<script src="<?php bloginfo('template_directory'); ?>/js/modernizr.js?v=2"></script>

		<script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-28492745-1']);
      _gaq.push(['_trackPageview']);

			Modernizr.load([
				{ load : ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'],
				    complete: function () { if ( !window.jQuery ){ Modernizr.load(Ease.TemplateUrl+'/js/jquery.js'); } }
				},
				{ test: window.JSON, nope: Ease.TemplateUrl+'/js/json2.js' },
				{ test: Modernizr.input.placeholder,
				  nope: Ease.TemplateUrl+'/js/placeholder.jquery.js'
				},
				<?php /* ?>
				//plugins.js & common.js fordevelopment 
				{ load : Ease.TemplateUrl+'/js/plugins.js' },
				{ load : Ease.TemplateUrl+'/js/common.js' },
				//concatenate and optimize seperate script files for deployment using google closure compiler (compiler.jar) in js folder
				<?php */ ?>
				{ load : Ease.TemplateUrl+'/js/theme.js?v=2' },
        { load: ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js' },
			]);
		</script>
		
<?php
		/* We add some JavaScript to pages with the comment form
		 * to support sites with threaded comments (when in use).
		 */
		if ( is_singular() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		/* Always have wp_head() just before the closing </head>
		 * tag of your theme, or you will break many plugins, which
		 * generally use this hook to add elements to <head> such
		 * as styles, scripts, and meta tags.
		 */
		wp_head();		
?>
	</head>
	<body <?php body_class(); ?>>

		<div id="subwayTilesWrap">
		  <span id="closeSubwayTiles"><span class="times">&times;</span><small>(close Subway Tiles)</small></span>
		  <nav id="jsui">
      	<header>
      		<h4>Subway Tiles</h4>
      	</header>

      	<ul id="posts">
      		<li><a href="#tilesEnd">#end</a></li>
      	</ul>

      	<div id="menuToggle">toggle</div>

      </nav>
		  <div id="subwayTiles"></div>
		  
		  <div id="tilesEnd"></div>
    </div>

		<header id="header" role="banner" class="navbar navbar-fixed-top" role="navigation">
      <div class="navbar-inner row">
        <nav id="access" class="wrap span12">
    			<?php if (is_front_page()) { echo '<h1>'; } else { echo '<h2>'; } ?>
    				<a id="logo" class="brand" href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
    				  <span class="icon"></span>
    					<span class="logoName"><?php bloginfo( 'name' ); ?></span>
    				</a>
    			<?php if (is_front_page()) { echo '</h1>'; } else { echo '</h2>'; } ?>

          <?php
            /*
            $args = array(
            		'container' => false,
            		'menu_class' => 'nav',
            		'theme_location' => 'primary_left',
            		'walker' => new Bootstrap_Walker_Nav_Menu
            	);

            wp_nav_menu($args);
            */
          ?>
          <div class="clearfix"></div>
        </nav>
      </div>
		</header>		
		
		<section id="content" role="main">
