// ELEMENTS
export const getElement = (selector) => {
    const element = document.querySelector(selector)
    if (!element) {
        console.log(`There no element with this selector: ${selector}`)
        return
    }
    return element

}