/*import * as $ from 'jquery';*/
//import './simplelightbox/simple-lightbox.min.js';
//import './imask.min.js';

const { range } = rxjs;
const { map, filter } = rxjs.operators;
 
range(1, 20)
  .pipe(
    filter(x => x % 2 === 1),
    map(x => x + x)
  )
  .subscribe(x => console.log(x));

"use strict";
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function moneyFormat(int){
    let str = String(int);
    let x = str.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}

function $_GET(key) {
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}

function generateModalCart() {

	fetch('data.json')
		.then( response =>  response.json())
		.then( data => {
            let goods = data.goods;
			let totalSum = 0;
			
			let html = '<tbody>';
			let cartData = JSON.parse(localStorage.getItem('cart'));
			let cartCount = Object.keys(cartData).length;
			
			document.querySelector('.btnOpenCart .counter').textContent = cartCount ? cartCount : 0;
			
			if(cartCount) {
				
				for(key in cartData) {
					
					let good = goods[key];
					if(good) {
						html += '<tr>';
						html += '<td data-label="Picture"><img src="upload/goods/' + good.alias + '/medium/' + good.preview.photo[0] + '" width="70" alt=""></td>';
						html += '<td data-label="Name">';
						html += '<h4>' + good.title + '<button type="button" class="btnDeleteCartGood ui float right" data-id="' + good.id + '" title="Удалить"><i class="icon x"></i></button></h4><p class="vendor_code">' + good.vendor_code + '</p>';
						html += '<div class="visible-sm">';
						
							html += '<div class="ui input number-spinner">';
								html += '<button type="button" class="number-spinner-button" data-dir="down"><i class="icon minus"></i></button>';
								html += '<input type="text" value="' + cartData[key] + '" data-id="' + good.id + '">';
								html += '<button type="button" class="number-spinner-button" data-dir="up"><i class="icon plus"></i></button>';
							html += '</div>';
							
							html += '<div><p class="price">' + moneyFormat(good.prices.new) + ' р.</p></div>';
						
						html += '</div>';
						html += '</td>';
						html += '<td data-label="Qty">';
							html += '<div class="ui input number-spinner">';
								html += '<button type="button" class="number-spinner-button" data-dir="down"><i class="icon minus"></i></button>';
								html += '<input type="text" value="' + cartData[key] + '" data-id="' + good.id + '">';
								html += '<button type="button" class="number-spinner-button" data-dir="up"><i class="icon plus"></i></button>';
							html += '</div>';
						html += '</td>';
						html += '<td data-label="Price"><p class="price">' + moneyFormat(good.prices.new) + ' р.</p></td>';
						html += '<td data-label="Action"><button type="button" class="btnDeleteCartGood" data-id="' + good.id + '" title="Удалить"><i class="icon x"></i></button></td>';
						html += '</tr>';
						
						totalSum += parseInt(good.prices.new) * cartData[key];
					}
				}
			} else {
				html += '<tr><td colspan="5">Товаров в корзине нет</td></tr>';				
			}
			html += '</tbody>';
			document.querySelector('#cartModalTable').innerHTML = html;
			document.querySelector('#totalSum').innerText = moneyFormat(totalSum);
			document.querySelector('#submitCartForm').setAttribute('data-totalsum',totalSum);
			document.querySelector('.btnOpenCart').setAttribute('data-tooltip','= ' + moneyFormat(totalSum) + ' р.');
			document.querySelector('#cartModal form input[name=goods]').value = JSON.stringify(cartData);

		}).catch(error => {console.error('Request failed', error);});
}

class Page {
	constructor(title) {
		this.title = title;
	}
	setTitle() {
		document.title = this.title;
	}
	static getPage() {
		let currentUrl = location.pathname.substr(1).trim().replace('.html', '');
		alert(currentUrl + ' test');
	}
}
class goodPage extends Page {
	constructor(title) {
		this.title = title + ' | Гигантские раскраски ilo';
	}
}
let currentUrl = location.pathname.substr(1).trim().replace('.html', '');
if(!currentUrl) {
	let page = new Page('Гигантские раскраски ilo');
	page.setTitle();
}

const deliveryTypes = {
    "sd": "Самовывоз (Санкт-Петербург)",
    "russian-post": "Почтой России",
    "courier": "Бесконтактная курьерская доставка"
}
if( deliveryTypes && document.getElementById('deliveryTypesForm') ) {
    let deliveryTypesHtml = '<div class="grouped fields">';
    deliveryTypesHtml += '<label>Выберите тип доставки</label>'
    for(var key in deliveryTypes) {
        deliveryTypesHtml += '<div class="field"><div class="ui radio">';
        if(key == 'sd') {
            deliveryTypesHtml += '<label><input type="radio" name="delivery" value="' + key + '" checked> ' + deliveryTypes[key] + '</label>';
        } else {
            deliveryTypesHtml += '<label><input type="radio" name="delivery" value="' + key + '"> ' + deliveryTypes[key] + '</label>';   
        }
        deliveryTypesHtml += '</div></div>';
    }
    deliveryTypesHtml += '</div>'
    document.getElementById('deliveryTypesForm').innerHTML = deliveryTypesHtml;
}

window.onload = () => {

	let formEls = document.querySelectorAll('form')
	if( formEls ) {
		formEls.forEach((e) => {
			e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="timezone" value="' + getTimeZone() + '">');
			e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="user_city" value="' + ymaps.geolocation.city + '">');
			e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="g-recaptcha-response" class="g-recaptcha-response" value="">');
		});
	}

    if(document.querySelector('form input[name=city]')) {
        document.querySelector('form input[name=city]').value = ymaps.geolocation.city;
    }
    if(document.querySelector('#cartModal form')) {
        document.querySelector('#cartModal form').insertAdjacentHTML('beforeEnd', '<input type="hidden" name="goods" value="">');
	}
	
	// Кнопка вызова миникорзины
	//localStorage.clear();
	let cartData = JSON.parse(localStorage.getItem('cart')) || {};
	let cartCount = Object.keys(cartData).length;

	if(cartCount && document.querySelector('.btnOpenCart .counter')) {
		document.querySelector('.btnOpenCart .counter').textContent = cartCount;
	}
	fetch('data.json')
		.then( response =>  response.json())
		.then( data => {

			let goods = data.goods;
			let totalSum = 0;
			
			for(key in cartData) {
				let good = goods[key];
				if(good && cartData.hasOwnProperty(key) ) {
					totalSum += good.prices.new * cartData[key];
				}
				if(document.querySelector('.btnOpenCart')) {
					document.querySelector('.btnOpenCart').setAttribute('data-tooltip',`= ${moneyFormat(totalSum)} р.`);
				}
			};

			let html = '<div class="ui three stackable cards">';
			let goodUrl = location.pathname.substr(1).trim().replace('.html', '');
			
			for(var key in goods) {
				
				if(goodUrl && goodUrl == goods[key].alias && goods[key].status === true) {
					let goodHtml = '<div class="ui stackable grid">';
						goodHtml += '<div class="seven wide column">';
							goodHtml += '<div class="image">';
								goodHtml += '<a data-lightbox="good" href="upload/goods/' + goods[key].alias + '/large/' + goods[key].images[0] + '">';
								goodHtml += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].images[0] + '" class="ui fluid image" alt="">';
								goodHtml += '</a>';
							goodHtml += '</div>';
						goodHtml += '</div>'
						goodHtml += '<div class="nine wide column">';
							goodHtml += '<div class="description">';
								goodHtml += '<h4>' + goods[key].title + '</h4>';
								goodHtml += '<p class="vendor_code">Артикул: ' + goods[key].vendor_code + '</p>';
								goodHtml += '<p class="prices"><span class="price">' + moneyFormat(goods[key].prices.new) + 'р.</span>';
								if(goods[key].prices.old) {
									goodHtml += ' <span class="oldprice">' + moneyFormat(goods[key].prices.old) + 'р.</span>';
								}
								goodHtml += '</p>';
								goodHtml += '<div style="margin-bottom: 20px;"><button class="ui yellow button addToCart" data-id="' + goods[key].id + '" data-price="' + goods[key].prices.new + '">Добавить в корзину</button></div>';
								goodHtml += '<div>' + goods[key].text + '</div>';
							goodHtml += '</div>';
						goodHtml += '</div>';
					goodHtml += '</div>';
					document.querySelector('#good').innerHTML = goodHtml;
				}
				
				if(goodUrl != goods[key].alias && goods[key].status === true) {

					let goodCategories = goods[key].categories;
					let goodCategoriesStr = '';
					if(goodCategories) {
						for(let goodCategoryKey in goodCategories) {
							goodCategoriesStr += goodCategoryKey + ' ';
						}
					}

					html += '<div class="card ' + goodCategoriesStr.trim() + '">';

					if(goods[key].quantity) {
						html += '<div class="ui label">Осталось<br> ' + goods[key].quantity + ' шт</div>';
					}
					
					if(!goods[key].quantity && goods[key].label == 'Новинка') {
						html += '<div class="ui label label-new">' + goods[key].label + '</div>';
					}
					
					if(!goods[key].quantity && (goods[key].label == 'Выгоднее<br>на 1000р' || goods[key].label == 'Выгоднее<br>на 2000р')) {
						html += '<div class="ui label">' + goods[key].label + '</div>';
					}
			
					if( goods[key].preview.photo[1] ) {
						html += '<div class="ui slide image reveal btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
					} else {
						html += '<div class="ui image btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
					}
					if(goods[key].preview.photo) {
						html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[0] + '" alt="' + goods[key].title + '" class="visible content">';
						if( goods[key].preview.photo[1] ) {
							html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[1] + '" alt="' + goods[key].title + '" class="hidden content">';
						}
						
					}
					html += '</div>';
					html += '<div class="content btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
						html += '<h3>' + goods[key].title + '</h3>';
						html += '<div class="description">' + goods[key].subtitle + '</div>';
						html += '<p class="prices"><span class="price">' + moneyFormat(goods[key].prices.new) + ' р.</span>';
						if(goods[key].prices.old) {
							html += ' <span class="oldprice">' + moneyFormat(goods[key].prices.old) + 'р.</span>';
						}
						html += '</p>';
					html += '</div>';
					html += '<div class="inline center">';
						html += '<button type="button" class="ui yellow button addToCart" data-id="' + goods[key].id + ' " data-price="' + goods[key].prices.new + '">В корзину</button>';
						html += '<a href="/' + goods[key].alias + '" class="ui basic black button btnOpenGoodDetailsModal" data-id="' + goods[key].id + '">Подробнее</a>';
					html += '</div>'
				html += '</div>';
				}
			}
			
			html += '</div>';
			if(document.querySelector('#catalog')) {
				document.querySelector('#catalog').innerHTML = html;
			}

			document.querySelectorAll('.btnOpenGoodDetailsModal').forEach( (btn) => {
				btn.addEventListener('click', function(e) {
					e.preventDefault();
					let goodId, goodLink;
					goodId = parseInt(this.dataset.id);
					goodLink = this.getAttribute('href') || this.dataset.link;
					if(!goodLink) {
						window.location.href = goodLink;
					} else {
						
						fetch('data.json')
							.then( response =>  response.json())
							.then( data => {
								let goods = data.goods;
								let good = goods[goodId];
								if(good && good.status === true) {
									let html = '<div class="ui stackable grid">';
										html += '<div class="seven wide column">';
											html += '<div class="image">';
												html += '<a data-lightbox="good" href="upload/goods/' + good.alias + '/large/' + good.images[0] + '">';
												html += '<img src="upload/goods/' + good.alias + '/medium/' + good.images[0] + '" class="ui fluid image" alt="">';
												html += '</a>';
											html += '</div>';
										html += '</div>'
										html += '<div class="nine wide column">';
											html += '<div class="description">';
												html += '<h4>' + good.title + '</h4>';
												html += '<p class="vendor_code">Артикул: ' + good.vendor_code + '</p>';
												html += '<p class="prices"><span class="price">' + moneyFormat(good.prices.new) + 'р.</span>';
												if(good.prices.old) {
													html += ' <span class="oldprice">' + moneyFormat(good.prices.old) + 'р.</span>';
												}
												html += '</p>'
												html += '<div style="margin-bottom: 20px;"><button class="ui yellow button addToCart" data-id="' + good.id + '" data-price="' + good.prices.new + '">Добавить в корзину</button></div>';
												html += '<p>' + good.text + '</p>';
												html += '<div><a href="/' + good.alias + '">Перейти на страницу товара</a></div>';
											html += '</div>';
										html += '</div>';
									html += '</div>';
									
									html += '<h2 style="margin-bottom: 20px;">Вас может заинтересовать:</h2>';
									
									html += '<div class="tiny-slider ui cards" id="goodsCarousel">';
									for(let key in goods) {
										if( key != goodId && goods[key].status == true) {
										
											html += '<div class="card">';
										
												if( goods[key].preview.photo[1] ) {
													html += '<div class="ui slide reveal btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
												} else {
													html += '<div class="ui">';
												}
												if(goods[key].preview.photo) {
													html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[0] + '" width="100%" alt="' + goods[key].title + '" class="visible content">';
													if( goods[key].preview.photo[1] ) {
														html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[1] + '" width="100%" alt="' + goods[key].title + '" class="hidden content">';
													}
													
												}
												html += '</div>';
												html += '<div class="content btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
													html += '<h3>' + goods[key].title + '</h3>';
													html += '<div class="description text-ellipsis">' + goods[key].subtitle + '</div>';
													html += '<p class="prices"><span class="price">' + moneyFormat(goods[key].prices.new) + ' р.</span> <span class="oldprice">' + moneyFormat(goods[key].prices.old) + ' р.</span></p>';
												html += '</div>';
												html += '<div class="inline center">';
													html += '<button type="button" class="ui fluid yellow button addToCart" data-id="' + goods[key].id + '" data-price="' + goods[key].prices.new + '">В корзину</button>';
												html += '</div>'
											html += '</div>';
										}
									}
		
									html += '</div>';
		
									document.querySelector('#goodDetailsModal .modal-body').innerHTML = html;
									let goodsSlider = tns({
										container: '#goodsCarousel',
										gutter: 0,
										items: 4,
										slideBy: 'page',
										controlsPosition: 'bottom',
										controlsText: [
											'<i class="chevron left icon"></i>',
											'<i class="chevron right icon"></i>'
										],
										nav: true,
										navPosition: 'bottom',
										speed: 300,
										autoplay: false,
										autoplayTimeout: 1500,
										loop: true,
										responsive:{
											0:{items:1,nav:false},
											480:{items:1,nav:false},
											768:{items: 3},
											970:{items: 4}
										},
										lazyload: false
									});
																		
									$('#goodDetailsModal').modal('show');
								}
							}).catch(error => {console.log('Request failed', error);});
					}
				} );
			});


        }).catch(error => {console.error('Request failed', error);});
	

	const btnOpenCartEl = document.querySelector('.btnOpenCart');
    if(btnOpenCartEl) {
        btnOpenCartEl.onclick = () => {
            generateModalCart();
            $('#cartModal').modal('show');
        }
        btnOpenCartEl.oncontextmenu = () => {
            return false;
        }
	}

	const mainTriggers = {
		items: [
			{number: 1, text: 'Раскраска напечатана экологичными чернилами, которые не дают аллергических реакций'},
			{number: 2, text: 'Плотная бумага не рвется и не мнется'},
			{number: 3, text: 'Изображены рисунки без мелких деталей'}
		],
		generateHTML() {
			let html = '<div class="ui stackable grid"><div class="three column row">';
			for(let item of this.items) {
				let {number: itemNumber, text: itemText} = item;
				html += `<div class="column">
					<div class="ui items">
						<div class="item">
							<div class="ui tiny">
								<div class="yellow_square"></div>
								<span>0${itemNumber}</span>
							</div>
							<div class="middle aligned content">
								<p>${itemText}</p>
							</div>
						</div>
					</div>
				</div>`;
			}
			html += '</div></div>';
			return html;
		}
	};

	const triggersEl = document.querySelector('.triggers');
	if(triggersEl) {
		triggersEl.innerHTML = mainTriggers.generateHTML();
	}

	// Переключение отображения товаров по категориям
	const filterLinks = document.querySelectorAll('.filter li a');
	if(filterLinks) {
		filterLinks.forEach(function(link) {
			link.addEventListener('click', function(e){
				e.preventDefault();
				document.querySelectorAll('.filter li').forEach(li => li.classList.remove('active'));
				this.parentElement.classList.add('active');
				let categoryAlias = this.getAttribute('href').slice(1) || this.getAttribute('data-filter');
				if( categoryAlias != 'all' ) {
					document.querySelectorAll('.ui.cards>.card').forEach((el) => {
						el.style.display = 'none';
					});
					document.querySelectorAll('.ui.cards>.card.' + categoryAlias).forEach((el) => {
						el.style.display = 'block';
					});
				} else {
					document.querySelectorAll('.ui.cards>.card').forEach((el) => {
						el.style.display = 'block';
					});
				}
			});
		});
	}

};

// LIGHTBOX
const lightbox = new SimpleLightbox('a[data-lightbox="gallery"]', {
	sourceAttr: 'href',
	overlay: true,
	spinner: true,
	nav: true,
	navText: ['←','→'],
	captions: true,
	captionSelector: 'img',
	captionType: 'attr'
});

// TINY SLIDER
if(document.querySelector('#reviewTinySlider')) {
	let slider = tns({
		container: '#reviewTinySlider',
		gutter: 80,
		edgePadding: 0,
		items: 3,
		slideBy: 'page',
		controlsPosition: 'bottom',
		controlsText: [
			'<i class="chevron left icon"></i>',
			'<i class="chevron right icon"></i>'
		],
		nav: true,
		navPosition: 'bottom',
		speed: 300,
		autoplay: false,
		autoplayTimeout: 1500,
		loop: true,
		responsive:{
			0:{items:1,nav:false},
			480:{items:1,nav:false},
			768:{items: 2},
			970:{items: 3},
		},
		lazyload: true
	});
}

// ADD GOOD TO CART
if(document.body && document.querySelectorAll('.addToCart')) {
	document.body.addEventListener('click', function (e) {
		if (e.target && e.target.classList.contains('addToCart')) {
			e.target.disabled = true;
			let goodId = parseInt(e.target.dataset.id);
			let price = parseFloat(e.target.dataset.price);
			if(goodId) {
				let cartData = JSON.parse(localStorage.getItem('cart')) || {};
				if(cartData.hasOwnProperty(goodId)){
					cartData[goodId] += 1;
				} else {
					cartData[goodId] = 1;
				}
				localStorage.setItem('cart', JSON.stringify(cartData));
			}
			generateModalCart();
			$('#cartModal').modal('show');
			
			if( typeof fbq != 'undefined' ) {
				fbq('track','AddToCart',{
					value: price,
					currency: 'RUB',
					content_type: 'product',
					content_ids: String(goodId)
				});
			}
			e.target.disabled = false;
			console.clear();
		}
	});
}

// NUMBER SPINNER
if(document.body && document.querySelectorAll('.number-spinner-button')) {
	document.body.addEventListener('click', function (e) {
		if (e.target && e.target.classList.contains('number-spinner-button')) {
			let numberSpinnerInput = Array.from(e.target.parentNode.children).filter((child) => child !== e.target && child.tagName == 'INPUT');
			if(numberSpinnerInput) {
				let oldValue = parseInt(numberSpinnerInput[0].value.trim()), newVal = 0;
				let goodId = numberSpinnerInput[0].dataset.id;
				if (e.target.dataset.dir == 'up') {
					newVal = parseInt(oldValue) + 1;					
				} else {
					if (oldValue >= 1) {
						newVal = parseInt(oldValue) - 1;					
					} else {
						newVal = 1
					}
				}
				if(oldValue >= 1 && newVal == 0 ) {
					document.querySelector('.btnDeleteCartGood[data-id="' + goodId + '"]').click();
				} else {
					numberSpinnerInput[0].value = newVal;
					let cartData = JSON.parse(localStorage.getItem('cart')) || {};
					cartData[goodId] = newVal;
					localStorage.setItem('cart', JSON.stringify(cartData));
					generateModalCart();
				}
			}
		}
	});
}

// DELETE GOOD FROM CART
if(document.body && document.querySelectorAll('.btnDeleteCartGood')) {
	document.body.addEventListener('click', function (e) {
		if (e.target && e.target.classList.contains('btnDeleteCartGood')) {
			e.target.setAttribute('disabled', 'disabled');
			let result = window.confirm('Вы уверены, что хотите удалить товар из корзины');
			if(result == true) {
				let goodId = parseInt(e.target.dataset.id);
				if(goodId) {
					let cartData = JSON.parse(localStorage.getItem('cart')) || {};
					delete cartData[goodId];
					localStorage.setItem('cart', JSON.stringify(cartData));
					generateModalCart();
					$('#cartModal').modal('show');
				}
			}
			e.target.removeAttribute('disabled');
		}
	});
}

// CLOSE GOOD DETAILS MODAL
if(document.querySelector('.btnCloseGoodDetailsModal')) {
	document.querySelector('.btnCloseGoodDetailsModal').onclick = () => {
		$('#goodDetailsModal').modal('hide');
	};
}



// LAZY LOAD
const lazyImages = document.querySelectorAll('.lazy');
const observer = new IntersectionObserver(images => {
	images.forEach(image => {
		if(image.intersectionRatio > 0) {
			image.target.src = image.target.getAttribute('data-src');
		}
	});
}, {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
});
lazyImages.forEach(image => {
	observer.observe(image);
});

// SCROLL TO ELEMENT
let scrollBtnLinkEls = document.getElementsByClassName('scroll-btn-link');
if(scrollBtnLinkEls) {
	for(let link of scrollBtnLinkEls) {
		link.onclick = function(e) {
			e.preventDefault();
			let target = e.target.dataset.target || this.getAttribute('href');
			if(target) {
				/*var c = document.querySelector(target).getBoundingClientRect(),
				scrolltop = document.body.scrollTop + c.top,
				scrollleft = document.body.scrollLeft + c.left;
				window.scrollTo(c.top,c.left);*/
				//window.scrollTo(0,0);
				//console.log(c)
				$('body, html').animate({ scrollTop: $(target).offset().top }, 1000);
			}
		};
	}
}

let orderId = parseInt($_GET('order_id'));
if(orderId) {
	let promise = new Promise( (resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open('GET', '/info.php?order_id=' + orderId, true);
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				let data = JSON.parse(this.response);
				resolve(data);
				let goodUrl = location.pathname.trim().substr(1);
				
				if(goodUrl != 'thanks') {
					document.getElementById('paymentOrderId').value = data.id;
					if( goodUrl == 'prepay' ) {
						document.getElementById('paymentDescription').value = 'Предоплата за заказ №' + data.id;
						document.getElementById('paymentSum').value = data.delivery.cost;
					} else {
						document.getElementById('paymentDescription').value = 'Оплата заказа №' + data.id;
						document.getElementById('paymentSum').value = data.sum;
					}
				}
				if( document.getElementById('paymentDetails') ) {
				
					let html = '<div class="ui segment">';

						html += '<div>';
							html += '<h3>Детали заказа:</h3>';
							html += '<ul>';
								html += '<li>';
									html += '<span>Номер заказа:</span>';
									html += '<span>№' + data.id + '</span>';
								html += '</li>';
								html += '<li>';
									html += '<span>ФИО плательщика:</span>';
									html += '<span>' + data.fullname + '</span>';
								html += '</li>';
								//html += '<li>';
									//html += '<span>Контактный телефон:</span>';
									//html += '<span>' + data.phone + '</span>';
								//html += '</li>';
							html += '</ul>';
						html += '</div>';

						if(data.items) {
							html += '<div>';
								html += '<h3>Состав заказа:</h3>';
									html += '<ul>';
										for(let i = 0; i < data.items.length; i++) {
											html += '<li>';
												html += '<span>' + data.items[i].title + '<br>(' + data.items[i].quantity + 'ш. ' + data.items[i].selling_price + 'р.)</span>';
												html += '<span>' + data.items[i].quantity * data.items[i].selling_price + ' руб.</span>';
											html += '</li>';
										}
										html += '<li>';
											html += '<span>Доставка<br>' + data.delivery.cost + ' руб</span>';
										html += '</li>';
										html += '<li>';
											html += '<span><b>ИТОГО</b></span>';
											html += '<span>' + data.sum + ' руб.</span>';
										html += '</li>';

									html += '</ul>';
							html += '</div>';
						}

						html += '<div>';
							html += '<h3>Адрес доставки:</h3>';
							html += '<p>' + data.delivery.fulladdress + '</p>';
						html += '</div>';
					html += '</div>';

					document.getElementById('paymentDetails').innerHTML = html;
				}
			} else {
				// We reached our target server, but it returned an error
				
			}
		};
		request.onerror = () => {
			// There was a connection error of some sort
			console.error('something went wrong')
			//reject(error);
		};
		request.send();
	} );

	promise
	.then((data) => {
		return data.created_at;
	})
	.then((date) => {
		console.log('Order created at', date);
	})
	.catch((error) => {
		console.log(error);
	});
}

// PREVENT DOUBLE CLICK
if(document.querySelector('#cartProcessForm')) {
	document.querySelector('#cartProcessForm').addEventListener('submit', function(e) {
		//e.preventDefault();
		let totalSum = parseFloat(document.querySelector('#submitCartForm').dataset.totalsum);
		let goodsIds = document.querySelector('#cartModal form input[name=goods]').value;
		//console.log(goodsIds);
		fbq('track', 'Purchase', {
			value: totalSum,
			currency: 'RUB',
			content_type: 'product',
			//content_ids: goodsIds
		});
		//storage.clear();
		document.querySelector('#submitCartForm').disabled = true;
	});
}

// Scroll-to-top Button
let scrollToTopBtn = document.querySelector('.scrollToTopBtn');
let rootElement = document.documentElement;
function handleScroll() {
	var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
	if ((rootElement.scrollTop / scrollTotal ) > 0.80) {
		scrollToTopBtn.style.display = 'block';
	} else {
		scrollToTopBtn.style.display = 'none'
	}
}
function scrollToTop(e) {
	e.preventDefault();
	rootElement.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}
if(scrollToTopBtn) {
	scrollToTopBtn.addEventListener('click', scrollToTop);
	document.addEventListener('scroll', handleScroll);
}

// LOAD
document.querySelectorAll('.include').forEach((tag) => {
	fetch(tag.dataset.file).then(res => {
		return res.text();
	}).then(data => {
		tag.innerHTML = data
	});
});

let cartModalNameEl = document.getElementById('cartModalName');
if(cartModalNameEl) {
	cartModalNameEl.onkeypress = function(event) {
		if( (event.keyCode >= 48 && event.keyCode <= 57) || this.value.length > 100 ) {
			return false;
		}
	}
}

// MASKED INPUT
const telInputs = document.querySelectorAll('input[type="tel"]');
if(telInputs) {
	telInputs.forEach((input) => {
		let mask = IMask(input, {
			mask: '+{7}(#00) 000-00-00',
			definitions: {
				'#': /[0-6|9]/
			},
			lazy: false,  // make placeholder always visible
			placeholderChar: '_' // defaults to '_'
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	[].forEach.call(document.querySelectorAll('#delivery .ui.segment'), function(el) {
		el.addEventListener('click', function() {
			document.querySelectorAll('#delivery .ui.segment').forEach((e) => {
				e.classList.remove('active');
			});
			let ind = this.dataset.index;
			this.classList.add('active');
			document.querySelector('#deliverySlide').setAttribute('src','/upload/pages/delivery-' + ind + '.jpg');
		})
	});
});

let submitCartFormEl = document.getElementById('submitCartForm');
let cartFormCheckboxEl = document.getElementById('cartFormCheckbox');
/*cartFormCheckboxEl.onchange = () => {
    if( cartFormCheckboxEl.checked ) {
        //submitCartFormEl
    } else {
        //submitCartFormEl
    }
}*/

let deliveryTypeEls = document.getElementsByName('delivery');
if(deliveryTypeEls) {
    for(let deliveryTypeEl of deliveryTypeEls) {
        deliveryTypeEl.onchange = function() {
            if( this.value != 'sd' ) {
                document.getElementById('addressFormInput').style.display = 'block';
            } else {
                document.getElementById('addressFormInput').style.display = 'none';
            }       
        }
    }
}
if(document.getElementById('copyrightYear')) {
	const now = new Date();
	const fullYear = now.getFullYear();
	const copyrightYearEl = document.getElementById('copyrightYear');
	copyrightYearEl.style.color = 'black';
	copyrightYearEl.innerHTML = fullYear;
}
if(document.getElementById('cartFormSelect')) {
	let cartFormSelectEl = document.getElementById('cartFormSelect');
	cartFormSelectEl.parentElement.style.display = 'none';
	/*cartFormSelectEl.onchange = () => {
		//alert(7);
	}*/
}
