// alert('test')

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active');
  loginForm.classList.remove('active');
  navbar1.classList.remove('active');
}


let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
  loginForm.classList.toggle('active');
  searchForm.classList.remove('active');
  navbar1.classList.remove('active');
}

let navbar1 = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
  navbar1.classList.toggle('active');
  searchForm.classList.remove('active');
  loginForm.classList.remove('active');
}

window.onscroll = () => {
  searchForm.classList.remove('active');
  loginForm.classList.remove('active');
  navbar1.classList.remove('active');
}



var swiper = new Swiper(".product-slider", {
  loop: true,
  spaceBetween: 20,

  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,

    },
    1020: {
      slidesPerView: 3,

    },
  },
});



var swiper = new Swiper(".review-slider", {
  loop: true,
  spaceBetween: 20,

  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,

    },
    1020: {
      slidesPerView: 3,

    },
  },
});

// All Products logic
const boxContainer = document.querySelector(".box-container1");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const categoryHeading = document.querySelector(".categoryHeading");



let allProducts = null;
let allData = null;
let filteredProducts = null;
let totalPage = null;
let page = 1;


const fetchData = async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const title = params.get('title');

  if (category) {
    categoryHeading.textContent = title;
  }
  else {
    categoryHeading.innerHTML = "All Products";
  }
  const data = await fetch(`/products.json`);
  const json = await data.json();
  allData = json;
  allProducts = json?.products;

  if (category) {
    totalPage = 1;
    renderCategoryProducts(category);
  } else {
    totalPage = Math.ceil(allData?.total / 10);
    renderProducts();

  }

  Pagination();
  setupCategoryFilters();
  cart();

}

const renderCategoryProducts = (category) => {
  boxContainer.innerHTML = "";
  filteredProducts = allProducts.filter(p => p.category === category);
  totalPage = Math.ceil(filteredProducts.length / 10);
  let products = "";

  filteredProducts.map((p, index) => {
    products += `<div class="box" id="searchCard">
        <img src="images/med${p?.id}.jpg" alt="">
        <h1>${p?.name}</h1>
        <div class="price">&#8377; ${p?.price}/-</div>
        <div class="stars ratingSize">
         ${p?.rating} <i class="fa-solid fa-star"></i>
        </div>
        <a href="#" class="btn cartListener" data-product-id="${p?.id}" >Add to cart</a>
      </div>`;
  });

  boxContainer.innerHTML = products;
  cart();
}

// Add event listeners for category buttons
const setupCategoryFilters = () => {
  document.querySelector(".category-tablets").addEventListener('click', () => renderCategoryProducts('Medicine'));
  document.querySelector(".category-soap").addEventListener('click', () => renderCategoryProducts('Soap'));
  document.querySelector(".category-syrup").addEventListener('click', () => renderCategoryProducts('Syrup'));
  document.querySelector(".category-chocolate").addEventListener('click', () => renderCategoryProducts('Chocolate'));
}

fetchData();


const handlePagination = (i) => {
  if (i >= 1 && i <= totalPage && page != i) {
    page = i;
  }


  renderProducts();
  Pagination();
}


const renderProducts = () => {
  let products = "";

  allProducts.slice(10 * page - 10, 10 * page)?.map((p, index) => {
    return (
      products += `<div class="box" id="searchCard">
      <img src="images/med${p?.id}.jpg" alt="">
      <h1>${p?.name}</h1>
      <div class="price">&#8377; ${p?.price}/-</div>
      <div class="stars ratingSize">
       ${p?.rating} <i class="fa-solid fa-star"></i>
      </div>
      <a href="#" class="btn  cartListener" data-product-id="${p?.id}">Add to cart</a>
    </div>`
    )
  });

  boxContainer.innerHTML = products;

  cart();
}

const Pagination = () => {
  const numbers = document.querySelector('.numbers');

  numbers.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    const span = document.createElement("span");
    span.innerHTML = i;
    span.addEventListener('click', () => handlePagination(i));
    span.classList.add("spanEle");
    if (page === i) {
      span.classList.add("cuurentPage");
    }
    numbers.appendChild(span)

  }

  if (page === 1) {
    left.classList.add("hideSpan");
    left.classList.remove("displaySpan");
  } else {
    left.classList.remove("hideSpan");
    left.classList.add("displaySpan");
  }

  if (page === totalPage) {
    right.classList.add("hideSpan");
    right.classList.remove("displaySpan");
  } else {
    right.classList.remove("hideSpan");
    right.classList.add("displaySpan");
  }

}

left.addEventListener('click', () => handlePagination(page - 1));

right.addEventListener('click', () => handlePagination(page + 1));

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message; // Set the notification message

  notification.classList.add('show');

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

const handleAddToCart = (event) => {

  event.preventDefault();
  showNotification("Item added to cart!");
  const productId = event.target.getAttribute('data-product-id');
  let obj = {
    totalProduct: 0,
    totalPrice: 0,
    allItems: [],
  }
  let presentItemIndex = null;
  let cartStorage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : obj;
  let productToCart = allProducts[Number(productId) - 1];
  let itemFlag = false;
  cartStorage.allItems.map((item, index) => {
    if (item.id == productId) {
      itemFlag = true;
      presentItemIndex = index;
    }
  }
  )

  if (itemFlag) {
    cartStorage.allItems[presentItemIndex].count += 1;
  }
  else {
    cartStorage.allItems.push(productToCart);
  }

  cartStorage.totalProduct = cartStorage.totalProduct + 1;
  cartStorage.totalPrice = cartStorage.totalPrice + productToCart?.price;
  localStorage.setItem('cart', JSON.stringify(cartStorage));

}

//cart logic
const cart = () => {
  document.querySelectorAll(".cartListener").forEach((item) => {
    item.addEventListener('click', handleAddToCart);
  })

  // cartSelector.addEventListener('click', renderCartItems);
}


//serach function
function searchFun() {
  let myInput = document.querySelector(".myInput").value.toUpperCase();

  let allrenderedCards = document.querySelectorAll("#searchCard");

  for (let i = 0; i < allrenderedCards.length; i++) {
    let nameTag = allrenderedCards[i].querySelector('h1');

    let name = nameTag.textContent.toUpperCase();

    if (name.indexOf(myInput) > -1) {
      allrenderedCards[i].style.display = "";
    }
    else {
      allrenderedCards[i].style.display = "none";
    }

  }

}




