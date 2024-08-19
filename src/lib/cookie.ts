export const getCookieValue = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return "";
};
