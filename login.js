document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const feedbackDiv = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  // Dummy credentials
  const DUMMY_USER = 'admin';
  const DUMMY_PASS = 'password';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Memproses...';
    submitSpinner.classList.remove('hidden');
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'text-sm';

    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate credentials
    if (username === DUMMY_USER && password === DUMMY_PASS) {
      feedbackDiv.textContent = 'Login berhasil! Mengalihkan...';
      feedbackDiv.classList.add('text-green-600');
      
      // Redirect to admin page after a short delay
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1000);
    } else {
      feedbackDiv.textContent = 'Username atau password salah.';
      feedbackDiv.classList.add('text-red-600');
    }

    // Reset button state
    submitBtn.disabled = false;
    submitText.textContent = 'Login';
    submitSpinner.classList.add('hidden');
  });
});