$(document).ready(function () {
    const themeToggle = $('#theme-toggle');
    const themeIcon = $('#theme-icon');

    $('body').removeClass('dark-mode');

    themeToggle.on('click', function () {
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            themeIcon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            themeIcon.removeClass('fa-sun').addClass('fa-moon');
        }
    });
});

//========================= Current Date & Time ==================

function updateDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const time = now.toLocaleTimeString();

    document.getElementById('currentDateTime').innerHTML = `
        <div class="date">${date}</div>
        <div class="time">${time}</div>
    `;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// =========================== Menu Icon ==============================

$(document).ready(function() {

    $('#mobile-menu').click(function() {
        $('#nav-list').toggleClass('active');
    });

    $('#nav-list a').click(function() {
        $('#nav-list').removeClass('active');
    });
});
