import { app } from "../firebaseConfig/firebase.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
import { getElement } from "../utils/utils.js"

const auth = getAuth(app)


// ELEMENTS
const loginFormEl = getElement("#login-form")
const emailEl = getElement("#email")
const passwordEl = getElement("#password")
const loginBtnEl = getElement("#login-btn")
const errorMessage = getElement("#error-message")

// LOGIN
const login = async () => {
    errorMessage.textContent = ""

    if (!emailEl.value || !passwordEl.value) {
        errorMessage.textContent = "All fields are required"
        return
    }

    loginBtnEl.disabled = true
    loginBtnEl.innerHTML = "Processing.."
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value)
        if (userCredentials.user) {
            alert("login successful!")
            const redirectTo = localStorage.getItem('redirectTo') || null
            if (redirectTo) {
                window.location.href = redirectTo
                localStorage.removeItem('redirectTo')
            } else {
                window.location.href = "../index.html"
            }
        }
    } catch (error) {
        if (error.code === "auth/invalid-credential") {
            errorMessage.textContent = "Email or password is incorrect"
        }
        console.log(error)
    } finally {
        loginBtnEl.disabled = false
        loginBtnEl.innerHTML = "Login"
    }
}

loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault()
    login()
})