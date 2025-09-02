// auth.js - Funciones de autenticación y usuario
export async function checkAuthentication() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      const data = await response.json();
      updateUserUI(data.user);
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    window.location.href = '/login';
  }
}

export function updateUserUI(user) {
  const userEmail = document.getElementById('userEmail');
  const userAvatar = document.getElementById('userAvatar');
  if (userEmail) userEmail.textContent = user.username;
  if (userAvatar) userAvatar.textContent = user.username.charAt(0).toUpperCase();
}

export async function logout() {
  try {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error durante logout:', error);
  }
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
