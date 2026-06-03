import { customerDB } from "../db/DB.js";
import { CustomerDTO } from "../dto/customerDTO.js";
import { saveCustomer, updateCustomer, deleteCustomer } from "../model/customerModel.js";
import { updateDashboardCounts } from "./dashboardController.js";

function loadAllCustomers() {
    let tableBody = document.querySelector('#customer-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ""; 

    customerDB.forEach(customer => {
        let row = `<tr>
                    <td onclick="viewCustomerDetails('${customer.id}')">${customer.id}</td>
                    <td onclick="viewCustomerDetails('${customer.id}')" class="fw-semibold">${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm px-3 me-1" onclick="removeCustomer('${customer.id}')">Delete</button>
            
                        <button class="btn btn-primary btn-sm" onclick="editCustomer('${customer.id}', this)">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                   </tr>`;
        tableBody.innerHTML += row;
    });
}

function viewCustomerDetails(id) {
    let customer = customerDB.find(c => c.id === id);

    if (customer) {
        document.querySelector('#detail-name').innerText = customer.name;
        document.querySelector('#detail-phone').innerText = customer.phone;
        document.querySelector('#detail-email').innerText = customer.email;
        document.querySelector('#detail-address').innerText = customer.address;
        document.querySelector('#detail-note').innerText = customer.note;
    }
}

$(document).ready(function () {
    loadAllCustomers();
});

// ===================== Save Customer =============================
$("#customerForm").submit(function (e) {
    e.preventDefault();
    
    let id = $("#custId").val().trim();
    let name = $("#custName").val().trim();
    let phone = $("#custPhone").val().trim();
    let address = $("#custAddress").val().trim();
    let email = $("#custEmail").val().trim();
    let note = $("#custNote").val().trim();

    // Apply Regex 
    const idRegex = /^C[0-9]{3}$/;           
    const nameRegex = /^[A-Za-z ]{3,}$/;          
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Apply Validation 

    if (!idRegex.test(id)) {
        alert("Invalid ID Format! (Ex: C001)");
        $("#custId").focus();
        return;
    }

    if (!nameRegex.test(name)) {
        alert("Invalid Name! (Letters only, minimum 3 characters)");
        $("#custName").focus();
        return;
    }

    if (address.length < 4) {
        alert("Address should have at least 4 characters!");
        $("#custAddress").focus();
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert("Invalid Phone Number! (Ex: 0761234567)");
        $("#custPhone").focus();
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Invalid Email Format! (Ex: user@example.com)");
        $("#custEmail").focus();
        return;
    }

    let customer = new CustomerDTO(id, name, address, phone, email, note);

    if (saveCustomer(customer)) {
        alert("Customer Saved Successfully!");
        loadAllCustomers(); 
        updateDashboardCounts();
        this.reset();
    } else {
        alert("Customer ID already exists!");
    }
});

// ================================ Delete Customer ================================
export function removeCustomer(id) {
    if (confirm("Are you sure?")) {
        if (deleteCustomer(id)) {
            loadAllCustomers();
            updateDashboardCounts();

        }
    }
}

// Linking functions to the global window object
window.loadAllCustomers = loadAllCustomers;
window.viewCustomerDetails = viewCustomerDetails;
window.removeCustomer = removeCustomer;

// ========================== Update Customer ================================

window.editCustomer = function(id, buttonElement) {
    let row = $(buttonElement).closest('tr');
    let cells = row.find('td').slice(1, 4);

    cells.attr('contenteditable', 'true');
    cells.css({
        'background-color': '#e8f0fe',
        'outline': '2px solid #1e3a8a'
    });

    cells.first().focus();

    cells.off('keydown').on('keydown', function(e) {

        if (e.key === "Enter") { 
            e.preventDefault(); 
            
            let newName = row.find('td').eq(1).text().trim();
            let newPhone = row.find('td').eq(2).text().trim();
            let newAddress = row.find('td').eq(3).text().trim();

            // Apply Validation
            const nameRegex = /^[A-Za-z ]{3,}$/;
            const phoneRegex = /^[0-9]{10}$/;

            if (!nameRegex.test(newName)) {
                alert("Invalid Name! (Letters only, min 3)");
                return;
            }

            if (!phoneRegex.test(newPhone)) {
                alert("Invalid Phone! (Ex: 0771234567)");
                return;
            }

            if (newAddress.length < 5) {
                alert("Address is too short!");
                return;
            }

            let original = customerDB.find(c => c.id === id);
            
            let customerDTO = new CustomerDTO(
                id, newName, newAddress, newPhone, original.email, original.note
            );

            if (updateCustomer(customerDTO)) {
                cells.attr('contenteditable', 'false');
                cells.css({ 'background-color': 'transparent', 'outline': 'none' });
                alert("Customer: " + id + " Updated Successfully!");
                loadAllCustomers();
            }
        }
    });
};

// ================================ Search Customer  =======================================
$("#searchCustomer").on('keydown', function (e) {
    if (e.key === "Enter") { 
        let searchValue = $(this).val().toLowerCase().trim();
        
        let customer = customerDB.find(c => 
            c.id.toLowerCase() === searchValue || 
            c.name.toLowerCase().includes(searchValue)
        );

        if (customer) {

            $("#detail-name").text(customer.name);
            $("#detail-phone").text(customer.phone);
            $("#detail-email").text(customer.email);
            $("#detail-address").text(customer.address);
            $("#detail-note").text(customer.note);
            
            $(this).val(""); 
        } else {
            alert("Customer not found!");
            clearDetailsBox();
        }
    }
});

function clearDetailsBox() {
    $("#detail-name").text("Select a Customer");
    $("#detail-phone").text("-");
    $("#detail-email").text("-");
    $("#detail-address").text("-");
    $("#detail-note").text("-");
}