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
			// Gets Local Data...
			let result = await fetch("products.json");
			let data = await result.json();
			let products = data.items;
			products = products.map((item) => {
				const { title, price } = item.fields;
				const { id } = item.sys;
				const image = item.fields.image.fields.file.url;
				// Returns Clean Object
				return { title, price, id, image };
			});
			return products;
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
	products.getProducts().then((data) => console.log(data));
});
