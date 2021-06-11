<?php
require_once('rest.inc.php');
$order_id = isset($_GET['order_id']) ? (int)$_GET['order_id'] : null;

if ($order_id) {
	// При наличии номера заказа получаем данные по заказу из CRM
	$api_key = 'AAE9B9AMIupsIICV33xe0skXvDD0gGQU5Kg';
	$result = RestCurl::get('https://fankcrm.ru/v1/api/orders/index', ['apiKey' => $api_key,'order_id' => $order_id]);
	$order = $result['data'];
	echo json_encode($order);
}