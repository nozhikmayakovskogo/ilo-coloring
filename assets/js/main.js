"use strict";
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function moneyFormat(int) {
    var str = String(int);
    var x = str.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}
function $_GET(key) {
    var s = window.location.search.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}
var btnOpenCartCounter = document.querySelector('.btnOpenCart .counter');
var submitCartFormEl = document.querySelector('#submitCartForm');
var deliveryTypesFormEl = document.getElementById('deliveryTypesForm');
var btnOpenGoodDetailsModalEls = document.querySelectorAll('.btnOpenGoodDetailsModal');
function generateModalCart() {
    fetch('data.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var goods = data.goods;
        var totalSum = 0;
        var html = '<tbody>';
        var cartData = JSON.parse(localStorage.getItem('cart'));
        var cartCount = Object.keys(cartData).length;
        btnOpenCartCounter.textContent = cartCount ? cartCount : 0;
        if (cartCount) {
            for (key in cartData) {
                var good = goods[key];
                if (good) {
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
                    html += '<div><p class="price">' + moneyFormat(good.prices["new"]) + ' р.</p></div>';
                    html += '</div>';
                    html += '</td>';
                    html += '<td data-label="Qty">';
                    html += '<div class="ui input number-spinner">';
                    html += '<button type="button" class="number-spinner-button" data-dir="down"><i class="icon minus"></i></button>';
                    html += '<input type="text" value="' + cartData[key] + '" data-id="' + good.id + '">';
                    html += '<button type="button" class="number-spinner-button" data-dir="up"><i class="icon plus"></i></button>';
                    html += '</div>';
                    html += '</td>';
                    html += '<td data-label="Price"><p class="price">' + moneyFormat(good.prices["new"]) + ' р.</p></td>';
                    html += '<td data-label="Action"><button type="button" class="btnDeleteCartGood" data-id="' + good.id + '" title="Удалить"><i class="icon x"></i></button></td>';
                    html += '</tr>';
                    totalSum += parseInt(good.prices["new"]) * cartData[key];
                }
            }
        }
        else {
            html += '<tr><td colspan="5">Товаров в корзине нет</td></tr>';
        }
        html += '</tbody>';
        var cartModalTableEl = document.querySelector('#cartModalTable');
        cartModalTableEl.innerHTML = html;
        var totalSumEl = document.querySelector('#totalSum');
        totalSumEl.innerText = moneyFormat(totalSum);
        submitCartFormEl.setAttribute('data-totalsum', totalSum.toString());
        var btnOpenCartEl = document.querySelector('.btnOpenCart');
        btnOpenCartEl.setAttribute('data-tooltip', '= ' + moneyFormat(totalSum) + ' р.');
        document.querySelector('#cartModal form input[name=goods]').value = JSON.stringify(cartData);
    })["catch"](function (error) { return console.error('Request failed', error); });
}
var Page = /** @class */ (function () {
    function Page(title, keywords, description) {
        this.sitename = 'Гигантские раскраски ilo';
        this.hash = '#';
        this.url = '/';
        this.title = title;
        this.keywords = keywords;
        this.description = description;
    }
    Page.prototype.setTitle = function () {
        document.title = this.title;
    };
    Page.getPage = function () {
        var currentUrl = location.pathname.substr(1).trim().replace('.html', '');
        alert(currentUrl + ' test');
    };
    return Page;
}());
function loadPage() {
    var currentUrl = location.pathname.substr(1).trim().replace('.html', '');
    if (!currentUrl) {
        var page = new Page('Гигантские раскраски ilo');
    }
    else {
        alert(currentUrl);
    }
}
var deliveryTypes = {
    "sd": "Самовывоз (Санкт-Петербург)",
    "russian-post": "Почтой России",
    "courier": "Бесконтактная курьерская доставка"
};
if (deliveryTypes && deliveryTypesFormEl) {
    var deliveryTypesHtml = '<div class="grouped fields">';
    deliveryTypesHtml += '<label>Выберите тип доставки</label>';
    for (var key in deliveryTypes) {
        deliveryTypesHtml += '<div class="field"><div class="ui radio">';
        if (key == 'sd') {
            deliveryTypesHtml += '<label><input type="radio" name="delivery" value="' + key + '" checked> ' + deliveryTypes[key] + '</label>';
        }
        else {
            deliveryTypesHtml += '<label><input type="radio" name="delivery" value="' + key + '"> ' + deliveryTypes[key] + '</label>';
        }
        deliveryTypesHtml += '</div></div>';
    }
    deliveryTypesHtml += '</div>';
    deliveryTypesFormEl.innerHTML = deliveryTypesHtml;
}
window.onload = function () {
    var formEls = document.querySelectorAll('form');
    if (formEls) {
        formEls.forEach(function (e) {
            e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="timezone" value="' + getTimeZone() + '">');
            e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="user_city" value="' + ymaps.geolocation.city + '">');
            e.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="g-recaptcha-response" class="g-recaptcha-response" value="">');
        });
    }
    var formInputNameCity = document.querySelector('form input[name=city]');
    if (formInputNameCity) {
        formInputNameCity.value = ymaps.geolocation.city;
    }
    var cartModalFormEl = document.querySelector('#cartModal form');
    if (cartModalFormEl) {
        cartModalFormEl.insertAdjacentHTML('beforeEnd', '<input type="hidden" name="goods" value="">');
    }
    // Кнопка вызова миникорзины
    //localStorage.clear();
    var cartData = JSON.parse(localStorage.getItem('cart')) || {};
    var cartCount = Object.keys(cartData).length;
    if (cartCount && btnOpenCartCounter) {
        btnOpenCartCounter.textContent = cartCount;
    }
    fetch('data.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var goods = data.goods;
        var totalSum = 0;
        for (key in cartData) {
            var good = goods[key];
            if (good && cartData.hasOwnProperty(key)) {
                totalSum += good.prices["new"] * cartData[key];
            }
            var btnOpenCartEl_1 = document.querySelector('.btnOpenCart');
            if (btnOpenCartEl_1) {
                btnOpenCartEl_1.setAttribute('data-tooltip', "= " + moneyFormat(totalSum) + " \u0440.");
            }
        }
        ;
        var html = '<div class="ui three stackable cards">';
        var goodUrl = location.pathname.substr(1).trim().replace('.html', '');
        for (var key in goods) {
            if (goodUrl && goodUrl == goods[key].alias && goods[key].status === true) {
                var goodHtml = '<div class="ui stackable grid">';
                goodHtml += '<div class="seven wide column">';
                goodHtml += '<div class="image">';
                goodHtml += '<a data-lightbox="good" href="upload/goods/' + goods[key].alias + '/large/' + goods[key].images[0] + '">';
                goodHtml += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].images[0] + '" class="ui fluid image" alt="">';
                goodHtml += '</a>';
                goodHtml += '</div>';
                goodHtml += '</div>';
                goodHtml += '<div class="nine wide column">';
                goodHtml += '<div class="description">';
                goodHtml += '<h4>' + goods[key].title + '</h4>';
                goodHtml += '<p class="vendor_code">Артикул: ' + goods[key].vendor_code + '</p>';
                goodHtml += '<p class="prices"><span class="price">' + moneyFormat(goods[key].prices["new"]) + 'р.</span>';
                if (goods[key].prices.old) {
                    goodHtml += ' <span class="oldprice">' + moneyFormat(goods[key].prices.old) + 'р.</span>';
                }
                goodHtml += '</p>';
                goodHtml += '<div style="margin-bottom: 20px;"><button class="ui yellow button addToCart" data-id="' + goods[key].id + '" data-price="' + goods[key].prices["new"] + '">Добавить в корзину</button></div>';
                goodHtml += '<div>' + goods[key].text + '</div>';
                goodHtml += '</div>';
                goodHtml += '</div>';
                goodHtml += '</div>';
                var goodEl = document.querySelector('#good');
                goodEl.innerHTML = goodHtml;
            }
            if (goodUrl != goods[key].alias && goods[key].status === true) {
                var goodCategories = goods[key].categories;
                var goodCategoriesStr = '';
                if (goodCategories) {
                    for (var goodCategoryKey in goodCategories) {
                        goodCategoriesStr += goodCategoryKey + ' ';
                    }
                }
                html += '<div class="card ' + goodCategoriesStr.trim() + '">';
                if (goods[key].quantity) {
                    html += '<div class="ui label">Осталось<br> ' + goods[key].quantity + ' шт</div>';
                }
                if (!goods[key].quantity && goods[key].label == 'Новинка') {
                    html += '<div class="ui label label-new">' + goods[key].label + '</div>';
                }
                if (!goods[key].quantity && (goods[key].label == 'Выгоднее<br>на 1000р' || goods[key].label == 'Выгоднее<br>на 2000р')) {
                    html += '<div class="ui label">' + goods[key].label + '</div>';
                }
                if (goods[key].preview.photo[1]) {
                    html += '<div class="ui slide image reveal btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
                }
                else {
                    html += '<div class="ui image btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
                }
                if (goods[key].preview.photo) {
                    html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[0] + '" alt="' + goods[key].title + '" class="visible content">';
                    if (goods[key].preview.photo[1]) {
                        html += '<img src="upload/goods/' + goods[key].alias + '/medium/' + goods[key].preview.photo[1] + '" alt="' + goods[key].title + '" class="hidden content">';
                    }
                }
                html += '</div>';
                html += '<div class="content btnOpenGoodDetailsModal" data-id="' + goods[key].id + '" data-link="/' + goods[key].alias + '">';
                html += '<h3>' + goods[key].title + '</h3>';
                html += '<div class="description">' + goods[key].subtitle + '</div>';
                html += '<p class="prices"><span class="price">' + moneyFormat(goods[key].prices["new"]) + ' р.</span>';
                if (goods[key].prices.old) {
                    html += ' <span class="oldprice">' + moneyFormat(goods[key].prices.old) + 'р.</span>';
                }
                html += '</p>';
                html += '</div>';
                html += '<div class="inline center">';
                html += '<button type="button" class="ui yellow button addToCart" data-id="' + goods[key].id + ' " data-price="' + goods[key].prices["new"] + '">В корзину</button>';
                html += '<a href="/' + goods[key].alias + '" class="ui basic black button btnOpenGoodDetailsModal" data-id="' + goods[key].id + '">Подробнее</a>';
                html += '</div>';
                html += '</div>';
            }
        }
        html += '</div>';
        var catalogEl = document.querySelector('#catalog');
        if (catalogEl) {
            catalogEl.innerHTML = html;
        }
        document.querySelectorAll('.btnOpenGoodDetailsModal').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var goodId, goodLink;
                goodId = parseInt(this.dataset.id);
                goodLink = this.getAttribute('href') || this.dataset.link;
                if (!goodLink) {
                    window.location.href = goodLink;
                }
                else {
                    fetch('data.json')
                        .then(function (response) { return response.json(); })
                        .then(function (data) {
                        var goods = data.goods;
                        var good = goods[goodId];
                        if (good && good.status === true) {
                            var html_1 = '<div class="ui stackable grid">';
                            html_1 += '<div class="seven wide column">';
                            html_1 += '<div class="image">';
                            html_1 += '<a data-lightbox="good" href="upload/goods/' + good.alias + '/large/' + good.images[0] + '">';
                            html_1 += '<img src="upload/goods/' + good.alias + '/medium/' + good.images[0] + '" class="ui fluid image" alt="">';
                            html_1 += '</a>';
                            html_1 += '</div>';
                            html_1 += '</div>';
                            html_1 += '<div class="nine wide column">';
                            html_1 += '<div class="description">';
                            html_1 += '<h4>' + good.title + '</h4>';
                            html_1 += '<p class="vendor_code">Артикул: ' + good.vendor_code + '</p>';
                            html_1 += '<p class="prices"><span class="price">' + moneyFormat(good.prices["new"]) + 'р.</span>';
                            if (good.prices.old) {
                                html_1 += ' <span class="oldprice">' + moneyFormat(good.prices.old) + 'р.</span>';
                            }
                            html_1 += '</p>';
                            html_1 += '<div style="margin-bottom: 20px;"><button class="ui yellow button addToCart" data-id="' + good.id + '" data-price="' + good.prices["new"] + '">Добавить в корзину</button></div>';
                            html_1 += '<p>' + good.text + '</p>';
                            html_1 += '<div><a href="/' + good.alias + '">Перейти на страницу товара</a></div>';
                            html_1 += '</div>';
                            html_1 += '</div>';
                            html_1 += '</div>';
                            html_1 += '<h2 style="margin-bottom: 20px;">Вас может заинтересовать:</h2>';
                            html_1 += '<div class="tiny-slider ui cards" id="goodsCarousel">';
                            for (var key_1 in goods) {
                                if (key_1 != goodId && goods[key_1].status == true) {
                                    html_1 += '<div class="card">';
                                    if (goods[key_1].preview.photo[1]) {
                                        html_1 += '<div class="ui slide reveal btnOpenGoodDetailsModal" data-id="' + goods[key_1].id + '" data-link="/' + goods[key_1].alias + '">';
                                    }
                                    else {
                                        html_1 += '<div class="ui">';
                                    }
                                    if (goods[key_1].preview.photo) {
                                        html_1 += '<img src="upload/goods/' + goods[key_1].alias + '/medium/' + goods[key_1].preview.photo[0] + '" width="100%" alt="' + goods[key_1].title + '" class="visible content">';
                                        if (goods[key_1].preview.photo[1]) {
                                            html_1 += '<img src="upload/goods/' + goods[key_1].alias + '/medium/' + goods[key_1].preview.photo[1] + '" width="100%" alt="' + goods[key_1].title + '" class="hidden content">';
                                        }
                                    }
                                    html_1 += '</div>';
                                    html_1 += '<div class="content btnOpenGoodDetailsModal" data-id="' + goods[key_1].id + '" data-link="/' + goods[key_1].alias + '">';
                                    html_1 += '<h3>' + goods[key_1].title + '</h3>';
                                    html_1 += '<div class="description text-ellipsis">' + goods[key_1].subtitle + '</div>';
                                    html_1 += '<p class="prices"><span class="price">' + moneyFormat(goods[key_1].prices["new"]) + ' р.</span> <span class="oldprice">' + moneyFormat(goods[key_1].prices.old) + ' р.</span></p>';
                                    html_1 += '</div>';
                                    html_1 += '<div class="inline center">';
                                    html_1 += '<button type="button" class="ui fluid yellow button addToCart" data-id="' + goods[key_1].id + '" data-price="' + goods[key_1].prices["new"] + '">В корзину</button>';
                                    html_1 += '</div>';
                                    html_1 += '</div>';
                                }
                            }
                            html_1 += '</div>';
                            var goodDetailsModalBodyEl = document.querySelector('#goodDetailsModal .modal-body');
                            goodDetailsModalBodyEl.innerHTML = html_1;
                            var goodsSlider = tns({
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
                                responsive: {
                                    0: { items: 1, nav: false },
                                    480: { items: 1, nav: false },
                                    768: { items: 3 },
                                    970: { items: 4 }
                                },
                                lazyload: false
                            });
                            $('#goodDetailsModal').modal('show');
                            $('.modal-body a').click(function (e) {
                                e.preventDefault();
                                var href = $(this).attr('href');
                                //ajaxLoadPage(href);
                                loadPage();
                                history.pushState({ page: href }, null, href);
                            });
                        }
                    })["catch"](function (error) { console.log('Request failed', error); });
                }
            });
        });
    })["catch"](function (error) { console.error('Request failed', error); });
    var btnOpenCartEl = document.querySelector('.btnOpenCart');
    if (btnOpenCartEl) {
        btnOpenCartEl.onclick = function () {
            generateModalCart();
            $('#cartModal').modal('show');
        };
        btnOpenCartEl.oncontextmenu = function () { return false; };
    }
    var mainTriggers = {
        items: [
            { number: 1, text: 'Раскраска напечатана экологичными чернилами, которые не дают аллергических реакций' },
            { number: 2, text: 'Плотная бумага не рвется и не мнется' },
            { number: 3, text: 'Изображены рисунки без мелких деталей' }
        ],
        generateHTML: function () {
            var html = '<div class="ui stackable grid"><div class="three column row">';
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                var itemNumber = item.number, itemText = item.text;
                html += "<div class=\"column\">\n\t\t\t\t\t<div class=\"ui items\">\n\t\t\t\t\t\t<div class=\"item\">\n\t\t\t\t\t\t\t<div class=\"ui tiny\">\n\t\t\t\t\t\t\t\t<div class=\"yellow_square\"></div>\n\t\t\t\t\t\t\t\t<span>0" + itemNumber + "</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"middle aligned content\">\n\t\t\t\t\t\t\t\t<p>" + itemText + "</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>";
            }
            html += '</div></div>';
            return html;
        }
    };
    var triggersEl = document.querySelector('.triggers');
    if (triggersEl) {
        triggersEl.innerHTML = mainTriggers.generateHTML();
    }
    // Переключение отображения товаров по категориям
    var filterLinks = document.querySelectorAll('.filter li a');
    if (filterLinks) {
        filterLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelectorAll('.filter li').forEach(function (li) { return li.classList.remove('active'); });
                this.parentElement.classList.add('active');
                var categoryAlias = this.getAttribute('href').slice(1) || this.getAttribute('data-filter');
                if (categoryAlias != 'all') {
                    document.querySelectorAll('.ui.cards>.card').forEach(function (el) {
                        el.style.display = 'none';
                    });
                    document.querySelectorAll('.ui.cards>.card.' + categoryAlias).forEach(function (el) {
                        el.style.display = 'block';
                    });
                }
                else {
                    document.querySelectorAll('.ui.cards>.card').forEach(function (el) {
                        el.style.display = 'block';
                    });
                }
            });
        });
    }
};
// LIGHTBOX
var lightbox = new SimpleLightbox('a[data-lightbox="gallery"]', {
    sourceAttr: 'href',
    overlay: true,
    spinner: true,
    nav: true,
    navText: ['←', '→'],
    captions: true,
    captionSelector: 'img',
    captionType: 'attr'
});
// TINY SLIDER
if (document.querySelector('#reviewTinySlider')) {
    var slider = tns({
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
        responsive: {
            0: { items: 1, nav: false },
            480: { items: 1, nav: false },
            768: { items: 2 },
            970: { items: 3 }
        },
        lazyload: true
    });
}
// ADD GOOD TO CART
if (document.body && document.querySelectorAll('.addToCart')) {
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('addToCart')) {
            e.target.disabled = true;
            var goodId = parseInt(e.target.dataset.id);
            var price = parseFloat(e.target.dataset.price);
            if (goodId) {
                var cartData = JSON.parse(localStorage.getItem('cart')) || {};
                if (cartData.hasOwnProperty(goodId)) {
                    cartData[goodId] += 1;
                }
                else {
                    cartData[goodId] = 1;
                }
                localStorage.setItem('cart', JSON.stringify(cartData));
            }
            generateModalCart();
            $('#cartModal').modal('show');
            if (typeof fbq != 'undefined') {
                fbq('track', 'AddToCart', {
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
if (document.body && document.querySelectorAll('.number-spinner-button')) {
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('number-spinner-button')) {
            var numberSpinnerInput = Array.from(e.target.parentNode.children).filter(function (child) { return child !== e.target && child.tagName == 'INPUT'; });
            if (numberSpinnerInput) {
                var oldValue = parseInt(numberSpinnerInput[0].value.trim()), newVal = 0;
                var goodId = numberSpinnerInput[0].dataset.id;
                if (e.target.dataset.dir == 'up') {
                    newVal = parseInt(oldValue) + 1;
                }
                else {
                    if (oldValue >= 1) {
                        newVal = parseInt(oldValue) - 1;
                    }
                    else {
                        newVal = 1;
                    }
                }
                if (oldValue >= 1 && newVal == 0) {
                    document.querySelector('.btnDeleteCartGood[data-id="' + goodId + '"]').click();
                }
                else {
                    numberSpinnerInput[0].value = newVal;
                    var cartData = JSON.parse(localStorage.getItem('cart')) || {};
                    cartData[goodId] = newVal;
                    localStorage.setItem('cart', JSON.stringify(cartData));
                    generateModalCart();
                }
            }
        }
    });
}
// DELETE GOOD FROM CART
if (document.body && document.querySelectorAll('.btnDeleteCartGood')) {
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btnDeleteCartGood')) {
            e.target.setAttribute('disabled', 'disabled');
            var result = window.confirm('Вы уверены, что хотите удалить товар из корзины');
            if (result == true) {
                var goodId = parseInt(e.target.dataset.id);
                if (goodId) {
                    var cartData = JSON.parse(localStorage.getItem('cart')) || {};
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
var btnCloseGoodDetailsModalEl = document.querySelector('.btnCloseGoodDetailsModal');
if (btnCloseGoodDetailsModalEl) {
    btnCloseGoodDetailsModalEl.onclick = function () {
        $('#goodDetailsModal').modal('hide');
    };
}
// LAZY LOAD
var lazyImages = document.querySelectorAll('.lazy');
var observer = new IntersectionObserver(function (images) {
    images.forEach(function (image) {
        if (image.intersectionRatio > 0) {
            image.target.src = image.target.getAttribute('data-src');
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});
lazyImages.forEach(function (image) {
    observer.observe(image);
});
// SCROLL TO ELEMENT
var scrollBtnLinkEls = document.getElementsByClassName('scroll-btn-link');
if (scrollBtnLinkEls) {
    for (var _i = 0, scrollBtnLinkEls_1 = scrollBtnLinkEls; _i < scrollBtnLinkEls_1.length; _i++) {
        var link = scrollBtnLinkEls_1[_i];
        link.onclick = function (e) {
            e.preventDefault();
            var target = e.target.dataset.target || this.getAttribute('href');
            if (target) {
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
var orderId = parseInt($_GET('order_id'));
if (orderId) {
    var promise = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', '/info.php?order_id=' + orderId, true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var data = JSON.parse(this.response);
                resolve(data);
                var goodUrl = location.pathname.trim().substr(1);
                if (goodUrl != 'thanks') {
                    var paymentOrderIdEl = document.getElementById('paymentOrderId');
                    var paymentDescriptionEl = document.getElementById('paymentDescription');
                    var paymentSumdEl = document.getElementById('paymentSum');
                    paymentOrderIdEl.value = data.id;
                    if (goodUrl == 'prepay') {
                        paymentDescriptionEl.value = 'Предоплата за заказ №' + data.id;
                        paymentSumdEl.value = data.delivery.cost;
                    }
                    else {
                        paymentDescriptionEl.value = 'Оплата заказа №' + data.id;
                        paymentSumdEl.value = data.sum;
                    }
                }
                if (document.getElementById('paymentDetails')) {
                    var html = '<div class="ui segment">';
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
                    //html += '<li>'
                    //html += '<span>Контактный телефон:</span>'
                    //html += '<span>' + data.phone + '</span>'
                    //html += '</li>'
                    html += '</ul>';
                    html += '</div>';
                    if (data.items) {
                        html += '<div>';
                        html += '<h3>Состав заказа:</h3>';
                        html += '<ul>';
                        for (var i = 0; i < data.items.length; i++) {
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
                    var paymentDetailsEl = document.getElementById('paymentDetails');
                    paymentDetailsEl.innerHTML = html;
                }
            }
            else {
                // We reached our target server, but it returned an error
            }
        };
        request.onerror = function () {
            // There was a connection error of some sort
            console.error('something went wrong');
            //reject(error);
        };
        request.send();
    });
    promise
        .then(function (data) {
        return data.created_at;
    })
        .then(function (date) {
        console.log('Order created at', date);
    })["catch"](function (error) {
        console.log(error);
    });
}
// PREVENT DOUBLE CLICK
if (document.querySelector('#cartProcessForm')) {
    document.querySelector('#cartProcessForm').addEventListener('submit', function (e) {
        //e.preventDefault();
        var totalSum = parseFloat(submitCartFormEl.dataset.totalsum);
        var goodsIds = document.querySelector('#cartModal form input[name=goods]').value;
        //console.log(goodsIds);
        fbq('track', 'Purchase', {
            value: totalSum,
            currency: 'RUB',
            content_type: 'product'
        });
        //storage.clear();
        submitCartFormEl.disabled = true;
    });
}
// Scroll-to-top Button
var scrollToTopBtn = document.querySelector('.scrollToTopBtn');
var rootElement = document.documentElement;
function handleScroll() {
    var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    if ((rootElement.scrollTop / scrollTotal) > 0.80) {
        scrollToTopBtn.style.display = 'block';
    }
    else {
        scrollToTopBtn.style.display = 'none';
    }
}
function scrollToTop(e) {
    e.preventDefault();
    rootElement.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', scrollToTop);
    document.addEventListener('scroll', handleScroll);
}
// LOAD
document.querySelectorAll('.include').forEach(function (tag) {
    fetch(tag.dataset.file).then(function (res) {
        return res.text();
    }).then(function (data) {
        tag.innerHTML = data;
    });
});
var cartModalNameEl = document.getElementById('cartModalName');
if (cartModalNameEl) {
    cartModalNameEl.onkeypress = function (event) {
        if ((event.keyCode >= 48 && event.keyCode <= 57) || this.value.length > 100) {
            return false;
        }
    };
}
// MASKED INPUT
var telInputs = document.querySelectorAll('input[type="tel"]');
if (telInputs) {
    telInputs.forEach(function (input) {
        var mask = IMask(input, {
            mask: '+{7}(#00) 000-00-00',
            definitions: {
                '#': /[0-6|9]/
            },
            lazy: false,
            placeholderChar: '_' // defaults to '_'
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.querySelectorAll('#delivery .ui.segment'), function (el) {
        el.addEventListener('click', function () {
            document.querySelectorAll('#delivery .ui.segment').forEach(function (e) {
                e.classList.remove('active');
            });
            var ind = this.dataset.index;
            this.classList.add('active');
            document.querySelector('#deliverySlide').setAttribute('src', '/upload/pages/delivery-' + ind + '.jpg');
        });
    });
});
var cartFormCheckboxEl = document.getElementById('cartFormCheckbox');
/*cartFormCheckboxEl.onchange = () => {
    if( cartFormCheckboxEl.checked ) {
        //submitCartFormEl
    } else {
        //submitCartFormEl
    }
}*/
var deliveryTypeEls = document.getElementsByName('delivery');
if (deliveryTypeEls) {
    for (var _a = 0, deliveryTypeEls_1 = deliveryTypeEls; _a < deliveryTypeEls_1.length; _a++) {
        var deliveryTypeEl = deliveryTypeEls_1[_a];
        deliveryTypeEl.onchange = function () {
            var addressFormInputEl = document.getElementById('addressFormInput');
            if (this.value != 'sd') {
                addressFormInputEl.style.display = 'block';
            }
            else {
                addressFormInputEl.style.display = 'none';
            }
        };
    }
}
if (document.getElementById('copyrightYear')) {
    var now = new Date();
    var fullYear = now.getFullYear();
    var copyrightYearEl = document.getElementById('copyrightYear');
    copyrightYearEl.style.color = 'black';
    copyrightYearEl.innerHTML = fullYear;
}
if (document.getElementById('cartFormSelect')) {
    var cartFormSelectEl = document.getElementById('cartFormSelect');
    cartFormSelectEl.parentElement.style.display = 'none';
    /*cartFormSelectEl.onchange = () => {
        //alert(7);
    }*/
}
