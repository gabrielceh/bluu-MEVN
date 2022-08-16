import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useUserStore } from "./user-store.js";
import { useQuasar } from "quasar";

export const useLinkStore = defineStore("link", () => {
  const userStore = useUserStore();

  const links = ref([]);
  const $q = useQuasar();

  const createLink = async (original_link) => {
    try {
      $q.loading.show({
        message: "Estamos creando el link...",
      });
      const res = await api({
        url: "/links",
        method: "POST",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        data: {
          original_link,
        },
      });
      links.value.push(res.data.newLink);
      // console.log(res.data);
    } catch (error) {
      // if (error.response) {
      //   console.log(error.response);
      //   throw error.response.data;
      // } else if (error.request) {
      //   console.log(error.request);
      // } else {
      //   console.log(error.message);
      // }
      throw error.response?.data || error;
    } finally {
      $q.loading.hide();
    }
  };

  const getLinks = async () => {
    try {
      $q.loading.show({
        message: "Cargando informacion...",
      });
      // console.log("Llamando a los links 🐱‍🏍");
      const res = await api({
        url: "/links",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });
      // console.log(res.data);
      // links.value = [...res.data.links]
      links.value = res.data.links.map((item) => {
        return {
          original_link: item.original_link,
          nano_link: item.nano_link,
          _id: item._id,
          uid: item.uid,
        };
      });
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      $q.loading.hide();
    }
  };

  const removeLink = async (id) => {
    try {
      $q.loading.show({
        message: "Estamos borrando el link...",
      });
      await api({
        url: `/links/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      links.value = links.value.filter((item) => item._id !== id);
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      $q.loading.hide();
    }
  };

  const modifyLink = async (newlink) => {
    try {
      $q.loading.show({
        message: "Estamos actualizando el link",
      });
      // console.log(newlink);
      await api({
        url: `/links/${newlink._id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        data: {
          original_link: newlink.original_link,
        },
      });

      links.value = links.value.map((item) =>
        item._id === newlink._id ? newlink : item
      );
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      $q.loading.hide();
    }
  };

  getLinks();
  return {
    links,
    createLink,
    getLinks,
    removeLink,
    modifyLink,
  };
});
