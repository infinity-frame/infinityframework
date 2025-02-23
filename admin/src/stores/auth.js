import { reactive } from "vue";

const authStore = reactive({
  currentUser: null,
  config: null,

  async login(username, password) {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/auth/session",
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
    await this.getConfig();
  },

  async logout() {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/auth/session",
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
    localStorage.removeItem("config");
  },

  async getSession() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
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

  async getConfig() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    if (localStorage.getItem("config")) {
      this.config = JSON.parse(localStorage.getItem("config"));
      return;
    }

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/configuration",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw data;
    }

    this.config = data;
    localStorage.setItem("config", JSON.stringify(data));
  },
});

export default authStore;
