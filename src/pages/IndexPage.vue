<template>
  <q-page padding>
    <q-btn @click="access">Ingresar</q-btn>
    <q-btn @click="createLink">Crear Link</q-btn>
    {{ token }}
    {{ expiresIn }}
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";

const token = ref("");
const expiresIn = ref("");

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
    setTime();
  } catch (error) {
    console.log(error);
  }
};

const createLink = async () => {
  try {
    const res = await api({
      method: "POST",
      url: `/links`,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      data: {
        original_link: "https://www.youtube.com/watch?v=53VBlv7K-BI&t",
      },
    });

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

//se ejecutara cada que se refresque la pag, haciendo que haga la solicitud del token a la cookie y lo envie al backend
const refreshToken = async () => {
  try {
    const res = await api.get(`/auth/refresh`);
    // console.log(res.data);
    token.value = res.data.token;
    expiresIn.value = res.data.expiresIn;
    setTime();
  } catch (error) {
    console.log(error);
  }
};

const setTime = () => {
  setTimeout(() => {
    console.log("se refrescó");
    refreshToken();
  }, expiresIn.value * 1000 - 10000);
};

refreshToken();
</script>
