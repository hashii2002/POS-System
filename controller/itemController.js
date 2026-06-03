import { ItemDTO } from "../dto/itemDTO.js";
import { itemDB } from "../db/DB.js";
import { saveItem, updateItem, deleteItem, getAllItems } from "../model/itemModel.js";
import { updateDashboardCounts } from "./dashboardController.js";

export function loadAllItems() {
    let tableBody = document.querySelector('#item-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ""; 

    itemDB.forEach(item => {
        let row = `<tr>
                    <td>${item.id}</td>
                    <td class="fw-semibold">${item.name}</td>
                    <td>${item.category}</td>
                    <td>Rs. ${item.price}.00</td>
                    <td>${item.stock}</td>
                    <td>${item.note}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-1">
                            <button class="btn btn-danger btn-sm px-3" onclick="removeItem('${item.id}')">Delete</button>
                            <button class="btn btn-primary btn-sm px-2" onclick="editItem('${item.id}', this)"><i class="fa-solid fa-pen-to-square"></i></button>
                        </div>
                    </td>
                   </tr>`;
        tableBody.innerHTML += row;
    });
}

$(document).ready(function() {
    loadAllItems();
});

window.loadAllItems = loadAllItems;

// ======================= Save Item ========================= 
$("#itemForm").submit(function (e) {
    e.preventDefault();
    
    let id = $("#itemId").val().trim(); 
    let name = $("#itemName").val().trim();
    let category = $("#itemCategory").val();
    let price = $("#itemPrice").val().trim();
    let stock = $("#itemStock").val().trim();
    let note = $("#itemNote").val().trim();

    // Apply Regex 
    const idRegex = /^I[0-9]{3}$/; 
    const nameRegex = /^[A-Za-z0-9 ]{3,}$/; 

    // Apply Validation
    if (!idRegex.test(id)) {
        alert("Invalid Item ID! (Ex: I001)");
        $("#itemId").focus();
        return;
    }

    if (!nameRegex.test(name)) {
        alert("Invalid Product Name! (Minimum 3 characters)");
        $("#itemName").focus();
        return;
    }

    if (category === null || category === "") {
        alert("Please select a category!");
        $("#itemCategory").focus();
        return;
    }

    if (price === "" || isNaN(price) || parseFloat(price) <= 0) {
        alert("Please enter a valid price!");
        $("#itemPrice").focus();
        return;
    }

    if (stock === "" || isNaN(stock) || parseInt(stock) < 0) {
        alert("Please enter a valid stock amount!");
        $("#itemStock").focus();
        return;
    }

    let newItem = new ItemDTO(id, name, category, price, stock, note);

    if (saveItem(newItem)) {
        alert("Item Saved Successfully!");
        loadAllItems(); 
        updateDashboardCounts();
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
    } else {
        alert("Item ID already exists!");
    }
});

// ============================== Delete Item =================================

window.removeItem = function(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        if (deleteItem(id)) {
            loadAllItems();
            updateDashboardCounts();
        }
    }
}

// ====================== Update Item ===========================

window.editItem = function(id, buttonElement) {
    let row = $(buttonElement).closest('tr');
    let cells = row.find('td').slice(1, 6); 

    cells.attr('contenteditable', 'true');
    cells.css({
        'background-color': '#e8f0fe',
        'outline': '2px solid #1e3a8a',
        'border-radius': '4px'
    });

    cells.first().focus();

    cells.off('keydown').on('keydown', function(e) {
        if (e.key === "Enter") { 
            e.preventDefault(); 
            
            let newName = row.find('td').eq(1).text().trim();
            let newCategory = row.find('td').eq(2).text().trim();
            let rawPrice = row.find('td').eq(3).text().replace('Rs. ', '').trim();
            let rawStock = row.find('td').eq(4).text().trim();
            let newNote = row.find('td').eq(5).text().trim();
            
            // Apply Validation
            if (newName.length < 3) {
                alert("Product name is too short!");
                return;
            }

            let price = parseFloat(rawPrice);
            if (isNaN(price) || price <= 0) {
                alert("Please enter a valid Price!");
                return;
            }

            let stock = parseInt(rawStock);
            if (isNaN(stock) || stock < 0) {
                alert("Please enter a valid Stock count!");
                return;
            }

            let updatedItem = new ItemDTO(id, newName, newCategory, price, stock, newNote );

            if (updateItem(updatedItem)) {
                cells.attr('contenteditable', 'false').removeAttr('style');
                alert("Item: " + id + " Updated Successfully!");
                loadAllItems();
            }
        }
    });
};

// ========================= Search Item ==============================
$("#searchItem").on('keydown', function (e) {
    if (e.key === "Enter") { 
        let searchValue = $(this).val().toLowerCase().trim();
        
        $('#item-table-body tr').removeClass('highlight-row');

        if (searchValue === "") return; 

        let item = itemDB.find(i => 
            i.id.toLowerCase() === searchValue || 
            i.name.toLowerCase().includes(searchValue)
        );

        if (item) {
        
            let targetRow = $(`#item-table-body tr td:first-child`).filter(function() {
                return $(this).text().trim().toLowerCase() === item.id.toLowerCase();
            }).closest('tr');

            if (targetRow.length > 0) {
        
                targetRow.addClass('highlight-row');
                
                targetRow[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                $(this).val(""); 
            }
        } else {
            alert("Item not found!");
        }
    }
});

//  remove highlight
$(document).on('click', function (e) {
    if (!$(e.target).closest('#searchItem, #item-table-body tr').length) {
        $('#item-table-body tr').removeClass('highlight-row');
    }
});