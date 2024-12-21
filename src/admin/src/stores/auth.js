import { reactive } from "vue";

const authStore = reactive({
  currentUser: null,

  async login(email, password) {
    // TODO: Send request to backend when it is ready.

    // Simulate login
    this.currentUser = {
      email,
    };
    localStorage.setItem("refreshToken", "dummyRefreshToken");
  },

  async logout() {
    // TODO: Send request to backend when it is ready.

    // Simulate logout
    this.currentUser = null;
    localStorage.removeItem("refreshToken");
  },

  async changePassword(oldPassword, newPassword) {
    // TODO: Send request to backend when it is ready.

    // Simulate logout after password change
    this.currentUser = null;
    localStorage.removeItem("refreshToken");
  },

  async changeEmail(newEmail) {
    // TODO: Send request to backend when it is ready.

    // Simulate email change
    this.currentUser.email = newEmail;
  },

  async refreshSession() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    // TODO: Send request to backend when it is ready.

    // Simulate session refresh
    this.currentUser = {
      email: "ahojky@ahojky.cz",
    };
  },
});

export default authStore;
