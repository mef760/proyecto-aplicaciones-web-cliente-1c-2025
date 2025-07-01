// app.js
import './secrets.js'; // Importar secretos, si es necesario

// 1. Configuración Global / Constantes
const API_CONFIG = {
    TOKEN: SECRETS.AIRTABLE_SECRET,
    BASE_ID: 'appHDoJ0skWqgb4jE',
    TABLE_NAME: 'Products',
    URL: `https://api.airtable.com/v0/appHDoJ0skWqgb4jE/Products`
};

// 2. Módulo de Utilidades de API
const ApiService = {
    fetchData: async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
        }
        return response.json();
    },
    get: async (endpoint) => ApiService.fetchData(`${API_CONFIG.URL}${endpoint ? '/' + endpoint : ''}`),
    post: async (data) => ApiService.fetchData(API_CONFIG.URL, { method: 'POST', body: JSON.stringify({ fields: data }) }),
    patch: async (id, data) => ApiService.fetchData(`${API_CONFIG.URL}/${id}`, { method: 'PATCH', body: JSON.stringify({ fields: data }) }),
    delete: async (id) => ApiService.fetchData(`${API_CONFIG.URL}/${id}`, { method: 'DELETE' })
};

// 3. Módulo de Productos (Lógica de negocio y UI para productos)
const ProductModule = (() => {
    let products = []; // Estado local de productos

    const productGrid = document.querySelector('.product-grid'); // Para index.html
    const productListTable = document.querySelector('#product-list'); // Para admin/products.html
    const searchInput = document.querySelector('#input-search-products');
    const deliveryFreeCheckBox = document.querySelector('#delivery-free');

    const init = () => {
        if (productGrid) { // Solo si estamos en index.html
            fetchAndRenderProducts();
            if (searchInput) searchInput.addEventListener('input', filterAndRenderProducts);
            if (deliveryFreeCheckBox) deliveryFreeCheckBox.addEventListener('change', filterAndRenderProducts);
            const addProductButton = document.querySelector('#btn-add-products');
            if (addProductButton) addProductButton.addEventListener('click', handleAddProduct);
        }
        if (productListTable) { // Solo si estamos en admin/products.html
            fetchAndRenderAdminProducts();
        }
    };

    const fetchAndRenderProducts = async () => {
        try {
            const data = await ApiService.get();
            products = data.records.map(item => ({
                id: item.id,
                title: item.fields.title,
                description: item.fields.description,
                thumbnail: item.fields.thumbnail,
                price: item.fields.price,
                deliveryFree: item.fields.deliveryFree || false // Asumiendo que existe este campo
            }));
            renderProducts(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            alert('Error al cargar los productos.');
        }
    };

    const fetchAndRenderAdminProducts = async () => {
        try {
            const data = await ApiService.get();
            products = data.records.map(item => ({
                id: item.id,
                title: item.fields.title,
                description: item.fields.description,
                thumbnail: item.fields.thumbnail,
                price: item.fields.price
            }));
            renderAdminProducts(products);
        } catch (error) {
            console.error('Error al obtener productos para admin:', error);
            alert('Error al cargar los productos para administración.');
        }
    };

    const createProductCard = (product) => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button data-product-id="${product.id}">Agregar al carrito</button>
        `;
        card.querySelector('button').addEventListener('click', () => CartModule.addProductToCart(product));
        return card;
    };

    const createProductRow = (product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>
                <button data-product-id="${product.id}">Modificar</button>
            </td>
        `;
        row.querySelector('button').addEventListener('click', () => {
            window.location.href = `../admin/edit-product.html?id=${product.id}`;
        });
        return row;
    };

    const renderProducts = (list) => {
        if (productGrid) {
            productGrid.innerHTML = '';
            list.forEach(product => productGrid.appendChild(createProductCard(product)));
        }
    };

    const renderAdminProducts = (list) => {
        if (productListTable) {
            productListTable.innerHTML = '';
            list.forEach(product => productListTable.appendChild(createProductRow(product)));
        }
    };

    const filterAndRenderProducts = () => {
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const isDeliveryFreeChecked = deliveryFreeCheckBox ? deliveryFreeCheckBox.checked : false;

        const filtered = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchText);
            const matchesDelivery = !isDeliveryFreeChecked || product.deliveryFree;
            return matchesSearch && matchesDelivery;
        });
        renderProducts(filtered);
    };

    const handleAddProduct = async () => {
        // Esto debería venir de un formulario real, no hardcodeado
        const newProduct = {
            title: "Nuevo Producto de Prueba",
            description: "Descripción del nuevo producto de prueba",
            thumbnail: "./img/image-google.png",
            price: 25
        };
        try {
            await ApiService.post(newProduct);
            alert('Producto agregado correctamente.');
            fetchAndRenderProducts(); // Refrescar la lista de productos
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Error al agregar el producto.');
        }
    };

    return {
        init,
        products, // Exponer productos si es necesario para otros módulos
        fetchAndRenderProducts, // Exponer para refrescar desde otros módulos
        fetchAndRenderAdminProducts,
    };
})();

// 4. Módulo de Edición de Producto (Lógica específica para admin/edit-product.html)
const EditProductModule = (() => {
    const productTitleInput = document.querySelector('#product-title');
    const productPriceInput = document.querySelector('#product-price');
    const productDescriptionInput = document.querySelector('#product-description');
    const productThumbnailInput = document.querySelector('#product-thumbnail');
    const editForm = document.querySelector('form'); // Asumiendo que hay un formulario para la edición

    const init = () => {
        if (editForm) { // Solo si estamos en edit-product.html
            document.addEventListener('DOMContentLoaded', loadProductForEdit);
            editForm.addEventListener('submit', handleUpdateProduct);
        }
    };

    const loadProductForEdit = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            try {
                const data = await ApiService.get(productId);
                if (!data.error) {
                    productTitleInput.value = data.fields.title || '';
                    productPriceInput.value = data.fields.price || '';
                    productDescriptionInput.value = data.fields.description || '';
                    productThumbnailInput.value = data.fields.thumbnail || '';
                }
            } catch (error) {
                console.error('Error cargando producto para edición:', error);
                alert('Error al cargar el producto para edición.');
            }
        }
    };

    const handleUpdateProduct = async (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            alert('No se especificó ID de producto para actualizar.');
            return;
        }

        const title = productTitleInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const description = productDescriptionInput.value.trim();
        const thumbnail = productThumbnailInput.value.trim();

        if (!title || isNaN(price)) {
            alert('Título y precio son campos requeridos. El precio debe ser numérico.');
            return;
        }

        const updatedProduct = { title, price, description, thumbnail };

        try {
            await ApiService.patch(productId, updatedProduct);
            alert('Producto actualizado correctamente.');
            window.location.href = './products.html'; // Redirigir a la lista de productos
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert('Error al actualizar el producto.');
        }
    };

    return {
        init
    };
})();

// 5. Módulo de Carrito (Lógica de negocio y UI para el carrito)
const CartModule = (() => {
    let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    const cartGrid = document.querySelector('.cart-grid'); // Para cart.html

    const init = () => {
        if (cartGrid) { // Solo si estamos en cart.html
            renderCartProducts();
        }
    };

    const addProductToCart = (product) => {
        const exists = cartProducts.find(p => p.id === product.id); // Usar ID para unicidad
        if (!exists) {
            cartProducts.push(product);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            console.log('Producto agregado al carrito:', product.title);
            alert(`${product.title} agregado al carrito.`);
            // Opcional: Actualizar un contador de carrito en la UI
        } else {
            alert(`${product.title} ya está en el carrito.`);
        }
    };

    const removeProductFromCart = (productId) => {
        const initialLength = cartProducts.length;
        cartProducts = cartProducts.filter(p => p.id !== productId);
        if (cartProducts.length < initialLength) {
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            renderCartProducts();
            alert('Producto eliminado del carrito.');
        }
    };

    const createProductCartCard = (product) => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button data-product-id="${product.id}">Eliminar</button>
        `;
        card.querySelector('button').addEventListener('click', () => removeProductFromCart(product.id));
        return card;
    };

    const renderCartProducts = () => {
        if (cartGrid) {
            cartGrid.innerHTML = '';
            if (cartProducts.length === 0) {
                cartGrid.innerHTML = '<p>El carrito está vacío.</p>';
            } else {
                cartProducts.forEach(product => cartGrid.appendChild(createProductCartCard(product)));
            }
        }
    };

    return {
        init,
        addProductToCart,
        removeProductFromCart,
        getCartProducts: () => [...cartProducts] // Devolver una copia para evitar mutaciones externas
    };
})();

// 6. Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', () => {
    ProductModule.init();
    EditProductModule.init();
    CartModule.init();
});
