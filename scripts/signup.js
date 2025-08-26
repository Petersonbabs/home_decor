import { app } from "../firebaseConfig/firebase.js"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
import { getElement } from "../utils/utils.js"

const auth = getAuth(app)
const DB = getFirestore(app)
const usersColRef = collection(DB, "users")

const signupFormEl = getElement("#signup-form")
const nameEl = getElement("#name")
const emailEl = getElement("#email")
const mobileNumberEl = getElement("#mobile-number")
const birthDay = getElement("#birthday")
const password = getElement("#password")
const confirmPassword = getElement("#confirm-password")
const signupBtn = getElement("#signup-btn")
const errorMessage = getElement("#error-message")

// SIGN UP
const signup = async () => {
    // ensure no input is empty
    // check is the password matches
    errorMessage.textContent = ""
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match")
        return
    }
    signupBtn.disabled = true
    signupBtn.innerHTML = "Processing.."
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, emailEl.value, password.value)
        if (userCredentials.user) {
            sendEmailVerification(userCredentials.user)
            const newUser = {
                name: nameEl.value,
                email: emailEl.value,
                birthDay: birthDay.value,
                mobileNumber: mobileNumberEl.value
            }
            const userDocRef = doc(usersColRef, userCredentials.user.uid)
            await setDoc(userDocRef, newUser)
            window.location.href = "../pages/login.html"
        }
    } catch (error) {
        console.log(error)
        console.log(error.code)
        if (error.code == "auth/email-already-in-use") {
            errorMessage.textContent = "Email already exists"
        } else if (error.code == "auth/missing-email") {
            errorMessage.textContent = "Email is required"
        } else {
            errorMessage.textContent = "Something went wrong"
        }
    } finally {
        signupBtn.disabled = false
        signupBtn.innerHTML = "Sign up"
    }
}

signupFormEl.addEventListener("submit", (e) => {
    e.preventDefault()
    signup()
})