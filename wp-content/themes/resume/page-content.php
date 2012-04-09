<?php
	$pageSubtitle = get_post_meta($post->ID, 'upal_page_subtitle', true);
?>
	<header class="entry-title">
		<?php echo ( is_front_page() ? '<h2>' : '<h1>' ); ?>
		
		<?php the_title(); ?>
		
		<?php echo ( is_front_page() ? '</h2>' : '</h1>' ); ?>
		
		<?php if ($pageSubtitle && $pageSubtitle != '') { ?>
			<h4><?php echo $pageSubtitle; ?></h4>
		<?php } ?>
	</header>
	<div class="entry-content">			
		<div class="entry-teaser">
			<?php 
				global $more;
				$more = 0;
				$readMore = '<a href="'.get_permalink().'" class="base bttn page-read-more" title="Read More">Read More</a>';
				the_content($readMore);
			?>
		</div>
		<div class="entry-full">
			<?php 
				$more = 1;
				the_content('', true);
			?>
			
		</div>
		
		<div class="clearfix"></div>
	</div><!-- .entry-content -->
