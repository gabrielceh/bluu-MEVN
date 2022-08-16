<script setup>
import { ref } from "vue";
import { useLinkStore } from "src/stores/link-store";

import { useNotify } from "src/composables/notifyHook";

const linkStore = useLinkStore();
const link = ref("");
const formAdd = ref(null);
const loading = ref(false);
const { showNotify } = useNotify();

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await linkStore.createLink(link.value);
    showNotify("🥳🥳", "Link agregado", "positive");
    link.value = "";
    formAdd.value.resetValidation();
  } catch (error) {
    if (error.error) {
      showNotify("ERROR", error.error, "negative");
    } else if (error.errors) {
      error.errors.forEach((item) =>
        showNotify("ERROR ", item.msg, "negative")
      );
    } else {
      showNotify();
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-form @submit.prevent="handleSubmit" ref="formAdd">
    <!-- <q-input
      v-model="link"
      label="Ingrese link"
      placeholder="ex: https://google.com"
    >
    </q-input> -->
    <q-input
      v-model="link"
      label="Ingrese link"
      placeholder="ex: https://google.com"
      :rules="[
        (val) => (val && val.trim() !== '') || 'Ingresa una URL',
        (val) =>
          /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(val) ||
          'Formaro de URL no valido',
      ]"
      lazy-rules
    >
    </q-input>

    <q-btn
      label="Agregar"
      color="primary"
      type="submit"
      class="q-mt-sm full-width"
      :loading="loading"
    ></q-btn>
  </q-form>
</template>
