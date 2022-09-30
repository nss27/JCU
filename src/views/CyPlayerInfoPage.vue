<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>플레이어 검색</ion-title>
        <ion-buttons slot="end">
          <home-button-vue></home-button-vue>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="닉네임을 입력하세요" v-model="searchWord" @keypress.enter="enter()"></ion-searchbar>
        <ion-buttons slot="end">
          <ion-button @click="searchBtnClick()">
            <ion-icon slot="icon-only" :icon="search"></ion-icon>
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

    <ion-content :fullscreen="true">
      <swiper :modules="modules" :pagination="true">
        <swiper-slide v-if="Common.isNull(players)">
          <no-data-vue></no-data-vue>
        </swiper-slide>
        <template v-else>
          <swiper-slide v-for="(data, index) in players" :key="index">
            <player-info-vue :player-id="data.playerId" :player-nickname="data.playerNickname"></player-info-vue>
          </swiper-slide>
        </template>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonLabel,
  IonChip,
  loadingController,
  alertController,
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, onMounted, ref, watch } from "vue";
import { search, close } from "ionicons/icons";
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
import { useRoute, useRouter } from "vue-router";
import HomeButtonVue from "@/components/HomeButton.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonLabel,
    IonChip,
    NoDataVue,
    PlayerInfoVue,
    Swiper,
    SwiperSlide,
    HomeButtonVue
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const searchWord = ref('');
    const searchWords = ref();
    const tableName = 'search-words';
    const players = ref<{ playerId: string, playerNickname: string }[]>([]);

    let idb: IDBPDatabase<unknown>;

    const playerSearch = async () => {
      const nicknames = searchWord.value.split(' ').filter(nickname => !Common.isNull(nickname));

      if (!Common.isNull(nicknames)) {
        players.value = [];

        const loading = await loadingController.create({
          message: "데이터 조회중",
          mode: "ios",
        });

        await loading.present();

        try {
          for (let i = 0; i < nicknames.length; i++) {
            const playerIdJson = await NeopleApi.cyPlayerId({
              nickname: encodeURI(nicknames[i]),
            });

            if (!Common.isNull(playerIdJson.rows)) {
              players.value.push({
                playerId: playerIdJson.rows[0].playerId,
                playerNickname: nicknames[i]
              })
            }
          }
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

          const list = (searchWords.value as any[]).filter(data => data.word === searchWord.value);
          list.forEach(async data => {
            await idb.delete(tableName, data.date);
          });
          await idb.put(tableName, { word: searchWord.value, date: Date.now() }, Date.now());
          searchWords.value = await idb.getAll(tableName);
        }
      }
    };

    const movePage = async (word: string) => {
      if (Common.isNull(word)) {
        const alert = await alertController.create({
          message: '닉네임을 입력 후 다시 시도해주세요',
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      } else {
        router.push({
          path: `/playerInfo/${encodeURI(word)}`
        });
      }
    }

    const enter = () => {
      setTimeout(() => {
        movePage(searchWord.value);
      }, 250);
    };

    const searchBtnClick = () => {
      movePage(searchWord.value);
    };

    const searchWordsClick = async (word: string) => {
      movePage(word);
    };

    const searchWordsDelete = async (date: Date) => {
      await idb.delete(tableName, date);
      searchWords.value = await idb.getAll(tableName);
    };

    watch(searchWords, () => {
      (searchWords.value as any[]).sort((a, b) => b.date - a.date)
    })

    onIonViewWillEnter(async () => {
      if (route.params.searchWord !== searchWord.value) searchWord.value = route.params.searchWord as string;
      if (!Common.isNull(searchWord.value) && Common.isNull(players.value)) playerSearch();
      if (!Common.isNull(idb?.name)) searchWords.value = await idb.getAll(tableName);
    })

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
      search,
      close,
      searchWord,
      searchWords,
      players,
      modules: [Pagination],
      enter,
      searchWordsClick,
      searchWordsDelete,
      searchBtnClick
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
