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
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="viewIndex" @ionChange="viewIndexChange">
          <ion-segment-button value="0" layout="ion-start">
            <ion-icon :icon="list"></ion-icon>
            <ion-label>리스트</ion-label>
          </ion-segment-button>
          <ion-segment-button value="1" layout="ion-start">
            <ion-icon :icon="map"></ion-icon>
            <ion-label>지도</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <swiper @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide>
          <ion-content class="ion-text-left">
            <template v-for="store in storeList" :key="store">
              <StoreCard v-if="store.show" :storeInfo="store" @click="openStoreModel(store)"></StoreCard>
            </template>
          </ion-content>
        </swiper-slide>
        <swiper-slide>
          <ion-content>
            <KakaoMap @markerClick="markerClick" :markerOptions="storeMarkerOptions"></KakaoMap>
          </ion-content>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonBackButton, IonIcon, modalController, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { map, list } from 'ionicons/icons';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
// import { debounce } from 'lodash';
import StoreCard from '@/components/StoreCard.vue';
import KakaoMap from '@/components/KakaoMap.vue';
import GoogleApi from '@/utils/GoogleApi';
import Common from '@/utils/Common';
import StoreModal from '@/components/StoreModal.vue';

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

export default defineComponent({
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    StoreCard,
    KakaoMap,
    Swiper,
    SwiperSlide
  },
  setup() {
    let storeList = ref([] as any[]),
      modal = null as any,
      modalIsOpen = false,
      viewIndex = ref(0),
      swiper = null as any;

    const searchWordChange = (e: Event) => {
      const target = e.target as HTMLInputElement;

      storeList.value.map(store => {
        const storeName = store['store-name'] as string;
        store.show = storeName.includes(target.value);
        return store;
      });
    };

    const openStoreModel = async (storeInfo: any) => {
      modal = await modalController.create({
        component: StoreModal,
        componentProps: {
          'storeInfo': storeInfo
        },
        mode: 'ios',
        presentingElement: document.querySelector('#restaurantMapPage') as HTMLElement,
        canDismiss: true
      });

      modal.present();

      modal.onDidDismiss().then(() => {
        if (modalIsOpen) {
          modalIsOpen = false;
          history.back();
        }
      })

      modalIsOpen = true;
      history.pushState(null, '', `${location.href}#modal`);
    };

    const markerClick = (data: { marker: any, overlay: any }) => {
      for (let i = 0; i < storeList.value.length; i++) {
        if (storeList.value[i]['no'] === data.marker.getTitle()) {
          openStoreModel(storeList.value[i]);
          break;
        }
      }
    };

    const historyCtrl = () => {
      if (modalIsOpen) {
        modal.dismiss();
        modalIsOpen = false;
      }
    };

    const onSwiper = (swiperEl: any) => {
      swiper = swiperEl;
    };

    const onSlideChange = () => {
      viewIndex.value = swiper.activeIndex;
    };

    const viewIndexChange = () => {
      swiper.slideTo(viewIndex.value);
    };

    const storeMarkerOptions = computed(() => {
      return storeList.value.filter(store => store.show && !Common.isNull(store['store-marker-option'])).map(store => store['store-marker-option']);
    });

    onMounted(async () => {
      window.addEventListener('popstate', historyCtrl);

      storeList.value = ref(await GoogleApi.getSingleSheetData('맛집정보')).value;

      if (!Common.isNull(storeList.value)) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        storeList.value.map(store => {
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
    });

    onUnmounted(() => {
      window.removeEventListener('popstate', historyCtrl);
    });

    return {
      map,
      list,
      viewIndex,
      storeList,
      searchWordChange,
      viewIndexChange,
      onSwiper,
      onSlideChange,
      openStoreModel,
      markerClick,
      storeMarkerOptions,
    }
  }
});
</script>

<style scoped>
.swiper {
  height: 100%;
}

ion-searchbar {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
