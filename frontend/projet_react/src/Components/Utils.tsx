// Memorisé le token p
export async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) throw new Error("Token manquant, veuillez vous reconnecter.");
  
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.status === 401) {
      throw new Error("Token expiré, veuillez vous reconnecter.");
    }
  
    return res;
  }
  