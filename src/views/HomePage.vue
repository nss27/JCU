<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>JCU</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="닉네임을 입력하세요" v-model="searchWord" @keypress="enter($event)"></ion-searchbar>
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
      <ion-card v-for="(data, index) in menuList" :key="index" :router-link="data.url">
        <div class="flex-box">
          <div class="menu-name">{{data.name}}</div>
          <img v-if="data.img" :src="data.img" class="menu-img">
        </div>
      </ion-card>
    </ion-content>
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
  alertController,
  onIonViewDidLeave,
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, onMounted, ref, watch } from "vue";
import menuList from '@/jsons/menuList.json';
import { search, close } from "ionicons/icons";
import Common from "@/utils/Common";
import { useRouter } from "vue-router";
import { IDBPDatabase, openDB } from 'idb';

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
  },
  setup() {
    const router = useRouter();
    let idb: IDBPDatabase<unknown>;

    const searchWord = ref('');
    const searchWords = ref();
    const tableName = 'search-words';

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

    const enter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setTimeout(() => {
          movePage(searchWord.value);
        }, 250);
      }
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
      if (!Common.isNull(idb?.name)) searchWords.value = await idb.getAll(tableName);
    })

    onIonViewDidLeave(() => {
      searchWord.value = '';
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
    })

    return {
      Common,
      menuList,
      search,
      close,
      searchWord,
      searchWords,
      enter,
      searchBtnClick,
      searchWordsClick,
      searchWordsDelete
    }
  },
});
</script>

<style scoped>
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--ion-color-dark);
  height: 100px;
}

.menu-img {
  height: 100%;
}

.menu-name {
  font-size: 26px;
  padding: 0 20px;
}

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
