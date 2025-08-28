import { app } from "./firebaseConfig/firebase.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
import { getFirestore, collection, doc, getDoc, addDoc, writeBatch, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
import { getElement } from "../utils/utils.js"

const auth = getAuth(app)
const DB = getFirestore(app)
const userColRef = collection(DB, "users")
const productsColRef = collection(DB, "products");
let currentUser
// ELEMENTS

const greetUserEl = getElement("#greet-user")
const productsEl = getElement("#new-collections")

onAuthStateChanged(auth, (user) => {
    if (user) {
        handleAuthState(user)
        currentUser = user
    }
})

const handleLogout = async () => {
    await signOut(auth)
    // handleAuthState()
    window.location.reload()
}


const handleAuthState = async (user) => {

    try {
        // fetch the user's document from firestore user the uid
        const userDocRef = doc(userColRef, user.uid)
        const querySnapShot = await getDoc(userDocRef)
        const userData = querySnapShot.data()
        greetUserEl.innerHTML = `
            <h3>Hi ${userData.name.split(" ")[0]}, Welcome Back</h3>
            <p>Create spaces that bring joy</p>
            <button style="margin-top: .5rem; background: black; border: none; color: white; padding: .2rem .6rem"  id="logout-btn">logout</button>
        `
        document.getElementById("logout-btn").addEventListener("click", handleLogout)

    } catch (error) {
        console.log(error)
    }
}

// NodeList
// custom attribute
// querySelectorAll
const addToCart = async (productId) => {
    // add the product to the user's carts sub-collection
    if (!currentUser) {
        alert("YOu must login to perform this action")
        window.location.href = "./pages/login.html"
        return
    }
    try {
        // find the product from products collection
        const productRef = doc(productsColRef, productId)
        const querySnapShot = await getDoc(productRef)
        console.log(querySnapShot)
        const product = querySnapShot.data()
        const newCartItem = {
            name: product.title,
            image: product.image,
            price: product.price,
            quantity: 2
        }
        const userCartColRef = collection(DB, "users", currentUser.uid, "carts")
        const docRef = await addDoc(userCartColRef, newCartItem)
        alert(`${product.title} has been added to cart`)
    } catch (error) {
        console.log(error)
    } finally {
        const buttonEl = document.getElementById(productId)
        buttonEl.innerHTML = `<img src="./images/plus.png" alt="">`
    }
}


const getAllProducts = async () => {
    productsEl.innerHTML = `
        <p style="text-align:center; color: #333; padding: 3rem 0;">Loading...</p>
    `
    try {
        const querySnapShot = await getDocs(productsColRef)
        productsEl.innerHTML = ""
        querySnapShot.forEach((doc) => {
            const product = doc.data()
            productsEl.innerHTML += `
                <div class="product">
                    <div class="img-con">
                        <img src="${product.image}" alt="">
                    </div>

                    <h3>${product.title.substring(0, 16)}...</h3>
                    <p>${product.description.substring(0, 25)}...</p>

                    <div class="bottom">
                        <span class="price">$${product.price}</span>
                        <div class="actions">
                            <button>
                                <img src="./images/heart.png" alt="">
                            </button>
                            <button class="cart-btn" id="${doc.id}" buttonId="${doc.id}">
                                <img src="./images/plus.png" alt="">
                            </button>
           
                            </div>
                    </div>
                </div>
            `


        })

        const cartButtons = document.querySelectorAll(".cart-btn")
        cartButtons.forEach((btn) => {
            const productId = btn.getAttribute("buttonId")
            btn.addEventListener("click", (e) => {
                const buttonEl = document.getElementById(productId)
                buttonEl.textContent = "---"
                addToCart(productId)
            })
        })


    } catch (error) {
        console.log(error)
    } finally {

    }
}


getAllProducts()

// const addBulkProducts = async () => {
//     const batch = writeBatch(DB)
//     const productsColRef = collection(DB, "products");
//     try {
//         const res = await fetch("https://fakestoreapi.com/products")
//         const data = await res.json()
//         data.forEach((product) => {
//             const docRef = doc(productsColRef) // auto AI-generated
//             batch.set(docRef, product)
//         })

//         await batch.commit();
//         console.log("✅ Products uploaded successfully!");

//     } catch (error) {
//         console.log(error)
//     }
// }
// addBulkProducts()