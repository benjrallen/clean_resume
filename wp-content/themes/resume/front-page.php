<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query. 
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>

			<?php
			/* Run the loop to output the posts.
			 * If you want to overload this in a child theme then include a file
			 * called loop-index.php and that will be used instead.
			 */
			 //get_template_part( 'loop', 'index' );
			?>

<?php /* Sidebar before rotator on owasso */ ?>

<?php /* ?>
<div id="contentTop" class="fp">
	<div class="bgNoise"></div>
	<div class="wrap">
		<?php get_template_part('front-page', 'rotator'); ?>
	</div>
</div>
<?php */ ?>

<article id="about" class="hentry row">
  <div class="mask"></div>
  
  <div class="wrap span12">
	<?php if ( have_posts() ) : while( have_posts() ) : the_post(); ?>
    	  
		<div class="row">

        <div class="span8">
          <header>
      		  <h2 class="page-title"><?php the_title(); ?><strong>*</strong></h2>
            <div class="row entry-content">
              <div class="span8">
        				<?php 
              		$subtitle = get_post_meta( $post->ID, 'page_subtitle', true );

        					if( $subtitle )
        						echo '<h3 class="subtitle">'.$subtitle.'</h3>';

        					the_content('');
        				?>
    				  </div>
    				</div>
          </header>
				</div>
				
    	  
        <div class="span3 offset1">
    	  <?php
    	    if ( has_post_thumbnail() ){
    	      //print_r( get_the_post_thumbnail( $post->ID, 'page-thumb' ) );
    	      echo '<div class="pic">'.get_the_post_thumbnail( $post->ID, 'page-thumb' ).'</div>';
    	    }
    	  ?>
    	    <div id="fpMenu" class="row">
    				<div class="span3">    				  
      				  <ul class="nav nav-list well">
                  <li class="nav-header">
                    Look it.
                  </li>
                  <li>
                    <a href="#">Work</a>
                  </li>
                  <li>
                    <a title="Get that resume." href="<?php echo ba_get_resume_href(); ?>" target="_blank">Resume</a>
                  </li>
                  <li>
                    <a href="#">Places</a>
                  </li>
                </ul>

    				    <a class="contact btn btn-primary btn-large">Contact Me</a>

    				</div>
    	    </div>
        </div>
				  
			<div class="clearfix"></div>
		</div><!-- .entry-content -->
	  
	<?php endwhile; endif; ?>

  </div><?php /* END WRAP */ ?>
	
</article>

<section id="contact" class="row">
  <div class="span12 wrap">
    <h2 class="page-title">Contact Me.</h2>
    <div class="row">
    <?php 
    
      echo do_shortcode('[contact-form 1 "Contact Me"]'); 
    
      /*
       <div class="span8">
         <p>[textarea your-message watermark "Enter your message."]</p>

         <div class="row">
           <div class="span4 left">
             <span>Email: </span><a href="mailto:benjrallen@gmail.com">benjrallen@gmail.com</a>
           </div>
           <div class="span4 right">
             <span>Call me:</span><a href="tel:415.531.8921">415.531.8921</span>
           </div>
         </div>

       </div>
       <div class="span4">
         <p>[text* your-name watermark "Your Name."]</p>
         <p>[email* your-email watermark "Your Email"]</p>
         <p>[submit class:btn class:btn-inverse]</p>
       </div>
      <div class="clearfix"></div>
      */
      
    ?>
    </div>

  </div>
</section>

<section id="places" class="row">

  <?php echo make_section_header( 'I\'ve lived around.' ); ?>

  <article class="span12 wrap">
  
    <div class="row">

      <div class="span8 map">
        <div  id="gMap" class="well"></div>
      </div>

      <div class="span4 list">
        <?php echo get_location_list( 'nav navlist well', '' ); ?>
      </div>

    </div>
		
  </article>


  
</section>



<section id="work" class="row">  
  <?php

    echo make_section_header( 'Some of my work.' );

  	$works = new WP_Query(array(
  		'post_type' => 'ba_work',
  		'posts_per_page' => -1,
  		'order' => 'ASC',
  		'orderby' => 'menu_order title'
  	));

  	if ( $works->have_posts() ) :
      while ( $works->have_posts() ) : $works->the_post();
        get_template_part('loop', 'work');
      endwhile;
    endif;
    wp_reset_query();
  ?>
  
</section>	



	<div class="clearfix"></div>


<?php get_footer(); ?>