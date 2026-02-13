document.addEventListener('DOMContentLoaded', () => {
    
    // Handle Contact Preference Toggle
    const contactRadios = document.querySelectorAll('input[name="contact_pref"]');
    const emailWarning = document.getElementById('email-warning');

    contactRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'email') {
                emailWarning.classList.remove('hidden');
            } else {
                emailWarning.classList.add('hidden');
            }
        });
    });

    // Simple Form Validation / Submission Mock
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real scenario, we'd send data to a server here.
        // For now, we'll just show a success alert.
        const name = document.getElementById('name').value;
        alert(`Thanks ${name}! We've received your enquiry and will be in touch shortly.`);
        
        form.reset();
    });

});
