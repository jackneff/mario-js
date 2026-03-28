// Collision detection using AABB (axis-aligned bounding box)

export function checkCollision(element1, element2) {
    return element1.x < element2.x + element2.width &&
        element1.x + element1.width > element2.x &&
        element1.y < element2.y + element2.height &&
        element1.y + element1.height >= element2.y
}
