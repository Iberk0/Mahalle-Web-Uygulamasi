(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();
    

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top shadow-sm').css('top', '0px');
        } else {
            $('.nav-bar').removeClass('sticky-top shadow-sm').css('top', '-100px');
        }
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 500,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });



    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-arrow-right"></i>',
            '<i class="fa fa-arrow-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


})(jQuery);



async function loadMessages() {
    try {
        const response = await fetch('http://localhost:3005/api/messages');
        const messages = await response.json();
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';

        messages.sort((a, b) => new Date(b.messagetime) - new Date(a.messagetime));

        const user = JSON.parse(localStorage.getItem('user'));

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'd-flex justify-content-between mb-3';

            const messageContent = document.createElement('div');
            messageContent.innerHTML = `
                <strong style="color: ${message.username === 'manager' ? '#FF1414' : 'black'};">
                    ${message.username || 'Anonymous'}
                </strong> -> ${message.message}
                <br><small>${new Date(message.messagetime).toLocaleString()}</small>
            `;

            // Eğer kullanıcı manager ise silme butonu ekle
            if (user && user.role === "manager") {
                const removeButton = document.createElement('button');
                removeButton.className = 'btn';
                removeButton.style.cssText = `
                    height: 30px; 
                    width: 30px; 
                    border: none; 
                    background-color: white; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: red;
                `;
                removeButton.textContent = 'X';

                removeButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3005/api/messages/${message.messageID}`, {
                            method: 'DELETE'
                        });
                        const result = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert('Mesaj silindi');
                            loadMessages();
                        } else {
                            alert(result.error || 'Mesaj silinemedi');
                        }
                    } catch (error) {
                        console.error('Mesaj silinirken hata oluştu:', error);
                        alert('Mesaj silinemedi');
                    }
                });

                messageElement.appendChild(removeButton);
            }

            messageElement.prepend(messageContent);
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Mesajları yüklerken hata oluştu:', error);
    }
}

async function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
}

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navbar a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Navbar ve Footer yükle
    await loadComponent('#navbar', 'NAVBAR.html');
    await loadComponent('#footer', 'FOOTER.html');
    highlightActiveLink();

    // Kullanıcı durumunu ayarla
    const user = JSON.parse(localStorage.getItem('user'));
    const profileBtn = document.getElementById('profile-btn');
    const loginBtn = document.getElementById('login-btn');
    const techPage = document.getElementById('tech-page');
    const homePage = document.getElementById('home-page');
    const servicePage = document.getElementById('services-page');
    const messagePage = document.getElementById('message-page');
    const aboutPage = document.getElementById('about-page');
    const commentPage = document.getElementById('comment-page');
    const eventPage = document.getElementById('event-page');
    const complainPage = document.getElementById('complain-page');

    if (user) {
        if (profileBtn) profileBtn.style.display = 'block';
        if (messagePage) messagePage.style.display = 'block';
        if (commentPage) commentPage.style.display = 'block';
        if (user.role === 'resident' && complainPage) complainPage.style.display = 'block';
        if (techPage) techPage.style.display = 'block';
        if (eventPage) eventPage.style.display = 'block';
        if (aboutPage) aboutPage.style.display = 'none';
        if (homePage) homePage.style.display = 'none';
        if (servicePage) servicePage.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        if (profileBtn) profileBtn.style.display = 'none';
        if (messagePage) messagePage.style.display = 'none';
        if (commentPage) commentPage.style.display = 'none';
        if (techPage) techPage.style.display = 'none';
        if (complainPage) complainPage.style.display = 'none';
        if (eventPage) eventPage.style.display = 'none';
        if (aboutPage) aboutPage.style.display = 'block';
        if (homePage) homePage.style.display = 'block';
        if (servicePage) servicePage.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'block';
    }

    // Mesajları yükle
    loadMessages();
    setInterval(loadMessages, 5000);
});
