<?php

ini_set('display_errors','1');
ini_set('display_startup_errors','1');
ini_set('error_reporting', E_ALL);
//require_once 'vendor/csrf.php';
//require_once 'vendor/debug.php';

$use_csrf = false;

if($use_csrf) {
    if(isset($_POST['_csrf']) && !empty($_POST['_csrf']) && csrf::checkToken($_POST['_csrf'])){
        send();
    }else{
        ($_SERVER['HTTP_REFERER']) ?  $back = $_SERVER['HTTP_REFERER'] : $back = '/';
        header('Location: '. $back);
    }
} else {
    send();
}

function clear_input($str){return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'utf-8');}

function get_utm($http_referer, $data = []){
    $referrer = urldecode(iconv('utf-8', 'windows-1251', $http_referer));
    
    
    $url = substr($referrer, 0, strrpos($referrer, '/?'));
    
    $utm = str_replace('/?', '', substr($referrer, strrpos($referrer, '/?')));
    parse_str($utm, $output);
    if (!$url) {
        $url = $referrer;
    }
    $output['referrer'] = $referrer;
    $output['url'] = $url;
    
    $output['type'] = $data['type'];
    //print_r($output); die;
    $output['landing'] = $data['landing'];
    $output['category_title'] = $data['category_title'];
    $output['good_title'] = $data['good_title'];
    $output['variant'] = $data['variant'];
    $output['timezone'] = $data['timezone'];
    $output['user_city'] = $data['user_city'];
    //print_r($output); die;
    return $output;
}

function send() {
    
    if ($_POST) {
		

        $data = [];
        $data['shop'] = 'ilo';
        $data['name'] = isset($_POST['name']) ? clear_input($_POST['name']) : 'Неизвестно';
        $data['phone'] = isset($_POST['phone']) ? clear_input($_POST['phone']) : null;
		$data['email'] = null;
        $data['delivery'] = isset($_POST['delivery']) ? clear_input($_POST['delivery']) : null;
        $data['payment'] = isset($_POST['payment']) ? clear_input($_POST['payment']) : null;
        $data['promocode'] = isset($_POST['promocode']) ? clear_input($_POST['promocode']) : null;

        $goods = isset($_POST['goods']) ? $_POST['goods'] : null;
		if( $goods ) {
			$goods_id = json_decode($goods,true);
		}
        
        $data['note'] = isset($_POST['note']) ? clear_input($_POST['note']) : null;
        $data['variant'] = isset($_POST['variant']) ? clear_input($_POST['variant']) : null;
        $data['landing'] =  isset($_POST['landing']) ? clear_input($_POST['landing']) : null;
        $data['category_title'] =  'Раскраски';
        $data['good_title'] = isset($_POST['good_title']) ? clear_input($_POST['good_title']) : null;
		$data['timezone'] = isset($_POST['timezone']) ? clear_input($_POST['timezone']) : null;
		$data['user_city'] = isset($_POST['user_city']) ? clear_input($_POST['user_city']) : null;
        $data['device'] = isset($_POST['device']) ? clear_input($_POST['device']) : null;
        $data['type'] = isset($_POST['type']) ? clear_input($_POST['type']) : 'order';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $data['ip'] = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $data['ip'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $data['ip'] = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
        }
        
        $data['user_agent'] = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : null;
        $data['lang'] = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : null;
        $data['http_referer'] = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

		if( isset($goods_id) && !empty($goods_id) ) {
			$data['items'] = [];
			$data['sum'] = 0;
			$data_json = json_decode(file_get_contents('data.json'), true);
			foreach($goods_id as $key => $value) {
				if( isset($data_json['goods'][$key]) && !empty($data_json['goods'][$key]) ) {
					 array_push($data['items'], [
						'external_id' => $data_json['goods'][$key]['externalid'],
						'price' => $data_json['goods'][$key]['prices']['new'],
						'quantity' => $value,
					]);
				}
				if( isset($data_json['goods'][$key]['prices']['new']) ) {
					$data['sum'] += $data_json['goods'][$key]['prices']['new'] * $value;
				}
			}
        }	
        
        // utm узнаем из глоб массива реферер
        $utm = get_utm($data['http_referer'], $data);
        $data['utm'] = json_encode($utm, JSON_UNESCAPED_UNICODE);

        // Получаем черный список контактов
        //$blacklist = json_decode(file_get_contents('https://fankcrm.ru/output/blacklist'));
		
        //if(is_array($blacklist) && count($blacklist) > 0 && !in_array($data['phone'], $blacklist) ) {
        $parsed_url = parse_url($utm['url']);
        $path = isset($parsed_url['path']) ? explode('/',$parsed_url['path']) : '/';
        $back_url = $parsed_url['scheme'].'://'.$parsed_url['host'];

        $order_id = createorder($data);
        
        if($order_id) {
            $to = 'zayavki@smart-microcam.ru';
            $subject = 'Новый заказ №' . $order_id ;
            $message = 'Поступила новая заявка c ' .  $data['http_referer'] . '. Контактная информация: ' . $data['phone'] . ' ' . $data['email'] . '. Имя покупателя: ' . $data['name'] . '. Заявке присвоен номер ' . $order_id;
            $headers = 'From: webmaster@smart-microcam.ru' . "\r\n" .
                    'Reply-To: webmaster@smart-microcam.ru' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();
            mail($to, $subject, $message, $headers);
        } else {
            $to = 'zayavki@smart-microcam.ru';
            $subject = 'Пропущенный заказ';
            $message = 'Поступила новая заявка с ' .  $data['http_referer'] . '. Контактная информация: ' . $data['phone'] . ' ' . $data['email'] . '. Имя покупателя: ' . $data['name'] . '. Заявке не присвоен номер';
            $headers = 'From: webmaster@smart-microcam.ru' . "\r\n" .
                    'Reply-To: webmaster@smart-microcam.ru' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();
            mail($to, $subject, $message, $headers);
        }
		
		if($data['payment'] == 7) {
			header("location: {$back_url}/pay?order_id=" . $order_id);
		} else {
			header("location: {$back_url}/thanks?order_id=" . $order_id);
		}
		
        
        //} else {
            //header('location: /');
        //}
    } else {
        header('location: /');
    }
}
function createorder($data) {
	
    $crmApiKey = 'AAE9B9AMIupsIICV33xe0skXvDD0gGQU5Kg';

    $post = [
        'apiKey'=>$crmApiKey,
        'name' => $data['name'],
        'phone' => isset($data['phone']) ? $data['phone'] : null,
        'email' => isset($data['email']) ? $data['email'] : null,
        //'ip' => $data['ip'],
        'ip' => null,
        //'user_agent' => $data['user_agent'],
        'user_agent' => null,
        'manager_id' => null,
        'utm' => $data['utm'],
		'shop' => $data['shop'],
		'sum' => isset($data['sum']) ? $data['sum'] : null,
        'customer_note' => $data['note'],
		'promocode' => isset($data['promocode']) ? $data['promocode'] : null,
        'roistat' => array_key_exists('roistat_visit', $_COOKIE) ? $_COOKIE['roistat_visit'] : 'nocookie',
    ];
    
    //print_r($post); die;
    

    if (isset($data['items'])) {
        $post['items'] = serialize($data['items']);
    }
    //print_r($post); die;

    if($data['ip'] == '127.0.0.1') {
        $domain = 'https://fankcrm.loc';
    } else {
        $domain = 'https://fankcrm.ru';
    }
    
    
    
    //print_r($post); die;

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $domain . '/v1/api/orders/create?apiKey='.$post['apiKey']);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($post));
    $result = json_decode(curl_exec($curl), false);
    
    //print_r($result); die;
    
    curl_close($curl);
    if(isset($result->order_id)) {
        return $result->order_id;
    } else {
        return false;
    }
    
}



