document.addEventListener("DOMContentLoaded", () => {
    const productDetail = document.getElementById("product-detail");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const deleteButton = document.getElementById("delete-product");

    async function fetchProductDetail() {
        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/product/${productId}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched product detail:', data); // Отладочное сообщение

            // Check if categories is defined and is an array
            const categories = Array.isArray(data.category) ? data.category : [];

            productDetail.innerHTML = `
                <h2>${data.name}</h2>
                <p>Price: $${data.price}</p>
                <p>Description: ${data.description}</p>
                <p>Categories: ${categories.map(category => category).join(", ")}</p>
            `;
        } catch (error) {
            console.error('Error fetching product details:', error);
            productDetail.innerHTML = '<p>Error loading product details.</p>';
        }
    }

    // Функция для удаления продукта
    async function deleteProduct() {
        const confirmation = confirm("Are you sure you want to delete this product?");
        if (!confirmation) return;

        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/delete/${productId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            alert("Product deleted successfully!");
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }

    if (productId) {
        fetchProductDetail();
    } else {
        productDetail.innerHTML = '<p>Product ID not found in URL.</p>';
    }

    deleteButton.addEventListener('click', deleteProduct); // Обработчик события на кнопку удаления
});