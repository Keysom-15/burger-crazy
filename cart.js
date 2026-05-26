let cart = JSON.parse(localStorage.getItem('crazy-cart')) || [];

const WHATSAPP_PHONE = "3105153742"; // Cambia este número una sola vez aquí

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        renderCart();
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function toggleItemBtn(element) {
    // Busca el contenedor de acciones (para pizzas) o el botón directo (para otros menús)
    const target = element.querySelector('.action-container') || 
                   element.querySelector('button[onclick*="addToCart"]') ||
                   element.querySelector('button');
    if (target) target.classList.toggle('hidden');
}

function addToCart(event, name, price) {
    event.stopPropagation();
    const id = 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    cart.push({ id, name, price });
    saveCart();
    updateCartUI();
    
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '¡AÑADIDO!';
    btn.classList.add('bg-tertiary');
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-tertiary');
    }, 1000);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    renderCart();
}

function saveCart() {
    localStorage.setItem('crazy-cart', JSON.stringify(cart));
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    if (!container || !totalElem) return;

    let total = 0;
    container.innerHTML = cart.length === 0 ? '<p class="text-on-surface-variant text-center mt-xl">¡Tu carrito está vacío! 🍔</p>' : '';
    
    cart.forEach(item => {
        total += item.price;
        container.innerHTML += `
            <div class="flex justify-between items-center bg-surface-container-high p-sm border-2 border-black brutal-shadow">
                <div>
                    <p class="font-label-bold uppercase text-sm">${item.name}</p>
                    <p class="font-price-display text-tertiary text-sm">$${item.price.toLocaleString()}</p>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="material-symbols-outlined text-error hover:scale-110 transition-transform">delete</button>
            </div>`;
    });
    totalElem.innerText = `$${total.toLocaleString()}`;
}

function updateCartUI() {
    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) {
        headerCount.innerText = cart.length;
        headerCount.classList.toggle('hidden', cart.length === 0);
    }
}

function sendOrderWhatsApp() {
    if (cart.length === 0) return;
    let message = "NUEVO PEDIDO BURGER CRAZY\n\n" + cart.map(i => `- ${i.name}: $${i.price.toLocaleString()}`).join('\n');
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    message += `\n\nTOTAL: $${total.toLocaleString()}`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`);

    // Limpiar el carrito después de enviar para una mejor experiencia de usuario
    cart = [];
    saveCart();
    updateCartUI();
    toggleCartModal();
}

function sendContactWhatsApp(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value || "No proporcionado";
    const message = document.getElementById('contact-message').value;
    
    const waMessage = `MENSAJE DE CONTACTO - BURGER CRAZY\n\n` +
                      `Nombre: ${name}\n` +
                      `Email: ${email}\n` +
                      `Mensaje: ${message}`;
    
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waMessage)}`);
    event.target.reset(); // Limpia el formulario después de enviar
}

document.addEventListener('DOMContentLoaded', updateCartUI);