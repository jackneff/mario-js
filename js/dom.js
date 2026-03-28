// DOM helper functions

export function createElement(type, className, styles = {}) {
    const element = document.createElement("div")
    element.className = className
    Object.assign(element.style, styles)
    return element
}

export function updateElementPosition(element, x, y) {
    element.style.left = x + "px"
    element.style.top = y + "px"
}
