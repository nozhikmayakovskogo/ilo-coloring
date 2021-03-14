<?php

/**
 * PHP Rest CURL
 * https://github.com/jmoraleda/php-rest-curl
 * (c) 2014 Jordi Moraleda
 */

Class RestCurl {
  public static function exec($method, $url, $obj = array(), $userpwd = null) {
     
    $curl = curl_init();
     
    switch($method) {
      case 'GET':
        if(strrpos($url, "?") === FALSE) {
          $url .= '?' . http_build_query($obj);
        }
        break;
      case 'POST': 
        curl_setopt($curl, CURLOPT_POST, TRUE);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($obj));
        break;
      case 'PUT':
      case 'DELETE':
      default:
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, strtoupper($method)); // method
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($obj)); // body
    }
	
	
	/***************/
	
	//$curl = curl_init('https://online.moysklad.ru/api/remap/1.1/entity/demand');
			//curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
			
			//curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			//curl_setopt($curl, CURLOPT_POST, 1);
			//curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
	
	/***************/
	

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
	
	if( $userpwd ) {
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($curl, CURLOPT_USERPWD, "admin@microcam:Gadjetcam2018");
	}
	
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HEADER, TRUE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, TRUE);
    
    // Exec
    $response = curl_exec($curl);
    $info = curl_getinfo($curl);
    curl_close($curl);
    
    // Data
    $header = trim(substr($response, 0, $info['header_size']));
    $body = substr($response, $info['header_size']);
     
    return array('status' => $info['http_code'], 'header' => $header, 'data' => json_decode($body));
  }

  public static function get($url, $obj = array()) {
     return RestCurl::exec("GET", $url, $obj);
  }

  public static function post($url, $obj = array(), $userpwd) {
     return RestCurl::exec("POST", $url, $obj, $userpwd);
  }

  public static function put($url, $obj = array()) {
     return RestCurl::exec("PUT", $url, $obj);
  }

  public static function delete($url, $obj = array()) {
     return RestCurl::exec("DELETE", $url, $obj);
  }
}

