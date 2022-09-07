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
                    <ion-button fill="clear" @click="playerSearch()">
                        <ion-icon :icon="searchSharp" slot="icon-only"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" id="main">
            <template v-if="playerInfo">
                <ion-list lines="none">
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
                    <ion-list-header>
                        <ion-label>승률</ion-label>
                    </ion-list-header>
                    <ion-item>
                        <ion-label>일반전</ion-label>
                        <ion-note :color="gameNormalRatioColor">{{ `${gameNormalRatio}%` }}</ion-note>
                    </ion-item>
                    <ion-item>
                        <ion-label>공식전</ion-label>
                        <ion-note :color="gameRatingRatioColor">{{ `${gameRatingRatio}%` }}</ion-note>
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
                    <ion-list-header>
                        <ion-label>매칭기록</ion-label>
                    </ion-list-header>
                    <ion-item>
                        <ion-segment v-model="gameTypeId">
                            <ion-segment-button value="rating">공식전</ion-segment-button>
                            <ion-segment-button value="normal">일반전</ion-segment-button>
                        </ion-segment>
                    </ion-item>
                    <template v-for="(gameInfo, index) in playerInfo.matches.rows" :key="index">
                        <ion-item button :router-link="`/matches/${gameInfo.matchId}`">
                            <ion-note slot="start" :color="resultColor(gameInfo.playInfo.result)">
                                {{ gameInfo.playInfo.result }}
                            </ion-note>
                            <ion-thumbnail slot="start">
                                <img :src="`${NeopleApi.cyCharactersUrl}/${gameInfo.playInfo.characterId}`" />
                                <img :src="NeopleApi.getPositionImage(gameInfo.position.name)" class="position-icon">
                            </ion-thumbnail>
                            <ion-label>
                                <div>{{ gamePlayType(gameInfo.playInfo.partyUserCount) }}</div>
                                <div>
                                    KDA: {{ gameKDA(gameInfo.playInfo.killCount, gameInfo.playInfo.deathCount,
                                    gameInfo.playInfo.assistCount) }}
                                </div>
                            </ion-label>
                        </ion-item>
                    </template>
                </ion-list>
            </template>
        </ion-content>

        <ion-menu content-id="main" menu-id="main-menu">
            <ion-content>
                <ion-list>
                    <ion-item button router-link="/charactorLookalike">
                        사이퍼즈 캐릭터상 테스트
                    </ion-item>
                    <ion-item button router-link="/restaurantList">
                        맛집리스트
                    </ion-item>
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
                        <ion-button router-link="/openApiList">
                            open api
                        </ion-button>
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
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonNote,
    IonFooter,
    alertController,
    IonListHeader,
    IonSegment,
    IonSegmentButton,
    IonThumbnail
} from '@ionic/vue';
import { computed, defineComponent, ref, watch } from 'vue';
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
        IonNote,
        IonFooter,
        IonListHeader,
        IonSegment,
        IonSegmentButton,
        IonThumbnail
    },
    setup() {
        const player = ref('');
        let playerId = '';
        const playerInfo = ref();
        const gameTypeId = ref();

        const playerSearch = async () => {
            const loading = await loadingController.create({
                message: '데이터 조회중',
                mode: 'ios'
            });
            loading.present();

            try {
                const playerIdJson = await NeopleApi.cyPlayerId({ nickname: encodeURI(player.value) });

                if (Common.isNull(playerIdJson.rows)) {
                    playerId = '';
                    playerInfo.value = null;
                } else {
                    playerId = playerIdJson.rows[0].playerId;
                    playerInfo.value = await NeopleApi.cyPlayerMatches(Common.preprocessing({
                        playerId: playerId,
                        gameTypeId: gameTypeId.value
                    }));
                    gameTypeId.value = playerInfo.value.matches.gameTypeId;
                    console.log(playerInfo.value);
                }

                loading.dismiss();
            } catch (error) {
                const alert = await alertController.create({
                    header: '오류 발생',
                    subHeader: '네트워크를 확인해주세요',
                    // message: '데이터를 처리하는 과정에서 오류가 발생하였습니다\n네트워크를 확인해주세요',
                    buttons: ['OK'],
                    mode: 'ios'
                });

                await alert.present();
            } finally {
                loading.dismiss();
            }
        };

        const enter = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    playerSearch();
                }, 250);
            }
        };

        const resultColor = (color: string) => color === 'win' ? 'primary' : 'danger';

        const gamePlayType = (userCnt: number) => userCnt > 0 ? `파티 ${userCnt}인` : '솔로';

        const gameKDA = (killCount: number, deathCount: number, assistCount: number) => {
            if (deathCount > 0) {
                return Math.round((killCount + assistCount) / deathCount * 100) / 100;
            } else {
                return 'PERFECT';
            }
        };

        const gameNormalRatio = computed(() => {
            let ratio = 0;

            if (!Common.isNull(playerInfo) && !Common.isNull(playerInfo.value.records)) {
                const game = (playerInfo.value.records as any[]).filter(game => game.gameTypeId === 'normal')[0];
                if (game.winCount + game.loseCount > 0) {
                    ratio = Math.round(game.winCount / (game.winCount + game.loseCount) * 10000) / 100;
                }
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

        const gameRatingRatio = computed(() => {
            let ratio = 0;

            if (!Common.isNull(playerInfo) && !Common.isNull(playerInfo.value.records)) {
                const game = (playerInfo.value.records as any[]).filter(game => game.gameTypeId === 'rating')[0];
                if (game.winCount + game.loseCount) {
                    ratio = Math.round(game.winCount / (game.winCount + game.loseCount) * 10000) / 100;
                }
            }

            return ratio;
        });

        const gameRatingRatioColor = computed(() => {
            let color = '';

            if (gameRatingRatio.value >= 75) {
                color = 'primary';
            } else if (gameRatingRatio.value >= 50) {
                color = 'success';
            } else if (gameRatingRatio.value >= 25) {
                color = 'warning';
            } else {
                color = 'danger';
            }
            return color;
        });

        watch(gameTypeId, (newVal, oldVal) => {
            if (!Common.isNull(oldVal)) playerSearch();
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
            gameNormalRatioColor,
            gameRatingRatio,
            gameRatingRatioColor,
            gameTypeId,
            NeopleApi,
            resultColor,
            gamePlayType,
            gameKDA
        }
    }
});
</script>
<style scoped>
.no-padding ion-col {
    --ion-grid-column-padding: 0;
}

ion-thumbnail {
    position: relative;
}

.position-icon {
    --size: 36px;

    position: absolute;
    width: var(--size);
    height: var(--size);
    bottom: -10px;
    right: -16px;
}
</style>
