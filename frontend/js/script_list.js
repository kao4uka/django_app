document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let currentPage = 1;
    let totalPages = 1;

    async function fetchProducts(page = 1) {
        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/list/?page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched products:', data);

            productList.innerHTML = data.results.map(product =>
                `<li>
                    ${product.name} - $${product.price} - ${product.description}
                    <a href="product_detail.html?id=${product.id}">Details</a>
                    <a href="product_update.html?id=${product.id}">Update</a>
                </li>`
            ).join("");

            currentPage = page;
            totalPages = Math.ceil(data.count / 10);
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

            // Управление кнопками пагинации
            prevPageButton.disabled = currentPage <= 1;
            nextPageButton.disabled = currentPage >= totalPages;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Управление кнопками пагинации
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchProducts(currentPage - 1);
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            fetchProducts(currentPage + 1);
        }
    });

    fetchProducts();

    const socket = new WebSocket('ws://127.0.0.1:8001/ws/notify/');

    socket.onopen = function(event) {
        console.log('WebSocket is connected.');
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Message received:', data);
        const message = data.message;

        const notifications = document.getElementById("notifications");
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