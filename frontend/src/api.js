export default async function api(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  let res = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : ""
    }
  });

  // Access token expired
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    // No refresh token → force logout
    if (!refreshToken) {
      localStorage.clear();
      throw new Error("No refresh token");
    }

    // Try refreshing
    const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken })
    });

    // Refresh failed → logout
    if (!refreshRes.ok) {
      localStorage.clear();
      throw new Error("Refresh token expired");
    }

    const data = await refreshRes.json();

    // Store new access token
    localStorage.setItem("accessToken", data.accessToken);

    // Retry original request ONCE
    res = await fetch(`http://localhost:3000${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${data.accessToken}`
      }
    });
  }

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}
