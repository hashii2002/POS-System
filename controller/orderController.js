import { itemDB } from "../db/DB.js";
import { orderDB } from "../db/DB.js";
import { OrderDTO } from "../dto/orderDTO.js";
import { getAllOrders, saveOrder, deleteOrder } from "../model/orderModel.js";
import { getAllCustomers, searchCustomer } from "../model/CustomerModel.js";
import { updateItemStock } from "../model/itemModel.js";
import { loadAllItems } from "./itemController.js";
import { updateDashboardCounts} from "./dashboardController.js";

//======================= All Categories load ==========================

$(document).ready(function() {
    loadAllItemsToOrderPage();
});

export function loadAllItemsToOrderPage() {
    let orderItemList = $('#order-item-list');
    orderItemList.empty(); 

    itemDB.forEach(item => {
        let itemCard = `
            <div class="order-item-card d-flex justify-content-between align-items-center shadow-sm" data-id="${item.id}">
                <div>
                    <span class="fw-bold d-block text-dark">${item.name}</span>
                    <small class="text-secondary d-block">ID: ${item.id}</small>
                    <small class="text-primary fw-bold">Rs. ${item.price.toFixed(2)}</small>
                    <div class="text-muted" style="font-size: 11px;">Stock: ${item.stock}</div>
                </div>
                <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" 
                        onclick="addToCart('${item.id}')">
                    <i class="fa-solid fa-plus"></i> Add
                </button>
            </div>`;
        
        orderItemList.append(itemCard);
    });
}

// ================================ Search Item ===================================

$('#item-search-box').on('keypress', function(e) {
    if (e.key === "Enter") {
        let searchValue = $(this).val().toLowerCase().trim();
        let found = false;

        $('#order-item-list .order-item-card').removeClass('search-highlight');

        if (searchValue === "") {
            $('#order-item-list .order-item-card').show();
            return;
        }

        $('#order-item-list .order-item-card').each(function() {
            let itemName = $(this).find('.fw-bold').text().toLowerCase();
            
            let rawId = $(this).attr('data-id'); 
            let itemId = rawId ? rawId.toLowerCase() : "";
            
            if (itemName.includes(searchValue) || itemId.includes(searchValue)) {
                found = true;
                $(this).show();
                $(this).addClass('search-highlight');

                let container = $('#order-item-list');
                container.animate({
                    scrollTop: $(this).offset().top - container.offset().top + container.scrollTop()
                }, 500);

            }
        });

        if (!found) {
            alert("Item not found!");
        }
    }
});

// =================== Load All Orders to Table ===================

export function loadAllOrdersToTable() {
    let orderBody = $('#order-details-body');
    orderBody.empty(); 

    let allOrders = getAllOrders();

    allOrders.forEach(order => {
        let itemsHtml = "";
        let qtyHtml = "";

        order.items.forEach(item => {
            itemsHtml += `<div>${item.name}</div>`;
            qtyHtml += `<div>${item.orderQty}</div>`;
        });

        let row = `
            <tr>
                <td class="fw-bold text-primary">${order.orderId}</td>
                <td>${order.date}</td>
                <td>${order.customerId}</td>
                <td>${order.paymentId}</td>
                <td>${itemsHtml}</td>
                <td>${qtyHtml}</td>
                <td>${order.paymentMethod}</td>
                <td class="text-danger fw-bold">-${order.discount.toFixed(2)}</td>
                <td class="text-end fw-bold text-success">${order.total.toFixed(2)}</td>
            </tr>`;

        orderBody.append(row);
    });
}

$(document).ready(function() {
    loadAllOrdersToTable();

    let today = new Date().toISOString().split('T')[0];
    $('#order-date').val(today);
});

// ===================================== Search Order ===========================
let selectedOrderId = null;

function searchOrder() {
    let searchValue = $('#order-search-input').val().toUpperCase();
    
    $('#order-details-body tr').removeClass('highlight-row');

    if (searchValue === "") {
        selectedOrderId = null;
        return;
    }

    let found = false;

    $('#order-details-body tr').each(function () {
        let orderIdInTable = $(this).find('td:first').text().toUpperCase();

        if (orderIdInTable === searchValue) {
            $(this).addClass('highlight-row');
            
            if (!found) {
                $(this)[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
            }
        }
    });

    if(!found) {
        selectedOrderId = null;
        alert("Order ID not found!");
    }
}

$(document).ready(function() {
    $('#order-search-input').on('keyup', function (e) {
        if (e.key === 'Enter') {
            searchOrder();
        }
    });

    $('#btn-search-order').click(function() {
        searchOrder();
    });
});

// ================================ Customer Details Box =============================

// Fill in all Customer IDs in the dropdown
export function loadAllCustomerIds() {
    let customerIds = getAllCustomers(); 
    let idSelect = $('#order-cust-id');
    
    idSelect.empty().append('<option value="">Select Customer ID</option>');

    customerIds.forEach(customer => {
        idSelect.append(`<option value="${customer.id}">${customer.id}</option>`);
    });
}

// Auto-fill 
function setCustomerDetails(id) {
    if (id === "") {
        $('#order-cust-name').val("");
        $('#order-cust-phone').val("");
        return;
    }

    let customer = searchCustomer(id); 

    if (customer) {
        $('#order-cust-name').val(customer.name);
        $('#order-cust-phone').val(customer.phone);
    }
}

// Event Listeners
$(document).ready(function() {
    loadAllCustomerIds();

    $('#order-cust-id').on('change', function() {
        let selectedId = $(this).val();
        setCustomerDetails(selectedId);
    });
});

// ============================================= Cart ============================================
let cartArray = [];

window.addToCart = function(itemId) {
    let item = itemDB.find(i => i.id === itemId);

    if (item && item.stock > 0) { 
        let existingItem = cartArray.find(i => i.id === itemId);

        if (existingItem) {
            existingItem.orderQty += 1;
            existingItem.total = existingItem.orderQty * existingItem.price;
        } else {
            cartArray.push({
                id: item.id, name: item.name, price: item.price, orderQty: 1, total: item.price
            });
        }
        updateItemStock(itemId, 1, "reduce");
        
        loadAllItemsToOrderPage(); 
        loadAllItems();
        renderCartTable();
    } else {
        alert("Out of Stock!");
    }
};

// Render Cart Table
function renderCartTable() {
    let cartBody = $('#cart-table-body');
    cartBody.empty();
    let subTotal = 0;

    cartArray.forEach((item, index) => {
        subTotal += item.total;

        let row = `
            <tr>
                <td class="text-start ps-2">${item.name}</td>
                <td>
                    <input type="number" class="form-control form-control-sm text-center mx-auto" 
                           style="width: 60px;" value="${item.orderQty}" 
                           onchange="updateCartQty('${item.id}', this.value)">
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td class="fw-bold">${item.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>`;
        cartBody.append(row);
    });

    $('#sub-total').text(`Rs. ${subTotal.toFixed(2)}`);
    calculateFinalTotal();
}

// Change Cart item Quantity
window.updateCartQty = function(itemId, newQty) {
    let cartItem = cartArray.find(i => i.id === itemId);
    let itemInDB = itemDB.find(i => i.id === itemId);
    newQty = parseInt(newQty);

    if (cartItem && newQty > 0) {
        let diff = newQty - cartItem.orderQty;

        if (diff > 0) { 
            if (itemInDB.stock >= diff) {
                updateItemStock(itemId, diff, "reduce");
                cartItem.orderQty = newQty;
            } else {
                alert("ප්‍රමාණවත් තොග නොමැත!");
            }
        } else { 
            updateItemStock(itemId, Math.abs(diff), "increase");
            cartItem.orderQty = newQty;
        }
        
        cartItem.total = cartItem.orderQty * cartItem.price;
        loadAllItemsToOrderPage();
        loadAllItems();
        renderCartTable();
    }
};

// Remove Cart Item
window.removeFromCart = function(index) {
    let item = cartArray[index];

    updateItemStock(item.id, item.orderQty, "increase");
    cartArray.splice(index, 1);
    
    loadAllItemsToOrderPage();
    loadAllItems();
    renderCartTable();
};

// ============================== Payment logic Handle ====================================

$(document).ready(function() {
    generateNextOrderId();

    $('#order-discount, #amount-paid').on('input', function() {
        calculateFinalTotal();
    });

    $('.btn-success').on('click', function() {
        placeOrder();
    });
});

// Auto Generate Next Order ID
function generateNextOrderId() {
    let allOrders = getAllOrders();
    let nextId = "ORD-001"; 

    if (allOrders && allOrders.length > 0) {
        let lastOrder = allOrders[allOrders.length - 1];
        
        let lastId = lastOrder.id || lastOrder.orderId; 

        if (lastId) {
            let lastIdNum = parseInt(lastId.split('-')[1]);
            nextId = "ORD-" + String(lastIdNum + 1).padStart(3, '0');
        }
    }
    //update UI
    $('#payment-id-input + input').val(nextId); 
}

// Calculation Part
function calculateFinalTotal() {

    let subTotalText = $('#sub-total').text().replace('Rs. ', '');
    let subTotal = parseFloat(subTotalText) || 0;

    $('label:contains("Sub Total :") + input').val(subTotal.toFixed(2));

    let discountPercent = parseFloat($('#order-discount').val()) || 0;

    let amountPaid = parseFloat($('#amount-paid').val()) || 0;

    let discountAmount = (subTotal * discountPercent) / 100;

    let finalTotal = subTotal - discountAmount;

    $('#final-total').text(finalTotal.toFixed(2));

    let balance = amountPaid - finalTotal;
    $('#balance-amount').val(balance >= 0 ? balance.toFixed(2) : "0.00");
}

// Place Order Function
function placeOrder() {
    let orderId = $('#payment-id-input + input').val();
    let customerId = $('#order-cust-id').val();
    let date = $('#order-date').val();
    let discount = parseFloat($('#order-discount').val()) || 0;
    let total = parseFloat($('#final-total').text());
    let method = $('#payment-method').val();

    if (!customerId || cartArray.length === 0) {
        alert("Please select a customer and items!");
        return;
    }

    let newOrder = new OrderDTO(orderId, date, customerId, cartArray, discount, total, "P-AUTO", method);

    if (saveOrder(newOrder)) {
        alert("Order completed successfully!");
        clearAllFields();
        loadAllOrdersToTable();
        updateDashboardCounts();
    }
}

function clearAllFields() {
    cartArray = []; 
    renderCartTable(); 
    $('#order-discount, #amount-paid, #balance-amount').val("");
    $('label:contains("Sub Total :") + input').val("0.00");
    $('#final-total').text("0.00");
    generateNextOrderId();
    loadAllItemsToOrderPage();
}

// ======================== Clear Cart Button ===========================
window.clearCart = function() {
    if (cartArray.length > 0) {
        if(confirm("Are you sure you want to empty the cart?")){
            cartArray.forEach(item => {
            updateItemStock(item.id, item.orderQty, "increase");
        });

        cartArray = [];

        renderCartTable();
        calculateFinalTotal();
        loadAllItemsToOrderPage(); 
        }
        
    } else {
        alert("Cart is already empty!");
    }
        
};

// ================================== Order Delete =============================

// Getting the ID when a table row is clicked
$('#order-details-body').on('click', 'tr', function () {
    
    selectedOrderId = $(this).find('td:first').text();
    $('#order-details-body tr').removeClass('highlight-row');
    $(this).addClass('highlight-row');
});

window.deleteSelectedOrder = function() {
    if (selectedOrderId) {
        if (confirm(`Are you sure you want to delete ${selectedOrderId} ?`)) {
            if (deleteOrder(selectedOrderId)) {
                alert("Delete Order successfully! ");
                loadAllOrdersToTable(); 
                updateDashboardCounts();
                selectedOrderId = null; 
            }
        }
    } else {
        alert("Please select an order from the table!");
    }
};