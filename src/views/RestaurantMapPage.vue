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
          <ion-button @click="viewChange($event)">
            <ion-icon slot="icon-only" :icon="viewTypeIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <KakaoMap v-if="viewType === 'map'" :addressList="addressList"></KakaoMap>
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
import StoreCard from '@/components/StoreCard.vue';
import KakaoMap from '@/components/KakaoMap.vue';
import GoogleApi from '@/utils/GoogleApi';
// import Common from '@/utils/Common';

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
      restaurantList: new Array<any>(),
      viewType: 'list',
      viewTypeIcon: map
    }
  },
  async mounted() {
    this.restaurantList = await GoogleApi.getSingleSheetData('맛집정보');
    this.restaurantList.map(item => item.show = true);
  },
  methods: {
    viewChange(e: Event) {
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
    addressList():any[] {
      return this.restaurantList.filter(item => item.show).map(item => item['store-address'])
    }
  }
});
</script>

<style scoped>
</style>
