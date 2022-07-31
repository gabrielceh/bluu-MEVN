<template>
  <q-page padding>
    <!-- <q-btn @click="userStore.access">Ingresar</q-btn> -->
    <!-- <q-btn @click="userStore.logout">Cerrar Sesion</q-btn> -->
    <q-btn @click="createLink">Crear Link</q-btn>
    {{ userStore.token }}
    {{ userStore.expiresIn }}
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useUserStore } from "src/stores/user-store";

// const { token, expiresIn, access, refreshToken } = useUserStore();
const userStore = useUserStore();

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

// userStore.refreshToken();
</script>
