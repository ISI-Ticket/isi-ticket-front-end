if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}



function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }


    //  var addToCartButtons = document.getElementsByClassName('shop-item-button')
    var addToCartButtons = document.getElementsByClassName('classbuttton2')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}



function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('recipe-title')[0].innerText
    var price = shopItem.getElementsByClassName('recipe-ingredients')[0].innerText
    //var ticketID = shopItem.getElementsByClassName('recipe-ingredients')[1].innerText
    //console.log(ticketID)
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    var cartRows = cartItems.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++) {
        if (cartItemNames[i].innerText == title) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            quantityElement.value = parseInt(quantityElement.value) + 1;
            return
        }

    }
    /*for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }*/
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
        case ("Pack de Senhas"):
            ticketID = 5;
            break;
        default:
            ticketID = 1;
            break;
    }

    var cartRowContents = `
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
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }


    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '€' + total
}


function getItems() {
    let cart = {
        items: []
    }
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++) {
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
