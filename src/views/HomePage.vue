<template>
  <ion-page>
    <ion-content>
      <ion-card v-for="(data, index) in menuList" :key="index" :router-link="data.url">
        <div class="flex-box">
          <div class="menu-name">{{data.name}}</div>
          <img v-if="data.img" :src="data.img" class="menu-img">
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
} from "@ionic/vue";
import { defineComponent } from "vue";
import menuList from '@/jsons/menuList.json';

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
  },
  setup() {
    return {
      menuList,
    }
  },
});
</script>

<style scoped>
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--ion-color-dark);
  height: 100px;
}

.menu-img {
  height: 100%;
}

.menu-name {
  font-size: 26px;
  padding: 0 20px;
}
</style>
