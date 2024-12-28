function getCookie(key: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Ensure it's client-side
  }

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));

  return cookie ? cookie.split('=')[1] : null;
}

export { getCookie };