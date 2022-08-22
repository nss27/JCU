<template>
  <ion-page mode="ios">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>맛집지도</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar @ionInput="searchWordChange($event)"></ion-searchbar>
        <ion-buttons slot="end">
          <ion-button @click="viewChange()">
            <ion-icon slot="icon-only" :icon="viewTypeIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <KakaoMap v-if="viewType === 'map'" :storeList="storeList"></KakaoMap>
      <template v-else-if="viewType === 'list'">
        <template v-for="(item, index) in restaurantList" :key="index">
          <StoreCard v-if="item.show" :storeInfo="item"></StoreCard>
        </template>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonBackButton, IonIcon, IonButton } from '@ionic/vue';
import { map, list } from 'ionicons/icons';
import { defineComponent } from 'vue';
import _ from 'lodash';
import StoreCard from '@/components/StoreCard.vue';
import KakaoMap from '@/components/KakaoMap.vue';
import GoogleApi from '@/utils/GoogleApi';

export default defineComponent({
  name: 'RestaurantMap',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    StoreCard,
    KakaoMap
  },
  data() {
    return {
      restaurantList: [] as any[],
      viewType: 'list',
      viewTypeIcon: map
    }
  },
  async mounted() {
    this.restaurantList = await GoogleApi.getSingleSheetData('맛집정보');
    this.restaurantList.map(item => item.show = true);

    this.searchWordChange = _.debounce(this.searchWordChange, 350);
  },
  methods: {
    viewChange() {
      this.viewTypeIcon = this.viewTypeIcon === map ? list : map;

      switch (this.viewTypeIcon) {
        case map:
          this.viewType = 'list'
          break;

        default:
          this.viewType = 'map'
          break;
      }
    },
    searchWordChange(e: Event) {
      const target = e.target as HTMLInputElement;

      this.restaurantList.map(item => {
        const storeName = item['store-name'] as string;
        item.show = storeName.includes(target.value);
        return item;
      });
    }
  },
  computed: {
    storeList(): any[] {
      return this.restaurantList.filter(item => item.show)
    }
  }
});
</script>

<style scoped>
</style>
