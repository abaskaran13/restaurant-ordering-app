import { menuArray } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const menuList = document.getElementById('menu-list')
let cart = []
let cartPrices = []

function createMenu(menuArray){
    return menuArray.map((item)=>{
        return `
        <div class="flex-item">
            <p class="item-img">${item.emoji}</p>
            <div class="item-details">
                <h2 class="item-name">${item.name}</h2>
                <p class="item-ingredients">${item.ingredients.join(', ')}</p>
                <p class="price">$${item.price}</p>
            </div>
            <button class="add-item-btn" data-item-id="${item.id}">+</button>
        </div>
        `
    }).join('')
}

function renderMenu(){
    menuList.innerHTML = createMenu(menuArray)
}

renderMenu()

document.addEventListener('click', function(e){
    if (e.target.classList[0] === 'add-item-btn'){
        const inputItemId = Number(e.target.dataset.itemId)
        const item = {...menuArray.filter((menuItem)=>{
            return menuItem.id === inputItemId
        })[0]}
    
        cart.push(item)
        item['removeBtnId'] = uuidv4()
        cartPrices.push(item.price)
        
        renderCart()
    } else if (e.target.classList[0] === 'remove-btn'){
        const removeBtnId = e.target.dataset.removeId
        cart.forEach((item, index) => {
            if (item.removeBtnId === removeBtnId){
                cartPrices.splice(cartPrices.findIndex((price) => price === item.price), 1)
                cart.splice(index, 1)
            }
        })
        renderCart()
    }
})

function renderCart(){
    if(cart.length === 0){
        container.innerHTML = ''
        return
    }

    if (cart.length === 1){
        document.getElementById('container').innerHTML = createCartStr()
    } 
    document.getElementById('user-cart').innerHTML = createItemsStr()
    document.getElementById('total-price').innerHTML = getCartTotal()

    document.getElementById('complete-order-btn').addEventListener('click', function(){
        document.getElementById('card-form').classList.remove('no-display')
        document.getElementById('pay-btn').addEventListener('click', (e)=>{
            e.preventDefault()
            const form = document.querySelector('form')
            if(form.checkValidity()){
                document.getElementById('card-form').classList.add('no-display')
                container.innerHTML = `
                <div class="confirmation-screen">
                    <p>Thanks, ${document.getElementById('name').value}! Your order is on its way!</p>
                </div>
                `
            } else {
                form.reportValidity();
            }
        })
    })
}

function getCartTotal(){
    return `$${cartPrices.reduce((totalPrice, itemPrice) => {
        return totalPrice + itemPrice
    })}`
}

function createCartStr(){
    return `
    <div class="checkout">
        <p class="checkout-title">Your order</p>
        <div class="user-cart" id="user-cart">
            
        </div>
        <div class="total-price">
            <p class="name">Total price: </p>
            <p class="price" id="total-price"></p>
        </div>
        <button class="complete-order-btn" id="complete-order-btn">Complete Order</button>
    </div>
    `
}

function createItemsStr(){
    return cart.map(({name, removeBtnId, price}) => {
        return `
        <div class="cart-item">
            <p class="name">${name}</p>
            <button class="remove-btn" data-remove-id="${removeBtnId}">remove</button>
            <p class="price">$${price}</p>
        </div>
        `
    }).join('')
}

