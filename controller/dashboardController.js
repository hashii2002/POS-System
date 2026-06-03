import { customerDB , itemDB, orderDB} from "../db/DB.js";

export function updateDashboardCounts() {

    // Customer Card
    let totalCustomers = customerDB.length;
    $('#total-customers-count').text(totalCustomers);

    // Item Card
    let totalItems = itemDB.length;
    $('#total-items-count').text(totalItems);

    // Total Revenue Card
    let totalRevenue = 0;
    
    orderDB.forEach(order => {
        totalRevenue += order.total;
    });
    $('#total-revenue-count').text(`Rs. ${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
}

$(document).ready(function() {
    updateDashboardCounts();
});