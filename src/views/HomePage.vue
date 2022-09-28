<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>전사연</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card v-for="(data, index) in menu" :key="index" :router-link="data.url">
        <ion-card-content>
          <ion-text color="dark">{{data.name}}</ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonText
  },
  setup() {
    const menu = [
      {
        url: '/playerInfo',
        name: '플레이어 검색'
      },
      {
        url: '/totalRanking',
        name: '통합랭킹'
      },
      {
        url: '/characterRanKing',
        name: '캐릭터 랭킹'
      },
      {
        url: '/charactorLookalike',
        name: '사이퍼즈 캐릭터상 테스트'
      },
      {
        url: '/restaurantList',
        name: '맛집리스트'
      },
      {
        url: '/openSourceLicenseList',
        name: '오픈소스'
      },
      {
        url: '/openApiList',
        name: '오픈 API'
      },
    ];

    return {
      menu
    }
  },
});
</script>

<style scoped>
.search-list {
  display: flex;
  overflow: scroll;
}

.search-list::-webkit-scrollbar {
  display: none;
}

.search-list>div {
  width: fit-content;
}

.search-list>div>ion-chip {
  white-space: nowrap;
}
</style>
