document.addEventListener("DOMContentLoaded", () => {
    const authLink = document.getElementById("authLink");
    const user = getCurrentUser();

    if (authLink) {
        if (user) {
            authLink.innerHTML = `
                <div class="dropdown-wrapper">
                    <button class="dropbtn">🐾 ${user.name} <i class="fa-solid fa-caret-down"></i></button>
                    <div class="dropdown-content">
                        <a href="account.html"><i class="fa-solid fa-user"></i> My Account</a>
                        <a href="dashboard.html"><i class="fa-solid fa-paw"></i> Volunteer Stats</a>
                        <hr>
                        <a href="#" onclick="logout()" style="color:var(--pink);"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            authLink.innerHTML = `
                <div class="dropdown-wrapper">
                    <button class="dropbtn">Account <i class="fa-solid fa-caret-down"></i></button>
                    <div class="dropdown-content">
                        <a href="account.html?mode=login">Login</a>
                        <a href="account.html?mode=signup">Sign Up</a>
                    </div>
                </div>
            `;
        }
    }

    initPetWidget();
    highlightCurrentPage();
});

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("hoomanUser")) || JSON.parse(localStorage.getItem("user"));
}

function logout() {
    localStorage.removeItem("hoomanUser");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

function highlightCurrentPage() {
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0];
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href')?.split('?')[0];
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

function initPetWidget() {
    if (document.querySelector('.pet-widget')) return;

    const widget = document.createElement('div');
    widget.className = 'pet-widget sitting';
    widget.dataset.state = 'sitting';
    widget.innerHTML = `
      <div class="pet-card">
        <div class="pet-body">
          <div class="pet-spot spot-left"></div>
          <div class="pet-head">
            <div class="pet-ear ear-left"></div>
            <div class="pet-ear ear-right"></div>
            <div class="pet-face">
              <div class="pet-eye eye-left"></div>
              <div class="pet-eye eye-right"></div>
              <div class="pet-brow brow-left"></div>
              <div class="pet-brow brow-right"></div>
              <div class="pet-muzzle">
                <div class="pet-nose"></div>
                <div class="pet-mouth"></div>
              </div>
            </div>
          </div>
          <div class="pet-paws">
            <div class="pet-paw paw-left"></div>
            <div class="pet-paw paw-right"></div>
          </div>
        </div>
        <div class="pet-bubble">Woof!</div>
      </div>
    `;
    document.body.appendChild(widget);

    let scrollTimeout;
    let lastScrollY = window.pageYOffset;
    const eyes = widget.querySelectorAll('.pet-eye');
    const bubble = widget.querySelector('.pet-bubble');

    const pointAtCursor = (event) => {
        const pointer = event.touches && event.touches[0] ? event.touches[0] : event;
        const rect = widget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.clientX - cx;
        const dy = pointer.clientY - cy;
        const eyeX = Math.max(-1.2, Math.min(1.2, dx / 30));
        const eyeY = Math.max(-0.8, Math.min(0.8, dy / 40));
        eyes.forEach((eye) => {
            eye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        });
    };

    document.addEventListener('mousemove', pointAtCursor);
    document.addEventListener('touchmove', pointAtCursor, { passive: true });

    widget.addEventListener('click', () => {
        widget.classList.add('waving');
        bubble.classList.add('visible');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            widget.classList.remove('waving');
            bubble.classList.remove('visible');
        }, 1400);
    });

    const setPetState = (state) => {
        if (widget.dataset.state === state) return;
        widget.dataset.state = state;
        widget.classList.toggle('walking', state === 'walking');
        widget.classList.toggle('sitting', state === 'sitting');
        localStorage.setItem('petState', state);
    };

    const storedState = localStorage.getItem('petState');
    if (storedState === 'walking') {
        setPetState('walking');
    }

    window.addEventListener('scroll', () => {
        const currentY = window.pageYOffset;
        if (Math.abs(currentY - lastScrollY) > 5) {
            setPetState('walking');
        }
        lastScrollY = currentY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            setPetState('sitting');
        }, 250);
    });
}
