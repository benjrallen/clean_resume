<?php
/**
 * Template Name: Page - Locations
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>

<?php  if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<article id="locations" <?php post_class(); ?>>
  <header class="wrap">
    <h1><span class="subtitle">Benjamin Allen</span> <span class="sep">|</span> <span class="subtitle small"><?php the_title(); ?></span></h1>
  </header>
	<div class="wrap">
    <div id="gmapCont"></div>

		<div class="entry-content">
			<?php the_content(''); ?>
			
			<?php echo get_location_list(); ?>

			<div class="clearfix"></div>
		</div><!-- .entry-content -->
    
    
    <div class="clearfix"></div>
	</div><!-- .wrap -->
</article><!-- #post-## -->
<?php endwhile; endif; wp_reset_query(); ?>



<?php //get_sidebar(); ?>
<div class="clearfix"></div>
<?php get_footer(); ?>