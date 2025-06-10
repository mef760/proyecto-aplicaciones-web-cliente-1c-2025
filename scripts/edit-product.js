
const API_TOKEN = 'pathdvs7fO8A5c7ub.2d90db5930290ea0d20c24839ada2d49978c76a9416c214176354d34c1e80783';
const BASE_ID = 'appHDoJ0skWqgb4jE';
const TABLE_NAME = 'Products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Cargar producto al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if(productId) {
        fetch(`${API_URL}/${productId}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                document.querySelector('#product-title').value = data.fields.title || '';
                document.querySelector('#product-price').value = data.fields.price || '';
                document.querySelector('#product-description').value = data.fields.description || '';
                document.querySelector('#product-thumbnail').value = data.fields.thumbnail || '';
            }
        })
        .catch(error => console.error('Error cargando producto:', error));
    }
});

function updateSubmit(event){
    event.preventDefault();
    
    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if(!productId) {
        alert('No se especificó ID de producto');
        return;
    }

    // Validar campos requeridos
    const title = document.querySelector('#product-title').value.trim();
    const price = parseFloat(document.querySelector('#product-price').value);
    const description = document.querySelector('#product-description').value.trim();
    const thumbnail = document.querySelector('#product-thumbnail').value.trim();

    if(!title || isNaN(price)) {
        alert('Título y precio son campos requeridos. El precio debe ser numérico.');
        return;
    }

    const product = {
        title: title,
        price: price,
        description: description,
        thumbnail: thumbnail
    };

    const itemAirtable = {
        fields: product
    };

    fetch(`${API_URL}/${productId}`, {
        method: 'PATCH',
        headers:{
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemAirtable)
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            console.error('Error detallado:', data);
            alert(`Error al actualizar (${data.error.type}): ${data.error.message}`);
        } else {
            alert('Producto actualizado correctamente');
            window.location.href = './products.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el producto');
    });
}
