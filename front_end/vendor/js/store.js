if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    let addToCartButtons = document.getElementsByClassName('btn-card')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    //document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}



function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('ticket-title')[0].innerText
    let price = shopItem.getElementsByClassName('ticket-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    let cartRows = cartItems.getElementsByClassName('cart-row')
    for (let i = 0; i < cartRows.length; i++) {
        if (cartItemNames[i].innerText == title) {
            let cartRow = cartRows[i]
            let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            quantityElement.value = parseInt(quantityElement.value) + 1;
            return
        }

    }

    let ticketID = 0;

    switch (title) {
        case ("Senha Simples"):
            ticketID = 1;
            break;
        case ("Senha Completa"):
            ticketID = 2;
            break;
        case ("Senha Rampa B"):
            ticketID = 4;
            break;
        case ("Senha Grill"):
            ticketID = 3;
            break;
        case ("Pack de Senhas Simples"):
            ticketID = 6;
        case ("Pack de Senhas"):
            ticketID = 5;
            break;
        default:
            ticketID = 1;
            break;
    }

    let cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <input class="cart-quantity-input" type="hidden" value=${ticketID}>
            <button class="btn btn-danger" type="button">X</button>
            

           
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }


    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '€' + total
}


function getItems() {
    let cart = {
        items: []
    }
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let ticketID = cartRow.getElementsByClassName('cart-quantity-input')[1].value;
        let quantityString = cartRow.getElementsByClassName('cart-quantity-input')[0].value;
        let quantity = parseInt(quantityString);
        let item = { ticketID, quantity }
        cart.items.push(item);
    }

    console.log(JSON.stringify(cart));
    pay(cart);

}


function pay(cart) {
    fetch('https://isi-ticket-api.herokuapp.com/paypalV2/pay', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(cart)
    }).then(res => res.json())
      .then(data => window.location.href = data.url);

}
