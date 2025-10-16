// Contact Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Name validation
        if (name.length < 3) {
            showError('nameError', 'Name must be at least 3 characters long');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            showError('nameError', 'Name can only contain letters and spaces');
            isValid = false;
        } else {
            clearError('nameError');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('emailError');
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            showError('phoneError', 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('phoneError', 'Phone number must be 10 digits');
            isValid = false;
        } else {
            clearError('phoneError');
        }

        // Message validation
        if (message.length < 10) {
            showError('messageError', 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            clearError('messageError');
        }

        if (isValid) {
            showToast('Message sent successfully!');
            contactForm.reset();
        }
    });
}

// Login Form Validation
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        let isValid = true;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('loginEmailError', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('loginEmailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('loginEmailError');
        }

        // Password validation
        if (!password) {
            showError('loginPasswordError', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('loginPasswordError', 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError('loginPasswordError');
        }

        if (isValid) {
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showToast('Login successful!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError('loginPasswordError', 'Invalid email or password');
            }
        }
    });
}

// Signup Form Validation
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        let isValid = true;

        // Name validation
        if (name.length < 3) {
            showError('signupNameError', 'Name must be at least 3 characters long');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            showError('signupNameError', 'Name can only contain letters and spaces');
            isValid = false;
        } else {
            clearError('signupNameError');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('signupEmailError', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('signupEmailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            // Check for duplicate email
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const emailExists = users.some(u => u.email === email);
            
            if (emailExists) {
                showError('signupEmailError', 'Email already registered');
                isValid = false;
            } else {
                clearError('signupEmailError');
            }
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password) {
            showError('signupPasswordError', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('signupPasswordError', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            showError('signupPasswordError', 'Password must contain uppercase, lowercase, and number');
            isValid = false;
        } else {
            clearError('signupPasswordError');
        }

        // Confirm Password validation
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        } else {
            clearError('confirmPasswordError');
        }

        if (isValid) {
            // Save user to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({
                name: name,
                email: email,
                password: password
            });
            localStorage.setItem('users', JSON.stringify(users));

            showToast('Account created successfully!');
            setTimeout(() => {
                // Switch to login tab
                document.getElementById('loginTab').click();
                signupForm.reset();
            }, 1500);
        }
    });
}

// Real-time validation for inputs
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const fieldId = field.id;

    switch(fieldName) {
        case 'name':
            if (value.length < 3) {
                showError(fieldId + 'Error', 'Name must be at least 3 characters');
                field.classList.add('error');
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                showError(fieldId + 'Error', 'Name can only contain letters and spaces');
                field.classList.add('error');
            } else {
                clearError(fieldId + 'Error');
                field.classList.remove('error');
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showError(fieldId + 'Error', 'Email is required');
                field.classList.add('error');
            } else if (!emailRegex.test(value)) {
                showError(fieldId + 'Error', 'Please enter a valid email');
                field.classList.add('error');
            } else {
                clearError(fieldId + 'Error');
                field.classList.remove('error');
            }
            break;

        case 'phone':
            const phoneRegex = /^[0-9]{10}$/;
            if (!value) {
                showError(fieldId + 'Error', 'Phone number is required');
                field.classList.add('error');
            } else if (!phoneRegex.test(value)) {
                showError(fieldId + 'Error', 'Phone must be 10 digits');
                field.classList.add('error');
            } else {
                clearError(fieldId + 'Error');
                field.classList.remove('error');
            }
            break;

        case 'password':
            if (value.length < 8) {
                showError(fieldId + 'Error', 'Password must be at least 8 characters');
                field.classList.add('error');
            } else {
                clearError(fieldId + 'Error');
                field.classList.remove('error');
            }
            break;

        case 'message':
            if (value.length < 10) {
                showError(fieldId + 'Error', 'Message must be at least 10 characters');
                field.classList.add('error');
            } else {
                clearError(fieldId + 'Error');
                field.classList.remove('error');
            }
            break;
    }
}

// Helper functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#d32f2f';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            let isValid = true;

            // Name validation
            if (name.length < 3) {
                showError('nameError', 'Name must be at least 3 characters long');
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError('nameError', 'Name can only contain letters and spaces');
                isValid = false;
            } else {
                clearError('nameError');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('emailError', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('emailError');
            }

            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phone) {
                showError('phoneError', 'Phone number is required');
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                showError('phoneError', 'Phone number must be 10 digits');
                isValid = false;
            } else {
                clearError('phoneError');
            }

            // Message validation
            if (message.length < 10) {
                showError('messageError', 'Message must be at least 10 characters long');
                isValid = false;
            } else {
                clearError('messageError');
            }

            if (isValid) {
                showToast('Message sent successfully!');
                contactForm.reset();
            }
        });
    }

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            let isValid = true;

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('loginEmailError', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('loginEmailError', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('loginEmailError');
            }

            // Password validation
            if (!password) {
                showError('loginPasswordError', 'Password is required');
                isValid = false;
            } else if (password.length < 8) {
                showError('loginPasswordError', 'Password must be at least 8 characters');
                isValid = false;
            } else {
                clearError('loginPasswordError');
            }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    showToast('Login successful!');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showError('loginPasswordError', 'Invalid email or password');
                }
            }
        });
    }

    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            let isValid = true;

            // Name validation
            if (name.length < 3) {
                showError('signupNameError', 'Name must be at least 3 characters long');
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError('signupNameError', 'Name can only contain letters and spaces');
                isValid = false;
            } else {
                clearError('signupNameError');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('signupEmailError', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('signupEmailError', 'Please enter a valid email address');
                isValid = false;
            } else {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const emailExists = users.some(u => u.email === email);
                
                if (emailExists) {
                    showError('signupEmailError', 'Email already registered');
                    isValid = false;
                } else {
                    clearError('signupEmailError');
                }
            }

            // Password validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!password) {
                showError('signupPasswordError', 'Password is required');
                isValid = false;
            } else if (password.length < 8) {
                showError('signupPasswordError', 'Password must be at least 8 characters');
                isValid = false;
            } else if (!passwordRegex.test(password)) {
                showError('signupPasswordError', 'Password must contain uppercase, lowercase, and number');
                isValid = false;
            } else {
                clearError('signupPasswordError');
            }

            // Confirm Password validation
            if (!confirmPassword) {
                showError('confirmPasswordError', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                isValid = false;
            } else {
                clearError('confirmPasswordError');
            }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                users.push({
                    name: name,
                    email: email,
                    password: password
                });
                localStorage.setItem('users', JSON.stringify(users));

                showToast('Account created successfully!');
                setTimeout(() => {
                    document.getElementById('loginTab').click();
                    signupForm.reset();
                }, 1500);
            }
        });
    }
});
