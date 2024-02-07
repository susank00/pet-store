// Auth.js

const BASE_URL = "http://localhost:3001"; // Update this to match your backend URL

// Function to authenticate user and retrieve access token
export async function authenticateUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw error;
  }
}

// Function to fetch user profile using access token
export async function fetchUserProfile(accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    throw error;
  }
}
