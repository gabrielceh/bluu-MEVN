import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";

export const useUserStore = defineStore("userStore", () => {
  const token = ref(null);
  const expiresIn = ref(null);

  const access = async () => {
    try {
      const res = await api.post(`/auth/login`, {
        email: "gabito@mail.com",
        password: "123123",
      });
      // console.log(res);
      // console.log(res.data);
      token.value = res.data.token;
      expiresIn.value = res.data.expiresIn;
      localStorage.setItem("user", "UEFZQVNPIPCfpKE=");
      setTime();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await api.get(`/auth/logout`);
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    } finally {
      resetStore();
    }
  };

  const refreshToken = async () => {
    console.log("refresh");
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
  };

  return {
    token,
    expiresIn,
    access,
    refreshToken,
    logout,
  };
});
