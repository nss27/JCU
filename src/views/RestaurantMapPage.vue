<template>
  <ion-page id="restaurantMapPage">
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
      <KakaoMap v-if="viewType === 'map'" @markerClick="markerClick" :markerOptions="storeMarkerOptions"></KakaoMap>
      <template v-else-if="viewType === 'list'">
        <template v-for="(item, index) in storeList" :key="index">
          <StoreCard v-if="item.show" :storeInfo="item" @click="openStoreModel(item)"></StoreCard>
        </template>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonBackButton, IonIcon, IonButton, modalController } from '@ionic/vue';
import { map, list } from 'ionicons/icons';
import { defineComponent } from 'vue';
import _ from 'lodash';
import StoreCard from '@/components/StoreCard.vue';
import KakaoMap from '@/components/KakaoMap.vue';
import GoogleApi from '@/utils/GoogleApi';
import Common from '@/utils/Common';
import StoreModal from '@/components/StoreModal.vue';

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
      storeList: [] as any[],
      viewType: 'list',
      viewTypeIcon: map,
    }
  },
  async mounted() {
    this.storeList = await GoogleApi.getSingleSheetData('맛집정보');

    if (!Common.isNull(this.storeList)) {
      const geocoder = new window.kakao.maps.services.Geocoder();

      this.storeList.map(store => {
        store.show = true;

        if (!Common.isNull(store['store-address'])) {
          geocoder.addressSearch(store['store-address'], (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              store['store-position'] = new window.kakao.maps.LatLng(result[0].y, result[0].x);

              store['store-marker-option'] = {
                position: store['store-position'],
                image: new window.kakao.maps.MarkerImage(`assets/images/${store['marker-img']}`, new window.kakao.maps.Size(22, 22), { offset: new window.kakao.maps.Point(11, 11) }),
                title: store['no'],
                content: `<div class="name-tag">${store['store-name']}</div>`,
                yAnchor: -0.75
              }
            }
          });
        }

        return store;
      });
    }

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

      this.storeList.map(store => {
        const storeName = store['store-name'] as string;
        store.show = storeName.includes(target.value);
        return store;
      });
    },
    async openStoreModel(storeInfo: any) {
      const modal = await modalController.create({
        component: StoreModal,
        componentProps: {
          'storeInfo': storeInfo
        },
        mode: 'ios',
        presentingElement: document.querySelector('#restaurantMapPage') as HTMLElement,
        canDismiss: true
      });
      modal.present();
    },
    markerClick(data: { marker: any, overlay: any }) {
      for (let i = 0; i < this.storeList.length; i++) {
        if (this.storeList[i]['no'] === data.marker.getTitle()) {
          this.openStoreModel(this.storeList[i]);
          break;
        }
      }
    }
  },
  computed: {
    storeMarkerOptions(): any[] {
      return this.storeList.filter(store => store.show && !Common.isNull(store['store-marker-option'])).map(store => store['store-marker-option']);
    }
  },
});
</script>

<style scoped>
</style>
