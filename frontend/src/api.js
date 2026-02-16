export default async function api(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  let res = await fetch(`http://localhost:5000${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`
    }
  });

  // Access token expired → refresh
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken })
    });

    const data = await refreshRes.json();

    localStorage.setItem("accessToken", data.accessToken);

    // retry original request
    res = await fetch(`http://localhost:5000${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${data.accessToken}`
      }
    });
  }

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
}
