function getCurrentUser() {
  return JSON.parse(localStorage.getItem("hoomanUser")) || JSON.parse(localStorage.getItem("user"));
}

function saveCurrentUser(user) {
  localStorage.setItem("hoomanUser", JSON.stringify(user));
  localStorage.removeItem("user");
}

function showPayment(method) {
  ['card', 'upi', 'netbanking'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const selected = document.getElementById(method);
  if (selected) selected.style.display = 'block';
}

function closeContactPopup() {
  const popup = document.getElementById('contactPopup');
  if (popup) popup.style.display = 'none';
}

function togglePassword(inputId = 'password', button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (button) button.textContent = 'Hide';
  } else {
    input.type = 'password';
    if (button) button.textContent = 'Show';
  }
}

function toggleAuth(type) {
  const isSignup = type === 'signup';
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const formTitle = document.getElementById('formTitle');
  if (!loginForm || !signupForm || !formTitle) return;
  loginForm.style.display = isSignup ? 'none' : 'block';
  signupForm.style.display = isSignup ? 'block' : 'none';
  formTitle.innerText = isSignup ? 'Join Little Hooman' : 'Welcome Back';
}

function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const user = getCurrentUser();
  if (!email || !password) {
    alert('Please fill in both email and password.');
    return;
  }
  if (!user) {
    alert('No account found. Please sign up first.');
    return;
  }
  if (user.email !== email || user.password !== password) {
    alert('Invalid email or password.');
    return;
  }
  showAccountDetails(user);
}

function signupUser() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  if (!name || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }
  const user = { name, email, password };
  saveCurrentUser(user);
  alert('Signup successful! You are now logged in.');
  showAccountDetails(user);
}

function showAccountDetails(user) {
  const authForms = document.getElementById('authForms');
  const userInfo = document.getElementById('userInfo');
  if (!authForms || !userInfo) return;
  authForms.style.display = 'none';
  userInfo.style.display = 'block';
  userInfo.innerHTML = `
        <div style="background:white; padding:40px; border-radius:15px; max-width:500px; margin:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 50px;">👤</div>
            <h3>Account Details</h3>
            <p><b>Name:</b> ${user.name}</p>
            <p><b>Email:</b> ${user.email}</p>
            <button onclick="logout()" class="btn" style="width:100%; margin-top:20px; background:var(--pink);">Logout</button>
        </div>
    `;
}

function toggleForm() {
  const authForm = document.getElementById('authForm');
  const nameField = document.getElementById('name');
  const title = document.getElementById('form-title');
  const submitBtn = document.getElementById('submitBtn');
  if (!authForm || !nameField || !title || !submitBtn) return;
  const isRegister = nameField.style.display !== 'block';
  nameField.style.display = isRegister ? 'block' : 'none';
  title.innerText = isRegister ? 'Register' : 'Sign In';
  submitBtn.innerText = isRegister ? 'Create Account' : 'Login';
}

async function initContactPage() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('successMessage');
    const backButton = document.getElementById('backButton');
    if (message) message.style.display = 'block';
    if (backButton) backButton.style.display = 'inline-block';
    contactForm.style.display = 'none';
    const data = {
      name: document.getElementById('cname').value,
      email: document.getElementById('cemail').value,
      message: document.getElementById('cmessage').value
    };
    try {
      await fetch('http://127.0.0.1:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn(err);
    }
  });
}

async function initVolunteerPage() {
  const form = document.getElementById('volunteerForm');
  if (!form) return;
  const user = getCurrentUser();
  if (!user) {
    alert('Please login first');
    window.location.href = 'signup.html';
    return;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      userEmail: user.email,
      name: document.getElementById('vname').value,
      email: document.getElementById('vemail').value,
      phone: document.getElementById('vphone').value,
      message: document.getElementById('vmessage').value
    };
    try {
      await fetch('http://127.0.0.1:5000/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      document.getElementById('volunteerFormSection').style.display = 'none';
      document.getElementById('volunteerDashboard').style.display = 'block';
      loadVolunteerHistory(user);
    } catch (error) {
      alert('Error submitting form');
    }
  });
}

async function loadVolunteerHistory(user) {
  if (!user) return;
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  try {
    const res = await fetch(`http://127.0.0.1:5000/my-volunteer/${user.email}`);
    const data = await res.json();
    historyList.innerHTML = '';
    if (!data.length) {
      historyList.innerHTML = '<p>No activity yet</p>';
      return;
    }
    data.forEach(v => {
      historyList.innerHTML += `
        <div style="margin-bottom:10px;">
          <p><b>${v.name}</b></p>
          <p>${v.message}</p>
          <small>${new Date(v.date).toLocaleString()}</small>
          <hr>
        </div>
      `;
    });
  } catch (err) {
    console.warn(err);
  }
}

async function initDashboardPage() {
  const user = getCurrentUser();
  if (!user) {
    alert('Please login first');
    window.location.href = 'signup.html';
    return;
  }
  const container = document.getElementById('records');
  if (!container) return;
  try {
    const res = await fetch(`http://127.0.0.1:5000/my-volunteer/${user.email}`);
    const data = await res.json();
    if (!data.length) {
      container.innerHTML = '<p>No volunteer activity yet</p>';
      return;
    }
    container.innerHTML = data.map(v => `
      <div style="background:white; padding:20px; margin:10px; border-radius:10px;">
        <p><b>Name:</b> ${v.name}</p>
        <p><b>Phone:</b> ${v.phone}</p>
        <p>${v.message}</p>
        <p><small>${new Date(v.date).toLocaleString()}</small></p>
      </div>
    `).join('');
  } catch (err) {
    console.warn(err);
  }
}

function initAccountPage() {
  const user = getCurrentUser();
  const authForms = document.getElementById('authForms');
  const userInfo = document.getElementById('userInfo');
  if (!authForms || !userInfo) return;
  if (user) {
    showAccountDetails(user);
    return;
  }
  authForms.style.display = 'block';
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'signup') toggleAuth('signup');
}

function initAuthFormPage() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('authForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameField = document.getElementById('name');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isRegister = nameField.style.display === 'block';
    const data = {
      name: nameField.value,
      email,
      password
    };
    const url = isRegister ? 'http://127.0.0.1:5000/signup' : 'http://127.0.0.1:5000/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.text();
      alert(result);
      if (result.toLowerCase().includes('success')) {
        if (isRegister) {
          toggleForm();
        } else {
          saveCurrentUser({ name: nameField.value || 'User', email });
          window.location.href = 'index.html';
        }
      }
    } catch (error) {
      alert('Error connecting to server');
      console.warn(error);
    }
  });
}

function initAdoptionPage() {
  const pet = localStorage.getItem('selectedPet');
  if (pet) {
    const title = document.getElementById('selectedPetTitle');
    if (title) title.innerText = 'Adoption Application for ' + pet + ' 🐾';
  }
  if (pet && localStorage.getItem('adopted_' + pet)) {
    const formSection = document.getElementById('formSection');
    const successMsg = document.getElementById('successMsg');
    if (formSection) formSection.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  }
}

function initHomepageSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  let slideIndex = 0;

  const showSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove('active'));
    slides[index].classList.add('active');
  };

  showSlide(slideIndex);
  window.setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 4000);
}

async function submitAdoption() {
  const pet = localStorage.getItem('selectedPet');
  const user = getCurrentUser();
  if (!user) {
    alert('Please login first');
    window.location.href = 'signup.html';
    return;
  }
  const data = {
    userEmail: user.email,
    petName: pet,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };
  try {
    await fetch('http://127.0.0.1:5000/adopt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (pet) localStorage.setItem('adopted_' + pet, 'true');
    const formSection = document.getElementById('formSection');
    const successPopup = document.getElementById('successPopup');
    if (formSection) formSection.style.display = 'none';
    if (successPopup) successPopup.style.display = 'flex';
  } catch (err) {
    alert('Error submitting form');
    console.warn(err);
  }
}

function closePopup() {
  const popup = document.getElementById('successPopup');
  if (popup) popup.style.display = 'none';
  window.location.href = 'index.html';
}

function goHome() {
  const popup = document.getElementById('successPopup');
  const successMsg = document.getElementById('successMsg');
  if (popup) popup.style.display = 'none';
  if (successMsg) successMsg.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  initContactPage();
  if (document.getElementById('volunteerForm')) initVolunteerPage();
  if (document.getElementById('records')) initDashboardPage();
  if (document.getElementById('authForms')) initAccountPage();
  if (document.getElementById('authForm')) initAuthFormPage();
  initAdoptionPage();
  initHomepageSlider();
});
