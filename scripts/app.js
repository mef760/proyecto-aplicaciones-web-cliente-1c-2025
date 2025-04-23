
const products = [
    {
        name: "Camiseta",
        description: "Camiseta de algodón 100%",
        image: "./img/image-google.png",
        price: 15,
        deliveryFree: true
    },  
    {
        name: "Pantalones",
        description: "Pantalones de mezclilla",
        image: "./img/image-google.png",
        price: 25,
        deliveryFree: true
    },
    {
        name: "Zapatos",
        description: "Zapatos de cuero",
        image: "./img/image-google.png",
        price: 50,
        deliveryFree: false
    },
    {
        name: "Sombrero",
        description: "Sombrero de paja",
        image: "./img/image-google.png",
        price: 10,
        deliveryFree: false

    }
];

const grid = document.querySelector('.product-grid');
const searchInput = document.querySelector('#input-search-products');
const deliveryFreeCheckBox = document.querySelector('#delivery-free');


function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const title = document.createElement('h3');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Comprar';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(button);

    return card;
}

function addProduct() {
    const newProduct = {
        name: "Nuevo Producto",
        description: "Descripción del nuevo producto",
        image: "./img/image-google.png",
        price: 20
    };

    const card = createProductCard(newProduct);
    grid.appendChild(card);
}

function renderProducts(list){
    list.forEach( product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function filterProducts(text){
    const filteredProducts = products.filter( product => {
        return product.name.toLowerCase().includes(text.toLowerCase())
        && (product.deliveryFree === deliveryFreeCheckBox.checked || !deliveryFreeCheckBox.checked);
    });
    grid.innerHTML = '';
    renderProducts(filteredProducts);
}

searchInput.addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

deliveryFreeCheckBox.addEventListener('change', (e) => {
    filterProducts(searchInput.value);
})

renderProducts(products);

const button = document.querySelector('#btn-add-products');

button.addEventListener('click', addProduct);


const numbers = [1, 2, 3, 4, 5];
// map examples
/*
const squaredNumbers = numbers.map(p => p * p);
console.log('numeros', numbers);
console.log('numeros al cuadrado', squaredNumbers);
*/

// reduce examples
/*
const sum = numbers.reduce((accumulator, p) => {
    return accumulator + p;
},0);

console.log('original', numbers);
console.log('suma', sum);
*/

// find examples
const foundProduct = products.find(p => p.name.includes('a'));
const filteredProducts = products.filter(p => p.name.includes('a'));
console.log('producto encontrado', foundProduct);
console.log('productos filtrados', filteredProducts);

