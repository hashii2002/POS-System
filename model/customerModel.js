import { customerDB } from "../db/DB.js";

export function saveCustomer(customerDTO) {

    if (customerDB.find(c => c.id === customerDTO.id)) {
        return false;
    }
    customerDB.push({
        id: customerDTO.id,
        name: customerDTO.name,
        address: customerDTO.address,
        phone: customerDTO.phone,
        email: customerDTO.email,
        note: customerDTO.note
    });
    return true;
}

export function updateCustomer(customerDTO) {
    let index = customerDB.findIndex(c => c.id === customerDTO.id);
    if (index !== -1) {
        customerDB[index] = {
            id: customerDTO.id,
            name: customerDTO.name,
            address: customerDTO.address,
            phone: customerDTO.phone,
            email: customerDTO.email,
            note: customerDTO.note
        };
        return true;
    }
    return false;
}

export function deleteCustomer(id) {
    let index = customerDB.findIndex(c => c.id === id);
    if (index !== -1) {
        customerDB.splice(index, 1);
        return true;
    }
    return false;
}

export function getAllCustomers() {
    return customerDB;
}

export function searchCustomer(value) {
    let searchValue = value.toLowerCase();
    return customerDB.find(customer => 
        customer.id.toLowerCase() === searchValue || 
        customer.name.toLowerCase().includes(searchValue)
    );
}