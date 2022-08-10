<template>
  <q-page padding>
    <AddLinks class="q-mb-xl" />
    <template v-for="link in linkStore.links" :key="link._id">
      <LinkCards :item="link" />
    </template>
  </q-page>
</template>

<script setup>
import { useLinkStore } from "src/stores/link-store";
// Components
import AddLinks from "src/components/AddLinks.vue";
import LinkCards from "src/components/LinkCards.vue";

const linkStore = useLinkStore();
</script>
