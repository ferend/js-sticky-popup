(function () {
    function createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    }

    function getProductDetails() {
        const titleElement = document.querySelector('.product-single__title');
        const priceElement = document.querySelector('.product-single__price');
        const sizes = document.querySelectorAll('select#SingleOptionSelector-0 option');
        const colors = document.querySelectorAll('select#SingleOptionSelector-1 option');
    
        return {
            name: titleElement ? titleElement.innerText : 'Product Name Not Found',
            price: priceElement ? priceElement.innerText : 'Price Not Found',
            sizes: sizes ? Array.from(sizes).map(opt => opt.value) : [],
            colors: colors ? Array.from(colors).map(opt => opt.value) : [],
            quantity: 1,
        };
    }
    
    function createStickyPopup(details) {
        if (document.querySelector('.sticky-popup')) return; 
    
        const popup = createElement('div', 'sticky-popup');
        popup.setAttribute('aria-label', 'Product Details Pop-up');
        popup.setAttribute('role', 'dialog');
    
        const closeButton = createElement('span', 'popup-close', 'X');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
        
        
        let sizeOptions = details.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
        let colorOptions = details.colors.map(color => `<option value="${color}">${color}</option>`).join('');
    
        const content = `
            <h2>${details.name}</h2>
            <p class="popup-price">${details.price}</p>
            <label for="popup-size">Size</label>
            <select id="popup-size">${sizeOptions}</select>
            <label for="popup-color">Color</label>
            <select id="popup-color">${colorOptions}</select>
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" value="${details.quantity}" min="1" />
            <button id="addToCartPopup">Add to Cart</button>
        `;
    
        popup.innerHTML = content;
        popup.prepend(closeButton); 
    
        document.body.appendChild(popup);
        
        document.getElementById('addToCartPopup').addEventListener('click', () => {
            const selectedSize = document.getElementById('popup-size').value;
            const selectedColor = document.getElementById('popup-color').value;
            const quantity = document.getElementById('quantity').value;
            submitAddToCart(selectedSize, selectedColor, quantity);
        });
    }
    

    function submitAddToCart(size, color, quantity) {
        const form = document.querySelector('form[action="/cart/add"]');
        if (!form) {
            alert('Add to Cart form not found.');
            return;
        }
    
        const sizeSelector = document.querySelector('#SingleOptionSelector-0');
        const colorSelector = document.querySelector('#SingleOptionSelector-1');
        const quantityInput = document.querySelector('input[name="quantity"]');
    
        if (sizeSelector && colorSelector && quantityInput) {
            sizeSelector.value = size;
            colorSelector.value = color;
            quantityInput.value = quantity;
    
            // Trigger change events for size and color selectors
            const changeEvent = new Event('change', { bubbles: true });
            sizeSelector.dispatchEvent(changeEvent);
            colorSelector.dispatchEvent(changeEvent);
    
            form.submit();
        } else {
            alert('Unable to find required input fields.');
        }
    }
    

    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .sticky-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                background: linear-gradient(145deg, #ffffff, #e6e6e6);
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 20px;
                font-family: 'Arial', sans-serif;
                z-index: 1000;
                animation: slideUp 0.5s ease;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .sticky-popup h2 {
                font-size: 22px;
                margin-bottom: 10px;
                color: #333;
                font-weight: bold;
            }
            .popup-price {
                font-size: 18px;
                font-weight: bold;
                margin: 5px 0 15px;
                color: #007bff;
            }
            .sticky-popup label {
                font-size: 14px;
                color: #666;
                display: block;
                margin-bottom: 5px;
            }
            .sticky-popup select, .sticky-popup input {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 14px;
                color: #333;
                background: #fff;
            }
            .sticky-popup button {
                width: 100%;
                padding: 12px;
                font-size: 16px;
                font-weight: bold;
                color: white;
                background: #007bff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: background 0.3s ease, box-shadow 0.3s ease;
            }
            .sticky-popup button:hover {
                background: #0056b3;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            }
            .popup-close {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 20px;
                font-weight: bold;
                color: #333;
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
            }
            .popup-close:hover {
                color: #007bff;
            }
        `;
        document.head.appendChild(style);
    }

    function init() {
        const details = getProductDetails();
        createStickyPopup(details);
        injectStyles();
    }

    init();
})();
