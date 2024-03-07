// document.addEventListener('DOMContentLoaded', () => {
//     const signinForm = document.getElementById('signin-form');
//     const errorMessage = document.getElementById('error-message');
//     const logoutButton = document.getElementById('logout-button');
  
//     signinForm.addEventListener('submit', async (event) => {
//       event.preventDefault();
      
//       const email = signinForm.elements['email'].value;
//       const password = signinForm.elements['password'].value;
  
//       try {
//         const response = await fetch('https://api.webschool.pk', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ email, password })
//         });
  
//         if (!response.ok) {
//           throw new Error('Sign-in failed');
//         }
  
//         const { token, user } = await response.json();
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         errorMessage.textContent = '';
//         console.log('User authenticated:', user);
//         // Redirect to dashboard or home page
//       } catch (error) {
//         errorMessage.textContent = 'Invalid email or password';
//         console.error('Sign-in failed:', error);
//       }
//     });
  
//     logoutButton.addEventListener('click', () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       // Redirect to sign-in page or home page
//     });
//   });
  