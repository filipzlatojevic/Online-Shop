
const form = document.querySelector('#searchForm');
const heroAndItems = document.querySelector('.hero-and-items');
const productPage = document.querySelector('.product-page');
const container = document.querySelector('.items-container');
const tbody = document.querySelector('tbody');
const totalEl = document.querySelector('.total');
const select = document.querySelector('#sort');
let total = 0;

fetch("./data.json")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        const arr = data.products.data.items
        importItems(arr);
    })
    .catch((e) => {
        console.log("We have error:", e);
    });

// Function for importing data
function importItems(res) {
    const arr = res;

    for (let i = 0; i < arr.length; i++) {
        const {
            category,
            description,
            id,
            images,
            name,
            price
        } = arr[i];

        if (images) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.id = id;
            itemDiv.value = parseFloat(price);
            itemDiv.innerHTML = `
        <img src="${images[0]}" alt="item">
        <div class="des">
            <span class="category">${category}</span>
            <h5 class="name">${name}</h5>
            <div class="price-container">
                <h4 class="price">$${price}</h4>
                <button class="addToCart"><i class="material-icons">&#xe8cc;</i></button>
            </div>
        </div>
             `
            container.append(itemDiv);
        } else {
            continue
        }

        // event for opening details page
        let idElement = document.getElementById(id);
        idElement.addEventListener('click', function () {
            productDetails(arr[i]);
        });

        // button add to cart on home page
        const btnCart = idElement.querySelector('.addToCart');
        btnCart.addEventListener('click', function (e) {
            e.stopPropagation();
            addToCart(arr[i]);
            btnCart.style.display = 'none';
        });
    }
}

// single product page
function productDetails(el) {
    const {
        category,
        description,
        id,
        images,
        name,
        price
    } = el;

    heroAndItems.style.display = 'none';
    productPage.innerHTML =
        `
    <section class="product-details ${id}">
        <button class="back">Back</button>
        <div class="images">
            <img src="${images[0]}" alt="item">
            <div class="small-images">
                <img src="${images[0]}" alt="item">
                <img src="${images[1]}" alt="item">
                <img src="${images[2]}" alt="item">
            </div>
        </div>

        <div class="details-text">
            <span class="category">${category}</span>
            <h4 class="name">${name}</h4>
            <h2 class="price">$${price}</h2>
            <button class='addToCartDetails'>Add To Cart</button>
            <h5>Product Details</h5>
            <p>${description}</p>
        </div>
    </section>
    `;

    // back button
    const backBtn = document.querySelector('.back');
    backBtn.addEventListener('click', function () {
        heroAndItems.style.display = 'block';
        productPage.innerHTML = '';
    });

    // change images
    const largImg = document.querySelector('img');
    const smallImages = document.querySelectorAll('.small-images img');
    for (let one of smallImages) {
        one.addEventListener('click', function () {
            largImg.src = one.src;
        });
    }

    // add to cart button
    const btnCartDetails = productPage.querySelector('.addToCartDetails');
    btnCartDetails.addEventListener('click', function () {
        addToCart(el);
        this.setAttribute('disabled', true);
    });
}

// add to cart function
function addToCart(el) {
    let {
        id,
        images,
        name,
        price
    } = el;
    let quantity = 1;
    price = parseFloat(price).toFixed(2);
    let subtotal = price * quantity;

    const tr = document.createElement('tr');
    tr.innerHTML = `
    <tr>
    <td><a class="removeBtn"><i class="material-icons">&#xe928;</i></a></td>
    <td><img src="${images[0]}" class="${id}" alt="item"></td>
    <td>${name}</td>
    <td>$${price}</td>
    <td><input type="number" value="1" min="1"></td>
    <td>$<span class="subtotal">${subtotal}</span></td>
    </tr>
    `;
    tbody.appendChild(tr);

    // input element
    const subtotalEl = tr.querySelector('.subtotal');
    const inputEl = tr.querySelector('input');
    inputEl.addEventListener('change', function () {
        quantity = parseInt(this.value);
        subtotal = price * quantity;
        subtotalEl.innerText = subtotal.toFixed(2);
        calculateTotal();
    });
    calculateTotal();

    // remove button
    tr.querySelector('.removeBtn')
        .addEventListener('click', function () {
            let img = tr.querySelector('td img');
            let imgId = img.className;
            tr.remove();
            calculateTotal();
            let buton = document.querySelector(`#${imgId} .addToCart`);
            buton.style.display = 'inline';
            let buton2 = document.querySelector(`.${imgId} .addToCartDetails`);
            if (buton2) {
                buton2.removeAttribute('disabled');
            }
        });

}

// function for calculating total
function calculateTotal() {
    if (tbody.innerText !== '') {
        const sum = [];
        let arr = tbody.querySelectorAll('.subtotal');
        for (let el of arr) {
            let sub = parseFloat(el.innerText);
            sum.push(sub);
        }
        total = sum.reduce((a, b) => a + b);
        totalEl.innerText = '$' + total.toFixed(2);
    } else {
        total = 0;
        totalEl.innerText = '$' + total;
    }
}

// sorting
select.addEventListener('change', function () {
    const items = Array.from(container.querySelectorAll('.item'));

    if (this.value === 'ascending') {
        items.sort((a, b) => {
            return a.value - b.value;
        });
        container.innerHTML = '';
        for (let item of items) {
            container.append(item);
        }

        // items.sort((a, b) => a - b);
        // container.innerHTML = '';
        // fetch("./data.json")
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((data) => {
        //         const arr = data.products.data.items
        //         arr.sort((a, b) => a.price - b.price);
        //         importItems(arr);
        //     })
        //     .catch((e) => {
        //         console.log("We have error:", e);
        //     });
    }
    else if (this.value === 'descending') {
        items.sort((a, b) => {
            return b.value - a.value;
        });
        container.innerHTML = '';
        for (let item of items) {
            container.append(item);
        }
    }
});

// checkbox of categories
checkboxBtn = document.getElementById('checkboxBtn');
checkboxBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const filters = [];
    let markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
    for (let checkbox of markedCheckbox) {
        let value = checkbox.value;
        filters.push(value);
        container.innerHTML = '';
        fetch("./data.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                const arr = data.products.data.items;
                const filteredData = arr.filter((el) => filters.includes(el.category));
                importItems(filteredData);
            })
            .catch((e) => {
                console.log("We have error:", e);
            });
    }
});

// Search form
const searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    container.innerHTML = '';
    // this give us a value which is typed in the form
    const searchTerm = this.elements.inputData.value.toLowerCase();
    fetch("./data.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const arr = data.products.data.items;
            const filteredData = arr.filter((el) => {
                return el.name.toLowerCase()
                    .includes(searchTerm) ||
                    el.description.includes(searchTerm);
            });
            importItems(filteredData);
        })
        .catch((e) => {
            console.log("We have error:", e);
        });
});