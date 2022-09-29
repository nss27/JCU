<template>
  <ion-page>
    <ion-content>
      <ion-card v-for="(data, index) in menuList" :key="index" :router-link="data.url">
        <img v-if="data.img" :src="data.img" class="bg-img">

        <div class="flex-box">
          <ion-icon v-if="data.icon" :icon="data.icon" class="menu-icon"></ion-icon>
          <div class="menu-name">{{data.name}}</div>
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
  IonIcon
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  search,
  mapOutline,
  colorWandOutline,
  libraryOutline,
  ribbonOutline
} from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonIcon
  },
  setup() {
    const menuList = [
      {
        url: '/playerInfo',
        name: '플레이어 검색',
        icon: search,
        img: 'assets/images/illustration/illustration-01.png',
      },
      {
        url: '/totalRanking',
        name: '통합랭킹',
        icon: ribbonOutline,
        img: 'assets/images/illustration/illustration-02.png',
      },
      {
        url: '/characterRanKing',
        name: '캐릭터 랭킹',
        icon: ribbonOutline,
        img: 'assets/images/illustration/illustration-03.png',
      },
      {
        url: '/charactorLookalike',
        name: '캐릭터 닮은꼴',
        icon: colorWandOutline,
        img: null,
      },
      {
        url: '/restaurantList',
        name: '맛집리스트',
        icon: mapOutline,
        img: null,
      },
      {
        url: '/openSourceLicenseList',
        name: '오픈소스',
        icon: libraryOutline,
        img: null,
      },
      {
        url: '/openApiList',
        name: '오픈 API',
        icon: libraryOutline,
        img: null,
      },
    ];

    return {
      menuList,
    }
  },
});
</script>

<style scoped>
.bg-img {
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
  height: 100%;
}

.flex-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: var(--ion-color-dark);
  height: 100px;
}

.menu-icon {
  font-size: 34px;
}

.menu-name {
  font-size: 26px;
  background-color: var(--background);
}
</style>
