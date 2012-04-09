<?php
/**
 * Template Name: Page - Videos
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>

<?php  if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<div id="easeVideoPlayer"></div>

<article id="videos" <?php post_class(); ?>>
  <header class="wrap">
    <h1><span class="subtitle">Benjamin Allen</span> <span class="sep">|</span> <span class="subtitle small"><?php the_title(); ?></span></h1>
  </header>
	<div class="wrap">

		<div class="entry-content">
			<?php the_content(''); ?>
			<div class="clearfix"></div>
		</div><!-- .entry-content -->
    
    <div id="videoBlocks">
      <div id="easeVideoBlocks" class="easeVideos"></div>
    </div>
    
    <div class="clearfix"></div>
	</div><!-- .wrap -->
</article><!-- #post-## -->
<?php endwhile; endif; wp_reset_query(); ?>




<?php //get_sidebar(); ?>
<div class="clearfix"></div>
<?php get_footer(); ?>