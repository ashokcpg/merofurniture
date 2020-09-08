const cartBtn = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");

const cartItems = document.querySelector(".cart-items");
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
		// console.log(products);
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
		let buttons = [...document.querySelectorAll(".bag-btn")];
		buttonsDOM = buttons;
		// console.log(buttons);
		// Looping over the buttons to get dataset id...

		buttons.forEach((button) => {
			let id = button.dataset.id;
			// console.log(id);
			// Checking if the product is already is in cart or not..

			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerText = "In Cart";
				button.disable = true;
			}
			button.addEventListener("click", (event) => {
				// console.log(event);
				event.target.innerText = "In Cart";
				event.target.disabled = true;
				// Get the item from local storage...
				let cartItem = { ...lStorage.getProduct(id), amount: 1 };
				// console.log(cartItem);

				// Add product to the cart...

				cart = [...cart, cartItem];
				// Save Cart information in Local Storage...
				lStorage.saveCart(cart);
				// Set Cart Values...
				this.setCartValues(cart);
				// Display Cart Items...
				this.addCartItem(cartItem);
				// Show The Cart on adding the item...
				this.showCart();
			});
		});
	}
	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});
		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}
	addCartItem(item) {
		const div = document.createElement("div");
		div.classList.add("cart-item");
		div.innerHTML = `<img src=${item.image} alt="product" />
						<div>
							<h4>${item.title}</h4>
							<h5>$${item.price}</h5>
							<span class="remove-item" data-id=${item.id}>Remove</span>
						</div>
						<div>
							<i class="fas fa-chevron-up"  data-id=${item.id}></i>
							<p class="item-amount">1</p>
							<i class="fas fa-chevron-down"  data-id=${item.id}></i>
						</div>`;
		cartContent.appendChild(div);
		// console.log(cartContent);
	}
	showCart() {
		cartOverlay.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}
	setupAPP() {
		cart = lStorage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener("click", this.showCart);
		closeCart.addEventListener("click", this.hideCart);
	}
	populateCart(cart) {
		cart.forEach((item) => this.addCartItem(item));
	}
	hideCart() {
		cartOverlay.classList.remove("transparentBcg");
		cartDOM.classList.remove("showCart");
	}
	cartLogic() {
		// Clear cart Buttom
		clearCartBtn.addEventListener("click", () => {
			this.clearCart();
		});
		// Cart Functionality
		cartContent.addEventListener("click", (event) => {
			// console.log(event.target);
			if (event.target.classList.contains("remove-item")) {
				let removeItem = event.target;
				// console.log(removeItem);
				let id = removeItem.dataset.id;
				cartContent.removeChild(removeItem.parentElement.parentElement);
				this.removeItem(id);
				// The increase and decrease functionality in cart...
			} else if (event.target.classList.contains("fa-chevron-up")) {
				let addAmount = event.target;
				let id = addAmount.dataset.id;
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount + 1;
				lStorage.saveCart(cart);
				this.setCartValues(cart);
				addAmount.nextElementSibling.innerText = tempItem.amount;
			} else if (event.target.classList.contains("fa-chevron-down")) {
				let lowerAmount = event.target;
				let id = lowerAmount.dataset.id;
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount - 1;
				if (tempItem.amount > 0) {
					lStorage.saveCart(cart);
					this.setCartValues(cart);
					lowerAmount.previousElementSibling.innerText = tempItem.amount;
				} else {
					//Removing Item if amount is less than 1
					cartContent.removeChild(lowerAmount.parentElement.parentElement);
					this.removeItem(id);
				}
			}
		});
	}
	clearCart() {
		let cartItems = cart.map((item) => item.id);
		// console.log(cartItems);
		// Grabbing the id of the item to remove...
		cartItems.forEach((id) => this.removeItem(id));
		// console.log(cartContent.children);
		while (cartContent.children.length > 0) {
			cartContent.removeChild(cartContent.children[0]);
		}
	}
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setCartValues(cart);
		lStorage.saveCart(cart);
		let button = this.getSingleButton(id);
		button.disabled = false;
		button.innerHTML = `<i class="fas fa-shoppig-cart"></i>ADD TO CART`;
	}
	getSingleButton(id) {
		return buttonsDOM.find((button) => button.dataset.id === id);
	}
}
// Using Local Storage
class lStorage {
	static saveProducts(products) {
		localStorage.setItem("products", JSON.stringify(products));
	}
	static getProduct(id) {
		let products = JSON.parse(localStorage.getItem("products"));
		return products.find((product) => product.id === id);
	}
	static saveCart(cart) {
		localStorage.setItem("cart", JSON.stringify(cart));
	}
	static getCart() {
		return localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart"))
			: [];
	}
}
document.addEventListener("DOMContentLoaded", () => {
	const ui = new UI();
	const products = new Products();
	ui.setupAPP();

	// GET all products...
	products
		.getProducts()
		.then((products) => {
			ui.displayProducts(products);
			lStorage.saveProducts(products);
		})
		.then(() => {
			ui.getBagButtons();
			ui.cartLogic();
		});
	// Sends the products to UI class...
});
