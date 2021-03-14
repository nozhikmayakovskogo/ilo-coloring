<?php
ini_set('display_errors','1');
ini_set('display_startup_errors','1');
ini_set('error_reporting', E_ALL);
//require_once "vendor/csrf.php";
//require_once "vendor/debug.php";
require __DIR__ . '/lib/autoload.php'; 
use YandexCheckout\Client;

$test = false;

if($_POST) {
	$order_id = (int)trim($_POST['order_id']);
	
	
	$description = trim($_POST['description']);
	if(!$description) {
		$description = 'Онлайн оплата заказа №' . $order_id;
	}
	$sum = (float)trim($_POST['sum']);
	

	$config = [
		'paymentAction' => $test ? 'https://demomoney.yandex.ru/eshop.xml' : 'https://money.yandex.ru/eshop.xml',
		'shopId' => $test ? '721603' : '723954',
		'secret_key' => $test ? 'test_YA-0SXjtMN25h3KNcMxaYXAd_SG9JN0VQZGz9MWrdo0' : 'live_KFfG1dplL_hn95q2Gt8t-5o8T55sZA4oNp-QCghtzJc',
		'currency' => 'RUB'
	];
	
	
	$client = new Client();
	$client->setAuth($config['shopId'], $config['secret_key']);
	
	$payment = $client->createPayment(
		[
			'amount' => [
				'value' => $sum,
				'currency' => $config['currency'],
			],
			'confirmation' => [
				'type' => 'redirect',
				'return_url' => 'https://ilo-coloring.ru/thanks?order_id=' . $order_id, // TODO выполнять запрос о статусе платежа.
			],
			'capture' => true,
			'description' => $description,
			'metadata' => [
				'order_id' => $order_id
			],
		],
		uniqid(time(), true)
	);

	if( isset($payment->confirmation->confirmationUrl) ) {
		header('Location: ' . $payment->confirmation->confirmationUrl);
	}
}
