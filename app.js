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

// Buttons
let buttonsDOM = [];

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
class UI {
	displayProducts(products) {
		console.log(products);
		let result = "";

		products.forEach((product) => {
			result += `
			<!-- Single Product -->
			<article class="product">
					<div class="img-container">
						<img src=${product.image} alt="" class="product-img" />
						<button class="bag-btn" data-id=${product.id}>
							<i class="fas fa-shopping-cart"></i>
							Add to Cart
						</button>
					</div>
					<h3>${product.title}</h3>
					<h4>$${product.price}</h4>
				</article>`;
		});
		productsDOM.innerHTML = result;
	}

	// Getting Buttons Back...
	getBagButtons() {
		// Turning the result into array not into nodelist...
		const buttons = [...document.querySelectorAll(".bag-btn")];
		buttonsDOM = buttons;
		// console.log(buttons);
		// Looping over the buttons to get dataset id...

		buttons.forEach((button) => {
			let id = button.dataset.id;
			// console.log(id);
			// Checking if the product is already is in cart or not..

			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerText = "In Cart Already";
				button.disable = true;
			}
			button.addEventListener("click", (event) => {
				// console.log(event);
				event.target.innerText = "In Cart";
				event.target.disable = true;
				// Get the item from local storage...
				let cartItem = { ...lStorage.getProduct(id), amount: 1 };
				// console.log(cartItem);

				// Add product to the cart...

				cart = [...cart, cartItem];
				console.log(cart);

				// Save Cart information in Local Storage...

				lStorage.saveCart(cart);

				// Set Cart Values...
				this.setCartValues(cart);
				// Display Cart Items...
				// Show The Cart on adding the item...
			});
		});
	}
}

// Using Local Storage
class lStorage {
	static saveProducts(products) {
		localStorage.setItem("products", JSON.stringify(products));
	}
	static getProduct(id) {
		let products = JSON.parse(localStorage.getItem("products"));
		// console.log(id);
		return products.find((product) => product.id === id);
	}
	static saveCart(cart) {
		localStorage.setItem("cart", JSON.stringify(cart));
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const ui = new UI();
	const products = new Products();

	// GET all products...
	products
		.getProducts()
		.then((products) => {
			ui.displayProducts(products);
			lStorage.saveProducts(products);
		})
		.then(() => {
			ui.getBagButtons();
		});
	// Sends the products to UI class...
});
