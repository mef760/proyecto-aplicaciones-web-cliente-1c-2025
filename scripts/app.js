
const products = [
    {
        name: "Camiseta",
        description: "Camiseta de algodón 100%",
        image: "./img/image-google.png",
        price: 15
    },  
    {
        name: "Pantalones",
        description: "Pantalones de mezclilla",
        image: "./img/image-google.png",
        price: 25
    },
    {
        name: "Zapatos",
        description: "Zapatos de cuero",
        image: "./img/image-google.png",
        price: 50
    },
    {
        name: "Sombrero",
        description: "Sombrero de paja",
        image: "./img/image-google.png",
        price: 10

    }
];

const grid = document.querySelector('.product-grid');

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

products.forEach( product => {
    const card = createProductCard(product);
    grid.appendChild(card);
});

const button = document.querySelector('#btn-add-products');

button.addEventListener('click', addProduct);