import { itemDB } from "../db/DB.js";

export function saveItem(dto) {
    if (itemDB.find(i => i.id === dto.id)) return false;
    itemDB.push(dto);
    return true;
}

export function updateItem(dto) {
    let index = itemDB.findIndex(i => i.id === dto.id);
    if (index !== -1) {
        itemDB[index] = dto;
        return true;
    }
    return false;
}

export function deleteItem(id) {
    let index = itemDB.findIndex(i => i.id === id);
    if (index !== -1) {
        itemDB.splice(index, 1);
        return true;
    }
    return false;
}

export function getAllItems() {
    return itemDB;
}

export function updateItemStock(itemId, qty, action) {
    let item = itemDB.find(i => i.id === itemId);
    if (item) {
        if (action === "reduce") {
            item.stock -= qty; 
        } else if (action === "increase") {
            item.stock += qty; 
        }
        return true;
    }
    return false;
}