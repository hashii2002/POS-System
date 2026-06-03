export class OrderDTO {
    constructor(orderId, date, customerId, items, discount, total, paymentId, paymentMethod) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.items = items;
        this.discount = discount;
        this.total = total;
        this.paymentId = paymentId; 
        this.paymentMethod = paymentMethod;
    }
}