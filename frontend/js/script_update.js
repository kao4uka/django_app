document.addEventListener("DOMContentLoaded", () => {
    const updateProductForm = document.getElementById("update-product-form");
    const responseMessage = document.getElementById("response-message");
    const productIdInput = document.getElementById("product-id");
    const categorySelect = document.getElementById("category");

    // Получаем ID продукта из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        productIdInput.value = productId;
        fetchCategories(); // Получаем категории при загрузке страницы
        fetchProductDetails(productId);
    }

    async function fetchProductDetails(id) {
        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/product/${id}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            document.getElementById("product-name").value = data.name;
            document.getElementById("product-price").value = data.price;
            document.getElementById("product-description").value = data.description;

            // Установка выбранных категорий
            Array.from(categorySelect.options).forEach(option => {
                option.selected = data.category.includes(parseInt(option.value));
            });

        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("http://127.0.0.1:8002/api/core/category/");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched categories:', data);

            if (data.results && Array.isArray(data.results)) {
                categorySelect.innerHTML = data.results.map(cat =>
                    `<option value="${cat.id}">${cat.name}</option>`
                ).join("");
            } else {
                console.error('Expected an array in data.results but received:', data.results);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    updateProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const description = document.getElementById("product-description").value;
        const categories = Array.from(categorySelect.selectedOptions).map(option => parseInt(option.value));

        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/product/${productId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("ynT8g6i5F8h43Hd9zUvgebKTPKCaDL5q3cqDZxO02NoWIWfUU9zzU8xd6o1CKXvI") // Django CSRF token
                },
                body: JSON.stringify({
                    name: name,
                    price: price,
                    description: description,
                    category: categories,
                })
            });

            if (response.ok) {
                responseMessage.textContent = `Product with ID ${productId} updated successfully.`;
            } else {
                responseMessage.textContent = `Failed to update product.`;
            }
        } catch (error) {
            console.error('Error updating product:', error);
            responseMessage.textContent = `Error occurred while updating product.`;
        }
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});