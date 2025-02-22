import { reactive } from "vue";

const authStore = reactive({
  currentUser: null,

  async login(username, password) {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/auth/session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    const authToken = await response.text();
    localStorage.setItem("authToken", authToken);

    await this.getSession();
  },

  async logout() {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/auth/session",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    this.currentUser = null;
    localStorage.removeItem("authToken");
  },

  async getSession() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    const response = await fetch(import.meta.env.VITE_API_URL + "/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        return;
      }
      throw data;
    }

    this.currentUser = data;
  },
});

export default authStore;
