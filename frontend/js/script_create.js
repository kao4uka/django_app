document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("add-product-form");
    const notifications = document.getElementById("notifications");
    const categorySelect = document.getElementById("category");

    let socket;

    function notifyNewProduct(productName) {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'notification_message',
                message: {
                    title: 'New Product Added',
                    text: `New product has been added: ${productName}`
                }
            }));
        } else {
            console.error('WebSocket is not connected.');
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("http://127.0.0.1:8002/api/core/category/");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched categories:', data);  // Отладочное сообщение

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

    addProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const description = document.getElementById("product-description").value;
        const categories = Array.from(categorySelect.selectedOptions).map(option => parseInt(option.value));

        try {
            const response = await fetch("http://127.0.0.1:8002/api/core/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("ynT8g6i5F8h43Hd9zUvgebKTPKCaDL5q3cqDZxO02NoWIWfUU9zzU8xd6o1CKXvI")  // Django CSRF token
                },
                body: JSON.stringify({
                    name: name,
                    price: price,
                    description: description,
                    category: categories
                })
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const product = await response.json();
            alert(`Product "${product.name}" added successfully!`);
            addProductForm.reset();

            // Отправка уведомления через WebSocket
            notifyNewProduct(product.name);
        } catch (error) {
            console.error("Error:", error);
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

    // Загружаем данные при загрузке страницы
    fetchCategories();

    // Подключение к WebSocket
    socket = new WebSocket('ws://127.0.0.1:8001/ws/notify/');

    socket.onopen = function(event) {
        console.log('WebSocket is connected.');
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Message received:', data);
        const message = data.message;

        if (notifications) {
            notifications.innerHTML = `<p>${message.title}: ${message.text}</p>`;
        }
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
    };
});