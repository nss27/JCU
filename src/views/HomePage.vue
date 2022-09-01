<template>
    <ion-page>
        <ion-menu content-id="main" menu-id="main-menu">
            <ion-header>
                <ion-toolbar>
                    <ion-title>메뉴</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content>
                <ion-list>
                    <ion-item button router-link="/restaurantListMap">
                        맛집리스트
                    </ion-item>
                </ion-list>
            </ion-content>
        </ion-menu>

        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>전사모</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" id="main">
            <ion-list>
                <ion-item>
                    <ion-searchbar placeholder="닉네임을 입력하세요" v-model="player"></ion-searchbar>
                    <ion-button fill="clear" @click="playerSearch()">
                        <ion-icon :icon="searchSharp" slot="icon-only"></ion-icon>
                    </ion-button>
                </ion-item>
                <ion-item v-if="playerInfo">
                    <ion-label class="ion-text-wrap">
                        <h1>
                            {{ playerInfo.nickname }}
                            <small>
                                {{ playerInfo.grade }}급
                            </small>
                            <small v-if="playerInfo.clanName">
                                클랜: {{ playerInfo.clanName }}
                            </small>
                        </h1>
                        <h1>랭킹</h1>
                        <h3>{{ playerInfo.tierName }}</h3>
                        <p>{{ playerInfo.ratingPoint }} / {{ playerInfo.maxRatingPoint }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
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
    IonMenu,
    IonList,
    IonItem,
    IonMenuButton,
    menuController,
    onIonViewDidLeave,
    IonButton,
    IonIcon,
    loadingController,
    IonLabel
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { searchSharp } from 'ionicons/icons';
import NeopleApi from '@/utils/NeopleApi';
import Common from '@/utils/Common';

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
        IonLabel
    },
    setup() {
        const player = ref('');
        let playerId = '';
        let playerInfo = ref();

        const playerSearch = async () => {
            const loading = await loadingController.create({
                message: '데이터 조회중',
                mode: 'ios'
            });
            loading.present();

            const playerIdJson = await NeopleApi.cyPlayerId({ nickname: encodeURI(player.value) });

            if (Common.isNull(playerIdJson.rows)) {
                playerId = '';
            } else {
                playerId = playerIdJson.rows[0].playerId;
                playerInfo.value = ref(await NeopleApi.cyPlayerInfo({ playerId: playerId })).value;
                console.log(playerInfo.value);

            }

            loading.dismiss();
        };

        onIonViewDidLeave(() => {
            menuController.close('main-menu');
        });

        return {
            searchSharp,
            player,
            playerSearch,
            playerInfo
        }
    }
});
</script>

<style scoped>
</style>
