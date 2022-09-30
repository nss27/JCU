<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>JCU</ion-title>
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
              <ion-label>{{ row.word }}</ion-label>
              <ion-icon :icon="close" @click.stop="searchWordsDelete(row.date)"></ion-icon>
            </ion-chip>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" id="main">
      <ion-grid>
        <ion-row v-for="(row, index) in menuGrid" :key="index">
          <ion-col v-for="(data, index) in row" :key="index">
            <ion-card :router-link="data.url" class="ion-no-margin menu-card">
              <img :src="data.img" />
              <ion-card-header>
                <ion-card-title class="menu-name">{{data.name}}</ion-card-title>
              </ion-card-header>
              <ion-card-content>{{ data.content }}</ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-menu content-id="main" menu-id="mainMenu">
      <ion-content>
        <ion-list>
          <ion-item router-link="/openSourceLicenseList" button>
            <ion-label>오픈소스</ion-label>
          </ion-item>
          <ion-item router-link="/openApiList" button>
            <ion-label>오픈 API</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonMenuButton,
  IonMenu,
  IonList,
  IonItem,
  alertController,
  onIonViewDidLeave,
  onIonViewWillEnter,
  menuController,
} from "@ionic/vue";
import { defineComponent, onMounted, ref, watch } from "vue";
import { search, close } from "ionicons/icons";
import Common from "@/utils/Common";
import { useRouter } from "vue-router";
import { IDBPDatabase, openDB } from "idb";
import menuList from "@/jsons/menuList.json";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonChip,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonMenuButton,
    IonMenu,
    IonList,
    IonItem,
  },
  setup() {
    const router = useRouter();
    let idb: IDBPDatabase<unknown>;

    const searchWord = ref("");
    const searchWords = ref();
    const tableName = "search-words";

    const menuGrid: any[] = [];
    let row: any[] = [];

    menuList.forEach((data, i) => {
      row.push(data);
      if ((i + 1) % 2 === 0) {
        menuGrid.push(row);
        row = [];
      }
    });

    const movePage = async (word: string) => {
      if (Common.isNull(word)) {
        const alert = await alertController.create({
          message: "닉네임을 입력 후 다시 시도해주세요",
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      } else {
        router.push({
          path: `/playerInfo/${encodeURI(word)}`,
        });
      }
    };

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
      (searchWords.value as any[]).sort((a, b) => b.date - a.date);
    });

    onIonViewWillEnter(async () => {
      if (!Common.isNull(idb?.name))
        searchWords.value = await idb.getAll(tableName);
    });

    onIonViewDidLeave(() => {
      searchWord.value = "";
      menuController.close("mainMenu");
    });

    onMounted(async () => {
      idb = await openDB("jcu", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName);
          }
        },
      });

      searchWords.value = await idb.getAll(tableName);
    });

    return {
      Common,
      search,
      close,
      searchWord,
      searchWords,
      menuGrid,
      enter,
      searchBtnClick,
      searchWordsClick,
      searchWordsDelete,
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

.menu-card {
  height: 100%;
}

.menu-name {
  font-size: 18px;
}
</style>
