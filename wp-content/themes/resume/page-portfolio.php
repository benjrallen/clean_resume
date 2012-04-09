<?php
/**
 * Template Name: Page - Portfolio
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>

<article id="worksTop" <?php post_class(); ?>>
  <div class="bgNoise"></div>
  <header class="wrap">
    <h1><span class="subtitle">Benjamin Allen</span> <span class="sep">|</span> <span class="subtitle small">Development Portfolio</span></h1>
  </header>
	<div class="wrap">
<?php

	$works = new WP_Query(array(
		'post_type' => 'ba_work',
		'posts_per_page' => -1,
		'order' => 'ASC',
		'orderby' => 'menu_order title'
	));

  $ct = 1;

	if ( $works->have_posts() ) :
    while ( $works->have_posts() ) : $works->the_post();
?>

  <a href="#<?php echo $post->post_name; ?>" title="<?php the_title(); ?>" class="basic bttn"><?php the_title(); ?></a>

<?php endwhile; rewind_posts(); ?>
	</div><!-- .wrap -->
</article><!-- #post-## -->


<section id="works" class="wrap">
		<?php while ( $works->have_posts() ) : $works->the_post(); ?>
			<?php
        //print_r( $post );
        
        $imgs = ba_get_images();
				$link = get_post_meta($post->ID, 'ba_work_link_name', true);
				$url = get_post_meta($post->ID, 'ba_work_link_url', true);
        
			?>
			<article id="<?php echo $post->post_name; ?>" class="work">
		    <div class="clearfix"></div>
			  <div class="left">
  			  <header>
  			    <h2 class="post-title"><?php the_title(); ?></h2>
  			    <?php 
    			    if( !empty($link) && !empty($url) )
    			      echo '<a class="work-link" href="'.$url.'" title="'.$link.'" target="_blank">'.$link.'</a>';
  			    ?>
  			  </header>

  				<div class="entry">
  					<?php the_content(); ?>
  				</div>
				
  			  <div class="pics">
  			    <?php
  			      if( $imgs ){
  			        $ct = 0;
  			        $big = false;
  			        foreach( $imgs as $img ) {
  			          $src = wp_get_attachment_image_src( $img->ID, 'project-img' );
  			          $thumb = wp_get_attachment_image_src( $img->ID, 'project-thumb' );
  			          $class = '';
  			          if ( $ct == 0 ){
  			            $big = $src;
  			            $class = 'active';
  			          }
  			          echo '<img src="'.$thumb[0].'" alt="" class="'.$class.'" full="'.$src[0].'" />';

  			          //print_r($src); echo '<br /><br />';
  			          $ct++;
  			          
  			          unset( $thumb );
  			          unset( $src );
  			        }
  			      }
  			    ?>
  			    <div class="clearfix"></div>
  			  </div>
			    <div class="clearfix"></div>
				</div>
				
				<div class="big-pic">
				  <?php
				    if( $big ){
		          echo '<img src="'.$big[0].'" alt="" />';
		          unset( $big );
				    }
				  ?>
				</div>
				
        <div class="clearfix"></div>
			</article>
			
		<?php endwhile; ?>
</section>

<?php endif; wp_reset_query(); ?>


<?php get_sidebar(); ?>
<div class="clearfix"></div>
<?php get_footer(); ?>