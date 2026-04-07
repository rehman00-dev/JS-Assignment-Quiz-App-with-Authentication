// Redirect if already logged in
if (localStorage.getItem('currentUser') && (document.getElementById('signup-form') || document.getElementById('login-form'))) {
    window.location.href = 'dashboard.html';
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email.toLowerCase() === email)) {
        Swal.fire('Error', 'Email already exists!', 'error');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    Swal.fire({
        title: 'Success!',
        text: 'Account created. Please login.',
        icon: 'success',
        confirmButtonText: 'Go to Login'
    }).then(() => {
        window.location.href = 'login.html';
    });
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        Toast.fire({
            icon: 'success',
            title: `Welcome back, ${user.name}!`
        }).then(() => {
            window.location.href = 'dashboard.html';
        });
    } else {
        Swal.fire({
            title: 'Access Denied',
            text: 'Invalid email or password.',
            icon: 'error'
        });
    }
});