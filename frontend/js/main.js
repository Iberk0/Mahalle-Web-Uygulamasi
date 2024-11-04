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



// Navbar ve footer'ı yükleyen fonksiyon
function loadComponent(selector, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(error => console.log('Bileşen yüklenirken hata oluştu:', error));
}

// Sayfa yüklendiğinde navbar ve footer'ı çağır
window.onload = () => {
  loadComponent('#navbar', 'NAVBAR.html');
  loadComponent('#footer', 'FOOTER.html');
};


function loadComponent(selector, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
        if (selector === '#navbar') {
          highlightActiveLink();
        }
      })
      .catch(error => console.log('Bileşen yüklenirken hata oluştu:', error));
  }
  
  // Aktif bağlantıyı vurgulayan fonksiyon
  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navbar a');
  
    navLinks.forEach(link => {
      // Bağlantının href değeriyle geçerli sayfanın yolunu karşılaştır
      if (link.getAttribute('href') === currentPath.split('/').pop()) {
        link.classList.add('active');
      }
    });
  }
  
 

  // Sayfa yüklendiğinde navbar ve footer'ı çağır
// Bileşenleri yüklemek ve kullanıcı durumunu ayarlamak için tek bir fonksiyon
window.onload = async () => {
    // Bileşen yükleme fonksiyonu
    const loadComponent = async (selector, file) => {
        const element = document.querySelector(selector);
        const response = await fetch(file);
        const html = await response.text();
        element.innerHTML = html;
    };

    // Navbar ve Footer bileşenlerini yükleme
    await loadComponent('#navbar', 'NAVBAR.html');
    await loadComponent('#footer', 'FOOTER.html');

    // Kullanıcı bilgilerini localStorage'dan al ve butonları ayarla
    const user = JSON.parse(localStorage.getItem('user'));
    const profileBtn = document.getElementById('profile-btn');
    const loginBtn = document.getElementById('login-btn');
    const messagePage = document.getElementById('message-page');
    const commentPage = document.getElementById('comment-page');
    if (user) {
        profileBtn.style.display = 'block';
        messagePage.style.display = 'block';
        commentPage.style.display = 'block';
        loginBtn.style.display = 'none';
    } else {
        profileBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        messagePage.style.display = 'none';
        commentPage.style.display = 'none';
        
    }
};

