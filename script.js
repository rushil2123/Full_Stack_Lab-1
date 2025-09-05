document.addEventListener('DOMContentLoaded', () => {
  // Insert the current year into the footer for copyright
  const year = new Date().getFullYear();
  const copyright = document.getElementById('copyright');
  copyright.textContent = `© Pixell River Financial ${year}. All rights reserved.`;

  // Retrieve employee data from the global variable set by employees.js
  const data = Array.isArray(window.PRF_EMPLOYEE_DATA) ? window.PRF_EMPLOYEE_DATA : [];

  // Get the mount point where the directory will be rendered
  const mount = document.getElementById('directory-mount');

  // Create a semantic <section> to contain all department lists
  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'directory-heading');

  // Add a visually hidden heading for accessibility (screen readers)
  const srOnlyH = document.createElement('h2');
  srOnlyH.id = 'directory-heading';
  srOnlyH.className = 'sr-only';
  srOnlyH.textContent = 'Departments and employees';
  section.appendChild(srOnlyH);
});