<?php
	$request = $_REQUEST;
	$url = $request['apiUrl'];
	unset( $request['apiUrl']);
	
	//set up url string	
	if( count($request) ) {
		$first = true;
		$url .= '?alt='.$request['alt'].'&max-results='.$request['max-results'].'&start-index='.$request['start-index'].'&v='.$request['v'];
	}
	
	echo file_get_contents( $url );
?>