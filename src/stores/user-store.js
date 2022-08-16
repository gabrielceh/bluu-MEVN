import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useLinkStore } from "./link-store";

export const useUserStore = defineStore("userStore", () => {
  const linksStore = useLinkStore();

  const token = ref(null);
  const expiresIn = ref(null);

  const access = async (email, password) => {
    try {
      const res = await api.post(`/auth/login`, {
        email,
        password,
      });
      // console.log(res);
      // console.log(res.data);
      token.value = res.data.token;
      expiresIn.value = res.data.expiresIn;
      localStorage.setItem("user", "UEFZQVNPIPCfpKE=");
      setTime();
    } catch (error) {
      // Manejo de errores con axios
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        // console.log(error.response.data);
        throw error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    }
  };

  const registerUser = async (email, password, repassword) => {
    try {
      const res = await api.post(`/auth/register`, {
        email,
        password,
        repassword,
      });
      token.value = res.data.token;
      expiresIn.value = res.data.expiresIn;
      localStorage.setItem("user", "UEFZQVNPIPCfpKE=");
      setTime();
    } catch (error) {
      // Manejo de errores con axios
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        // console.log(error.response.data);
        throw error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    }
  };

  const logout = async () => {
    try {
      await api.get(`/auth/logout`);
      linksStore.resetLinkStore();
    } catch (error) {
      console.log(error);
    } finally {
      resetStore();
    }
  };

  const refreshToken = async () => {
    // console.log("refresh");
    try {
      const res = await api.get(`/auth/refresh`);
      // console.log(res.data);
      token.value = res.data.token;
      expiresIn.value = res.data.expiresIn;
      localStorage.setItem("user", "UEFZQVNPIPCfpKE=");
      setTime();
    } catch (error) {
      console.log(error);
      localStorage.removeItem("user");
    }
  };

  const setTime = () => {
    setTimeout(() => {
      console.log("se refrescó");
      refreshToken();
    }, expiresIn.value * 1000 - 10000);
  };

  const resetStore = () => {
    token.value = null;
    expiresIn.value = null;
    localStorage.removeItem("user");
  };

  return {
    token,
    expiresIn,
    access,
    refreshToken,
    logout,
    registerUser,
  };
});
