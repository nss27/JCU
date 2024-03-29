<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>맛집지도</ion-title>
        <ion-buttons slot="end">
          <home-button-vue></home-button-vue>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="sotreSearch" :debounce="250" placeholder="가게명을 입력하세요"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-chip v-for="(data, index) in storeTypes" :key="index" :color="data.color"
          @click="storeTypeClick(data.text)">{{ data.text }}</ion-chip>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <no-data-vue v-if="Common.isNull(showStoreList)"></no-data-vue>
      <template v-else>
        <store-cardVue v-for="store in showStoreList" :key="store" :storeInfo="store"
          :router-link="`/restaurant/${store.no}`">
        </store-cardVue>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonBackButton,
  IonChip,
  loadingController,
  alertController,
} from "@ionic/vue";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import GoogleApi from "@/utils/GoogleApi";
import Common from "@/utils/Common";
import StoreCardVue from "@/components/StoreCard.vue";
import NoDataVue from "@/components/NoData.vue";
import HomeButtonVue from "@/components/HomeButton.vue";

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
    IonChip,
    StoreCardVue,
    NoDataVue,
    HomeButtonVue
  },
  setup() {
    const storeList = ref([] as any[]);
    const storeTypes = ref([
      {
        text: "전체",
        color: ''
      },
      {
        text: "음식점",
        color: 'medium'
      },
      {
        text: "카페",
        color: 'medium'
      },
    ]);
    const storeTypeSearch = ref("전체");
    const sotreSearch = ref("");

    const storeTypeClick = (type: string) => {
      storeTypeSearch.value = type;
    }

    const showStoreList = computed(() => storeList.value.filter((store) => store.show));

    const storeListChange = () => {
      storeList.value.map((store) => {
        const storeName = store["store-name"] as string;
        const storeType = store["store-type"] as string;

        switch (storeTypeSearch.value) {
          case "전체":
            store.show = storeName.includes(sotreSearch.value);
            break;

          default:
            store.show = storeName.includes(sotreSearch.value) && storeType.includes(storeTypeSearch.value);
            break;
        }

        return store;
      });
    }

    watch(sotreSearch, storeListChange);

    watch(storeTypeSearch, () => {
      storeTypes.value.map(data => {
        data.color = data.text === storeTypeSearch.value ? '' : 'medium';
        return data;
      });

      storeListChange();
    });

    onMounted(async () => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });

      await loading.present();

      try {
        storeList.value = await GoogleApi.getSingleSheetData("맛집정보");
        storeList.value.forEach((store) => (store.show = true));
      } catch (error) {
        const alert = await alertController.create({
          header: "오류 발생",
          subHeader: `${error}`,
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      } finally {
        await loading.dismiss();
      }
    });

    return {
      Common,
      storeTypes,
      storeTypeSearch,
      sotreSearch,
      showStoreList,
      storeTypeClick
    };
  },
});
</script>

<style scoped>
ion-searchbar {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
