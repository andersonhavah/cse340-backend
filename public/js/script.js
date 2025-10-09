/* *******************************
* Toggle Password Visibility Script
* This script toggles the visibility of the password input field
* ******************************** */

// Get the necessary elements from the DOM
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('account_password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

// Add a click event listener to the toggle button
togglePassword.addEventListener('click', function () {
    // Toggle the type attribute of the password input field
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the visibility of the eye icons by adding/removing the 'hidden' class
    eyeOpen.classList.toggle('hidden');
    eyeClosed.classList.toggle('hidden');
});