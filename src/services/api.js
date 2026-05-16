const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://smartcity-0e3f.onrender.com/api";

const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // DELETE често враќа празен response
    if (response.status === 204) {
      return null;
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  },
};

export const institutionApi = {
  getAll: () => api.get("/institutions"),
  getById: (id) => api.get(`/institutions/${id}`),
  create: (data) => api.post("/institutions", data),
  update: (id, data) => api.put(`/institutions/${id}`, data),
  delete: (id) => api.delete(`/institutions/${id}`),
};

export default api;
