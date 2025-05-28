

const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

function createProductCartCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const img = document.createElement('img');
    img.src = product.thumbnail;
    img.alt = product.title;

    const title = document.createElement('h3');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Eliminar';
    button.addEventListener('click', () => {
        const exists = cartProducts.findIndex(p => p.title === product.title);
        if (exists !== -1) {
            cartProducts.splice(exists, 1);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            renderCartProducts(cartProducts);
        }
    });
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(button);

    return card;
}

function renderCartProducts(list){
    const cartGrid = document.querySelector('.cart-grid');
    cartGrid.innerHTML = ''; // Clear previous content
    
    list.forEach( product => {
        const card = createProductCartCard(product);
        cartGrid.appendChild(card);
    });
}


renderCartProducts(cartProducts);