<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>맛집지도</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="sotreSearch" :debounce="250" placeholder="가게명을 입력하세요"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-chip v-for="(item, index) in storeTypes" :key="index" :outline="!(item === storeTypeSearch)"
          @click="() => (storeTypeSearch = item)">{{ item }}
        </ion-chip>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <NoDataVue v-if="Common.isNull(showStoreList)"></NoDataVue>
      <template v-else>
        <StoreCardVue v-for="store in showStoreList" :key="store" :storeInfo="store"
          :router-link="`/restaurant/${store.no}`">
        </StoreCardVue>
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
    NoDataVue
  },
  setup() {
    const storeList = ref([] as any[]);
    const storeTypes = ["전체", "음식점", "카페"];
    const storeTypeSearch = ref("전체");
    const sotreSearch = ref("");

    const searchWordChange = () => {
      storeList.value.map((store) => {
        const storeName = store["store-name"] as string;
        const storeType = store["store-type"] as string;

        switch (storeTypeSearch.value) {
          case "전체":
            store.show = storeName.includes(sotreSearch.value);
            break;

          default:
            store.show =
              storeName.includes(sotreSearch.value) &&
              storeType.includes(storeTypeSearch.value);
            break;
        }

        return store;
      });
    };

    const showStoreList = computed(() =>
      storeList.value.filter((store) => store.show)
    );

    watch(sotreSearch, searchWordChange);
    watch(storeTypeSearch, searchWordChange);

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
      storeTypes,
      storeTypeSearch,
      sotreSearch,
      Common,
      showStoreList,
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
