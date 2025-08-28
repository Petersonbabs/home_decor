import { app } from "../firebaseConfig/firebase.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
import { getFirestore, collection, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
import { getElement } from "../utils/utils.js"

const auth = getAuth(app)
const DB = getFirestore(app)
const userColRef = collection(DB, "users")
let currentUser

// ELEMENTS
const cartItemsEl = getElement("#cart-items")
const checkOutEl = getElement(".checkout-btn")



onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("You must be logged in to access this page")
        localStorage.setItem("redirectTo", "../pages/carts.html")
        window.location.href = "./login.html"
    } else {
        currentUser = user
        getCartItems(true)
    }
})

const deleteCartItem = async (cartId) => {
    try {
        const cartDocRef = doc(userColRef, currentUser.uid, "carts", cartId)
        await deleteDoc(cartDocRef)
        const buttonEl = document.getElementById(cartId)
        buttonEl.textContent = "Delete"
        getCartItems(false)
    } catch (error) {
        console.log(error)
    } finally {

    }
}


// GET USER CART ITEMS
const getCartItems = async (load) => {
    if (load) {
        cartItemsEl.innerHTML = `
            <div style="padding: 3rem 0;">
            <div class="spinner"></div>
            </div>
            `
    }
    try {
        console.log(currentUser)
        const userCartColRef = collection(DB, "users", currentUser.uid, "carts")
        console.log("userCartColRef")
        const querySnapShot = await getDocs(userCartColRef)
        cartItemsEl.innerHTML = ""

        if (querySnapShot.size === 0) {
            cartItemsEl.innerHTML = `
                <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven’t added anything yet.</p>
                <a class="shop-btn" href="../index.html">Start Shopping</a>
                </div>
            `

            checkOutEl.style.display = "none"
        } else {
            querySnapShot.forEach((doc) => {
                const cartItem = doc.data()
                cartItemsEl.innerHTML += `
                    <div class="cart-card">
                    <div class="cart-left">
                        <div class="cart-img">
                            <img src="${cartItem.image}" alt="">
                        </div>
                        <div>
                            <h3>${cartItem.name.substring(0, 16)}...</h3>
                            <p>$${cartItem.price}</p>
                            <div class="bottom">
                                <span>${cartItem.quantity}</span>
                            </div>
                        </div>
                    </div>
                    <button class="delete-btn " id="${doc.id}" buttonId="${doc.id}">
                        Delete
                    </button>
                </div>
                `
            })
        }

        const deleteCartBtns = document.querySelectorAll(".delete-btn")
        deleteCartBtns.forEach((btn) => {
            const cartId = btn.getAttribute("buttonId")
            btn.addEventListener("click", () => {
                const buttonEl = document.getElementById(cartId)
                buttonEl.innerHTML = `<span class="btn-spinner"></span>`
                deleteCartItem(cartId)
            })
        })

    } catch (error) {

    } finally {

    }
}

// getCartItems()