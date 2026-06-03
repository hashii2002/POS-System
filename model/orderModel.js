import { orderDB } from "../db/DB.js";

export function getAllOrders() {
    return orderDB;
}

export function searchOrderById(id) {
    return orderDB.find(order => order.id.toUpperCase() === id.toUpperCase());
}

export function saveOrder(orderDTO) {
    if (orderDTO) {
        orderDB.push(orderDTO);
        return true;
    }
    return false;
}

export function getOrderCount() {
    return orderDB.length;
}

export function deleteOrder(orderId) {
    let index = orderDB.findIndex(order => (order.orderId === orderId || order.id === orderId));
    if (index !== -1) {
        orderDB.splice(index, 1);
        return true;
    }
    return false;
}