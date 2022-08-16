<script setup>
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
//Activar en el quasar.config, en la parte de plugins
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const $q = useQuasar();
const router = useRouter();

const formLogin = ref(null);
const email = ref("");
const password = ref("");

const handleSubmit = async () => {
  try {
    const res = await userStore.access(email.value, password.value);
    console.log(res);
    router.push("/");
    email.value = "";
    password.value = "";
    formLogin.value.resetValidation();
  } catch (error) {
    console.log(error);
    if (error.error) {
      alertBackend(error.error);
    } else if (error.errors) {
      let msg = Object.values(error.errors)
        .map((item) => item.msg)
        .join(" - ");
      alertBackend(msg);
    } else {
      alertBackend();
    }
  }
};
const alertBackend = (message = "Error de servidor") => {
  $q.dialog({
    title: "❌ ERROR:",
    message: message,
    position: "top",
  });
};
</script>

<template>
  <q-page padding class="row justify-center" ref="formLogin">
    <div class="col-12 col-sm-6 col-md-5">
      <h3>Login</h3>
      <q-form @submit.prevent="handleSubmit" ref="form">
        <q-input
          v-model="email"
          label="Email"
          type="texto"
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor ingrese un correo',
            (val) =>
              /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) ||
              'Formato Email incorrecto',
          ]"
          lazy-ruñes
        ></q-input>

        <q-input
          v-model="password"
          label="Password"
          type="password"
          :rules="[(val) => (val && val.length > 5) || 'Minino 6 caracteres']"
          lazy-rules
        ></q-input>

        <div>
          <q-btn label="Login" type="submit"></q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>
