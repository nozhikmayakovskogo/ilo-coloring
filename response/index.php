<?php

$statuses = [
	'pending' => 'платеж создан, но не завершен',
	'waiting_for_capture' => 'платеж выполнен и ожидает ваших действий',
	'succeeded' => 'платеж успешно завершен',
	'canceled' => 'платеж отменен',
];

$source = file_get_contents("php://input");
$json = json_decode($source);

$to = 'creativephpcode@gmail.com,fin-manager@smart-microcam.ru';

$subject = isset($statuses[$json->object->status]) ? 'Яндекс.Деньги: ' . $statuses[$json->object->status] : 'Яндекс.Деньги: ' . $json->object->status;

$crmApiKey = 'AAE9B9AMIupsIICV33xe0skXvDD0gGQU5Kg';
$domain = 'https://fankcrm.ru';

$data = [
	'order_id' => isset($json->object->metadata) ? $json->object->metadata->order_id : null,
	'type' => 7, // Тип платежа - Яндекс.Деньги
	'status' => $json->object->status,
	'paid' => isset($json->object->paid) ? $json->object->paid : null,
	'description' => $json->object->description,
	'created_at' => date('Y-m-d H:i:s', strtotime($json->object->created_at)),
	'amount_value' => $json->object->amount->value,
	'amount_currency' => $json->object->amount->currency,
	'payment_method_type' => isset($json->object->payment_method) ? $json->object->payment_method->type : null,
	'payment_method_id' => isset($json->object->payment_method) ? $json->object->payment_method->id : null,
	'payment_method_saved' => isset($json->object->payment_method) ? $json->object->payment_method->saved : null,
	'recipient_account_id' => isset($json->object->recipient) ? $json->object->recipient->account_id : null,
	'recipient_gateway_id' => isset($json->object->recipient) ? $json->object->recipient->gateway_id : null,
	//'cancellation_details_party' => $json->object->cancellation_details->party,
	//'cancellation_details_reason' => $json->object->cancellation_details->reason,
];

// В случае успешной оплаты меняем у заказа статус на "Оформлено с предоплатой" и создаем в заказе платеж 
if($json->object->status == 'succeeded') {
	
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $domain . '/v1/api/payments/create?apiKey=' . $crmApiKey);
	curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
	$result = json_decode(curl_exec($curl), false);
	curl_close($curl);
}

$headers = "From: noreply@9-shop.ru\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";

$object_status = isset($statuses[$json->object->status]) ? $statuses[$json->object->status] : $json->object->status;

$message = '<table border="1">';
$message .= '<tr><td>Номер заказа</td><td>' . $json->object->metadata->order_id . '</td></tr>';
$message .= '<tr><td>Статус платежа</td><td>' . $object_status . '</td></tr>';
$message .= '<tr><td>Дата и время</td><td>' . date('Y-m-d H:i:s', strtotime($json->object->created_at)) . '</td></tr>';
$message .= '<tr><td>Сумма</td><td>' . $json->object->amount->value . ' ' . $json->object->amount->currency . '</td></tr>';
$message .= '<tr><td>Комментарий</td><td>' . $json->object->description . '</td></tr>';
$message .= '<tr><td colspan="2">Все детали — в вашей истории операций.</td></tr>';
$message .= '</table>';

mail($to, $subject, $message, $headers);

