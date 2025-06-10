
const API_TOKEN = 'pathdvs7fO8A5c7ub.2d90db5930290ea0d20c24839ada2d49978c76a9416c214176354d34c1e80783';
const BASE_ID = 'appHDoJ0skWqgb4jE';
const TABLE_NAME = 'Products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;


const grid =  document.querySelector('#product-list');

function createProductRow(product) {
    const row = document.createElement('tr');


    const title = document.createElement('td');
    title.textContent = product.title;

    const price = document.createElement('td');
    price.textContent = `$${product.price}`;

    const actions = document.createElement('td');
   
    const button = document.createElement('button');
    button.textContent = 'Modificar';
    button.addEventListener('click', () => {
        window.location.href = `../admin/edit-product.html?id=${product.id}`;
    });

    actions.appendChild(button);
    row.appendChild(title);
    row.appendChild(price);
    row.appendChild(actions);

    return row;
}
const products = [];
const getProducts = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log('data', data);

    const productsMaped = data.records.map(item => {
        return {
            id: item.id,
            title: item.fields.title,
            description: item.fields.description,
            thumbnail: item.fields.thumbnail,
            price: item.fields.price
        };
    })
    console.log(productsMaped);

    renderProducts(productsMaped);
}

function renderProducts(list){
    list.forEach( product => {
        const row = createProductRow(product);
        grid.appendChild(row);
    });
}

getProducts();
