document.addEventListener("DOMContentLoaded", () => {
    const deleteProductForm = document.getElementById("delete-product-form");
    const responseMessage = document.getElementById("response-message");

    deleteProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const productId = document.getElementById("product-id").value;

        try {
            const response = await fetch(`http://127.0.0.1:8002/api/core/delete/${productId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("ynT8g6i5F8h43Hd9zUvgebKTPKCaDL5q3cqDZxO02NoWIWfUU9zzU8xd6o1CKXvI")  // Django CSRF token
                }
            });

            if (response.ok) {
                responseMessage.textContent = `Product with ID ${productId} deleted successfully.`;
            } else {
                responseMessage.textContent = `Failed to delete product.`;
            }
        } catch (error) {
            console.error("Error:", error);
            responseMessage.textContent = `Error occurred while deleting product.`;
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