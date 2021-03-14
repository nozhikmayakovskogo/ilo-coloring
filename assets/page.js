export default class Page {
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