<?php
/**
 * The Sidebar containing the primary and secondary widget areas.
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?>

<aside id="frontPageSidebar">
	<div class="loops">
		<section>
<?php

			$current = new WP_Query(array(
				'numberposts' => 1,
				'post_type' => 'post'
			));
			
			

?>
		</section>
	</div>
</aside>