const cartBtn = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".claer-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");

const cartTotal = document.querySelector(".cart-total");

const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// Cart items
let cart = [];

// Class responsible for getting the products...
class Products {
	async getProducts() {
		try {
			let result = await fetch("products.json");
			let data = await result.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}
}

// Display Products...

class UI {}

// Local Storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
	const ui = new UI();
	const products = new Products();

	// GET all products...
	products.getProducts().then(console.log);
});
