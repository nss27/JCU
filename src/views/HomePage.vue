<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>전사연</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="닉네임을 입력하세요" v-model="searchWord" @keypress="enter($event)"></ion-searchbar>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="playerSearch()">
            <ion-icon :icon="searchSharp" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="!Common.isNull(searchWords)">
        <div class="search-list">
          <div v-for="(row, index) in searchWords" :key="index">
            <ion-chip @click="searchWordsClick(row.word)">
              <ion-label>{{row.word}}</ion-label>
              <ion-icon :icon="close" @click.stop="searchWordsDelete(row.date)"></ion-icon>
            </ion-chip>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" id="main">
      <NoDataVue v-if="Common.isNull(playerIds)"></NoDataVue>
      <swiper :modules="modules" :pagination="true" @swiper="onSwiper" v-else>
        <swiper-slide v-for="(playerId, index) in playerIds" :key="index">
          <PlayerInfoVue :player-id="playerId"></PlayerInfoVue>
        </swiper-slide>
      </swiper>
    </ion-content>

    <ion-menu content-id="main" menu-id="main-menu">
      <ion-content>
        <ion-list>
          <ion-item button router-link="/charactorLookalike">
            사이퍼즈 캐릭터상 테스트
          </ion-item>
          <ion-item button router-link="/restaurantList"> 맛집리스트 </ion-item>
        </ion-list>
      </ion-content>

      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button router-link="/openSourceLicenseList">
              open source
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button router-link="/openApiList"> open api </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-menu>
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
  IonMenu,
  IonList,
  IonItem,
  IonMenuButton,
  menuController,
  onIonViewDidLeave,
  IonButton,
  IonIcon,
  loadingController,
  IonLabel,
  IonFooter,
  alertController,
  IonChip,
} from "@ionic/vue";
import { defineComponent, onMounted, ref, watch } from "vue";
import { searchSharp, close } from "ionicons/icons";
import NeopleApi from "@/utils/NeopleApi";
import Common from "@/utils/Common";
import { IDBPDatabase, openDB } from 'idb';
import NoDataVue from "@/components/NoData.vue";
import PlayerInfoVue from "@/components/PlayerInfo.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
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
    IonMenu,
    IonList,
    IonItem,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonLabel,
    IonFooter,
    IonChip,
    NoDataVue,
    PlayerInfoVue,
    Swiper,
    SwiperSlide
  },
  setup() {
    const searchWord = ref("");
    const searchWords = ref();
    const tableName = 'search-words';
    const playerIds = ref<string[]>();
    let idb: IDBPDatabase<unknown>;

    const playerSearch = async () => {
      const list = searchWord.value.split(' ').filter(nickname => !Common.isNull(nickname));

      if (!Common.isNull(list)) {
        playerIds.value = [];

        const loading = await loadingController.create({
          message: "데이터 조회중",
          mode: "ios",
        });

        await loading.present();

        try {
          list.forEach(async nickname => {
            const playerIdJson = await NeopleApi.cyPlayerId({
              nickname: encodeURI(nickname),
            });

            if (!Common.isNull(playerIdJson.rows)) {
              playerIds.value?.push(playerIdJson.rows[0].playerId);
            }
          });
        } catch (error) {
          const alert = await alertController.create({
            header: "오류 발생",
            subHeader: `${error}`,
            buttons: ["OK"],
            mode: "ios",
          });

          await alert.present();
        } finally {
          loading.dismiss();

          const list = (searchWords.value as any[]).filter(data => data.word === searchWord.value);
          list.forEach(async data => {
            await idb.delete(tableName, data.date);
          });
          await idb.put(tableName, { word: searchWord.value, date: Date.now() }, Date.now());
          searchWords.value = await idb.getAll(tableName);
        }
      } else {
        const alert = await alertController.create({
          message: '닉네임을 입력 후 다시 시도해주세요',
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      }
    };

    const enter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setTimeout(() => {
          playerSearch();
        }, 250);
      }
    };

    const searchWordsClick = (word: string) => {
      searchWord.value = word;
      playerSearch();
    };

    const searchWordsDelete = async (date: Date) => {
      await idb.delete(tableName, date);
      searchWords.value = await idb.getAll(tableName);
    };

    const onSwiper = (swiper: any) => {
      swiper.$el[0].style.height = '100%';
    };

    watch(searchWords, () => {
      (searchWords.value as any[]).sort((a, b) => b.date - a.date)
    })

    onIonViewDidLeave(() => {
      menuController.close("main-menu");
    });

    onMounted(async () => {
      idb = await openDB('jcu', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName);
          }
        },
      });

      searchWords.value = await idb.getAll(tableName);
    });

    return {
      NeopleApi,
      Common,
      searchSharp,
      close,
      searchWord,
      searchWords,
      playerIds,
      modules: [Pagination],
      playerSearch,
      enter,
      searchWordsClick,
      searchWordsDelete,
      onSwiper,
    };
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

<style>
.swiper-pagination-bullet {
  opacity: 1;
  background: var(--ion-color-dark) !important;
}

.swiper-pagination-bullet-active {
  background: var(--ion-color-danger) !important;
}
</style>