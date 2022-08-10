<script setup>
import { useLinkStore } from "src/stores/link-store.js";
import { useQuasar } from "quasar";
import { useNotify } from "src/composables/notifyHook";

const props = defineProps({
  item: {},
});
const linkStore = useLinkStore();
const $q = useQuasar();
const { errorNotify, successNotify } = useNotify();

const deleteLink = async (_id) => {
  $q.dialog({
    title: "Delete",
    message: `¿Desea eliminar este elemento?`,
    ok: {
      push: true,
    },
    cancel: {
      push: true,
      color: "negative",
    },
    persistent: true,
  }).onOk(async () => {
    console.log(_id);
    try {
      await linkStore.removeLink(_id);
      successNotify("Link eliminado");
    } catch (error) {
      console.log(error);
      errorNotify(error.error);
    }
  });
};

const updateLink = (item) => {
  $q.dialog({
    title: "Actualizar link",
    message: "Actualiza tu enlace",
    prompt: {
      model: item.original_link,
      isValid: (val) => /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(val), // << here is the magic
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data) => {
    console.log(data);
    try {
      const newLink = {
        ...item,
        original_link: data,
      };
      await linkStore.modifyLink(newLink);
      successNotify("Link editado");
    } catch (error) {
      if (error.error) {
        errorNotify(error.error);
      } else if (error.errors) {
        error.errors.forEach((item) => errorNotify(item.msg));
      } else {
        errorNotify();
      }
    }
  });
};

const copyLink = async (nano_link) => {
  try {
    const path = `${window.location.href}${nano_link}`;
    console.log(path);
    await navigator.clipboard.writeText(path);
    successNotify("Link Copiado");
  } catch (error) {
    console.log(error);
    errorNotify(error);
  }
};
</script>
<template>
  <q-card class="my-card q-my-md">
    <q-card-section class="bg-pink-1 text-grey-9">
      <div class="text-h6">{{ item.nano_link }}</div>
      <div class="text-subtitle2">{{ item.original_link }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        flat
        round
        icon="mdi-delete"
        color="negative"
        @click="deleteLink(item._id)"
      />
      <q-btn
        flat
        round
        icon="mdi-pencil"
        color="primary"
        @click="updateLink(item)"
      />
      <q-btn
        flat
        round
        icon="mdi-content-copy"
        color="accent"
        @click="copyLink(item.nano_link)"
      />
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped></style>
