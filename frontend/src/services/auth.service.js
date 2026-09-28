const BASE_URL = import.meta.env.BACKEND_BASE_URL;

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};

export const getProfile = async () => {
  const response = await fetch(`${BASE_URL}/user/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};