<?php
  //print_r( $post );

  $imgs = ba_get_images();
	$link = get_post_meta($post->ID, 'ba_work_link_name', true);
	$url = get_post_meta($post->ID, 'ba_work_link_url', true);

?>
<article id="<?php echo $post->post_name; ?>" class="span12 wrap">
  <div class="row">

	  <div class="pics span9">
	    <?php
	      if( $imgs ){
	        //$ct = 0;
	        $big = false;
	        foreach( $imgs as $img ) {
	          $src = wp_get_attachment_image_src( $img->ID, 'project-img' );
	          //$thumb = wp_get_attachment_image_src( $img->ID, 'project-thumb' );
	          $class = '';
	          //if ( $ct == 0 ){
	          //  $big = $src;
	          //  $class = 'active';
	          //}
	          //echo '<img src="'.$thumb[0].'" alt="" class="'.$class.'" full="'.$src[0].'" />';
	          echo '<img src="'.$src[0].'" alt="" class="'.$class.'" full="'.$src[0].'" />';

	          //print_r($src); echo '<br /><br />';
	          //$ct++;

	          //unset( $thumb );
	          unset( $src );
	        }
	      }
	    ?>
	    <div class="clearfix"></div>
	  </div>

    <div class="span3 entry-box">
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
  		
  		<?php
  		
  		  $terms = get_the_terms( $post->ID, 'work_tag' );
  		  
  		  if ( !empty($terms) ){
  		    echo '<div class="terms">';
  		      foreach( $terms as $term ) {
  		        echo '<button class="btn">'.$term->name.'</button>';
            }
  		    echo '</div>';
  		  }
  		?>
    </div>

  </div>

  <div class="clearfix"></div>
</article>
