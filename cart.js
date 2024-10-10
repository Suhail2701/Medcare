document.addEventListener('DOMContentLoaded', () => {
    const cartIcn = document.querySelector(".cartIcn");
    const cartContainer = document.querySelector(".cart-container");
    const totalItem = document.querySelector(".totalItem");
    const itemCount = document.querySelector(".itemCount");

    // If cart button is found, we're on index.html, set up the click event
    if (cartIcn) {
        cartIcn.addEventListener('click', () => {
            window.location.href = 'cart.html'; // Redirect to cart.html
        });
    }


    // Function to render cart items
    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || { allItems: [] };
        console.log("cartItems", cartItems);
        totalItem.innerHTML = cartItems.totalProduct;
        itemCount.innerHTML = cartItems.totalPrice;

        let cartProducts = "";
        if (cartItems.allItems.length > 0) {
            cartItems.allItems.map((p) => {
                cartProducts += `<div class="box">
                            <img src="images/med${p?.id}.jpg" alt="">
                            <h1>${p?.name}</h1>
                            <div class="price priceAndCount">
                            <span>&#8377; ${p?.price}/-</span>
                            <span>x${p?.count}</span>
                            </div>
                            <div class="stars ratingSize">${p?.rating} <i class="fa-solid fa-star"></i></div>
                            <a href="#" class="btn removeItem" data-product-id="${p?.id}">Remove Item</a>
                        </div>`;
            });
        } else {
            cartProducts = "<p>No items in cart.</p>";
            if(cartItems.allItems.length == 0)
                {
                    cartItems.totalPrice = 0;
                    cartItems.totalProduct = 0;
                    localStorage.setItem('cart',JSON.stringify(cartItems));
                    
                }
            
        }

        console.log("Before cart items rendered ");
        cartContainer.innerHTML = cartProducts;
        console.log("After cart items rendered ");
        console.log("Number of .removeItem buttons:", document.querySelectorAll(".removeItem").length);
        removeCartItem();
        console.log("After removeItem() ");
    }

    const removeCartItem = () => {
        console.log("Entering removeItem");
        document.querySelectorAll(".removeItem").forEach((item) => {
            item.addEventListener('click', handleRemoveItem);
        })
    }

    //Remove Item logic
    const handleRemoveItem = (event) => {
        event.preventDefault();
        console.log("Entering remove Item logic");

        alert("Item Removed");
        let cartItems = JSON.parse(localStorage.getItem('cart'));
        console.log("cartItems", cartItems);
        let productId = event.target.getAttribute('data-product-id');
        let productCount = null;
        let productIndex = null;
        let productPrice = null;

        cartItems?.allItems?.map((product, index) => {
            if (product.id == productId) {
                productCount = product?.count;
                productIndex = index;
                productPrice = product.price;
            }
        }
        )
        
        cartItems.totalPrice -=productPrice;
        cartItems.totalProduct -= 1;
        // console.log("Product count: ",productCount);
        if (productCount > 1) {
            cartItems.allItems[productIndex].count -= 1;

        }
        else {
            let filterdCartItems = cartItems.allItems.filter((item) => item?.id != productId);
            cartItems.allItems = filterdCartItems;
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        // let cartItems123456 = JSON.parse(localStorage.getItem('cart'));
        // console.log(cartItems123456);
        renderCartItems();
    }


    // If cart container is found, we're on cart.html, render cart items
    if (cartContainer) {
        renderCartItems();
    }

});
