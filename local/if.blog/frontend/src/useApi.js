import { ref, onMounted, onUnmounted } from "vue";

export default function useApi() {
  const authToken = ref(null);
  const apiUrl = ref(null);
  const waitingForAuthToken = ref(false);

  const requestAuthToken = () => {
    window.top.postMessage(JSON.stringify({ type: "get_auth_token" }), "*");
    waitingForAuthToken.value = true;
  };

  const waitForAuthToken = async () => {
    if (!authToken.value && waitingForAuthToken.value) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await waitForAuthToken();
    }
  };

  const authFetch = async (url, options) => {
    if (!authToken.value) {
      requestAuthToken();
      await waitForAuthToken();
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    if (response.status === 401) {
      requestAuthToken();
      await waitForAuthToken();
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${authToken.value}`,
        },
      });
    }

    return response;
  };

  const messageHandler = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "auth_token") {
        console.log("Received auth token", data.value);
        authToken.value = data.value;
        waitingForAuthToken.value = false;
      }
      if (data.type === "api_url") {
        console.log("Received API URL", data.value);
        apiUrl.value = data.value;
      }
    } catch (error) {
      console.error("Error parsing message", error);
    }
  };

  onMounted(() => {
    window.addEventListener("message", messageHandler);
    window.top.postMessage(JSON.stringify({ type: "get_api_url" }), "*");
  });

  onUnmounted(() => {
    window.removeEventListener("message", messageHandler);
  });

  return {
    authToken,
    apiUrl,
    authFetch,
  };
}
