$(document).ready(function () {

    $('.navbar').hide();
    $('#main-content').hide();
});

// ==================== Handle Login button click =======================

$('#loginForm').submit(function (e) {
    e.preventDefault();

    let username = $('#username').val();
    let password = $('#password').val();

    if (username === "admin" && password === "1234") {
        $('.login').hide();
        $('.navbar').css('display', 'flex');
        $('#main-content').show();
        
        showSection('dashboard-section');
    } else {
        alert("Incorrect username or password!");
    }
});

// ==================== Handle Logout button click =======================
function logout() {
    $('.login').css('display', 'flex');
    $('.navbar').hide();
    $('#main-content').hide();
    
    $('#loginForm')[0].reset();
}

// ================ Handle section move ======================
function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();

    if (sectionId === 'customer-section') {
        loadAllCustomers();
    }

    if (sectionId === 'item-section') {
        loadAllItems();
    }
}