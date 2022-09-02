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
                <ion-searchbar placeholder="닉네임을 입력하세요" v-model="player" @keypress="enter($event)"></ion-searchbar>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="playerSearch()" id="search-btn">
                        <ion-icon :icon="searchSharp" slot="icon-only"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" id="main">
            <ion-list lines="none" v-if="playerInfo">
                <ion-item>
                    <ion-grid class="no-padding">
                        <ion-row v-if="playerInfo.clanName">
                            <ion-col>
                                <ion-text color="warning">
                                    <small>{{ playerInfo.clanName }}</small>
                                </ion-text>
                            </ion-col>
                        </ion-row>
                        <ion-row class="ion-align-items-center">
                            <ion-col size="10">
                                <ion-text>
                                    <h1 class="ion-no-margin">{{ playerInfo.nickname }}</h1>
                                </ion-text>
                            </ion-col>
                            <ion-col size="2" class="ion-text-end">
                                <ion-text>{{ playerInfo.grade }}급</ion-text>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item>
                    <ion-label>일반전 승률</ion-label>
                    <ion-note :color="gameNormalRatioColor">{{ `${gameNormalRatio}%` }}</ion-note>
                </ion-item>
                <ion-item>
                    <ion-label>공식전 승률</ion-label>
                </ion-item>
                <ion-item v-if="playerInfo.tierName">
                    <ion-grid>
                        <ion-row class="ion-text-center ion-align-items-center">
                            <ion-col size="6">
                                <ion-text color="primary">
                                    <h1 class="ion-no-margin">{{ playerInfo.tierName }}</h1>
                                </ion-text>
                            </ion-col>
                            <ion-col size="3">
                                <div>현재점수</div>
                                <div>{{ playerInfo.ratingPoint }}</div>
                            </ion-col>
                            <ion-col size="3">
                                <div>최고점수</div>
                                <div>{{ playerInfo.maxRatingPoint }}</div>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-list>
        </ion-content>

        <ion-menu content-id="main" menu-id="main-menu">
            <ion-header>
                <ion-toolbar>
                    <ion-title>메뉴</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content>
                <ion-list>
                    <ion-item button>
                        사이퍼즈 캐릭터상 테스트
                    </ion-item>
                    <ion-item button router-link="/restaurantListMap">
                        맛집리스트
                    </ion-item>
                </ion-list>
            </ion-content>
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
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonNote
} from '@ionic/vue';
import { computed, defineComponent, ref } from 'vue';
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
        IonLabel,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonNote
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
                playerInfo.value = ref();
            } else {
                playerId = playerIdJson.rows[0].playerId;
                playerInfo.value = ref(await NeopleApi.cyPlayerInfo({ playerId: playerId })).value;
                console.log(playerInfo.value);
            }

            loading.dismiss();
        };

        const enter = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    const btn = document.querySelector('#search-btn') as HTMLElement;
                    btn.click();
                }, 250);
            }
        };

        const gameNormalRatio = computed(() => {
            let ratio = 0;

            if (!Common.isNull(playerInfo) && !Common.isNull(playerInfo.value.records)) {
                const game = (playerInfo.value.records as any[]).filter(game => game.gameTypeId === 'normal')[0];
                ratio = Math.round(game.winCount / (game.winCount + game.loseCount) * 100);
            }

            return ratio;
        });

        const gameNormalRatioColor = computed(() => {
            let color = '';

            if (gameNormalRatio.value >= 75) {
                color = 'primary';
            } else if (gameNormalRatio.value >= 50) {
                color = 'success';
            } else if (gameNormalRatio.value >= 25) {
                color = 'warning';
            } else {
                color = 'danger';
            }
            return color;
        });

        onIonViewDidLeave(() => {
            menuController.close('main-menu');
        });

        return {
            searchSharp,
            player,
            playerSearch,
            playerInfo,
            enter,
            gameNormalRatio,
            gameNormalRatioColor
        }
    }
});
</script>
<style scoped>
.no-padding ion-col {
    --ion-grid-column-padding: 0;
}
</style>
