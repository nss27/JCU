<template>
    <ion-content class="ion-text-start" v-if="playerInfo">
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
                <ion-note slot="end" :color="gameNormalRatioColor">{{
                `${gameNormalRatio}%`
                }}</ion-note>
            </ion-item>
            <ion-item>
                <ion-label>공식전</ion-label>
                <ion-note slot="end" :color="gameRatingRatioColor">{{
                `${gameRatingRatio}%`
                }}</ion-note>
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
            <ion-item v-else>
                <NoDataVue text="배치고사중"></NoDataVue>
            </ion-item>
            <ion-list-header>
                <ion-label>
                    <h1><strong>매칭기록</strong></h1>
                    <p>
                        ※ 매칭 기록 갱신 주기
                        <br />- 공식 홈페이지 전적 검색과 동일하게 1시간마다 갱신됩니다.
                    </p>
                </ion-label>
            </ion-list-header>
            <ion-item>
                <ion-segment v-model="gameTypeId">
                    <ion-segment-button value="rating">공식전</ion-segment-button>
                    <ion-segment-button value="normal">일반전</ion-segment-button>
                </ion-segment>
            </ion-item>
            <ion-item v-if="Common.isNull(matches)">
                <NoDataVue text="매칭기록이 존재하지 않습니다"></NoDataVue>
            </ion-item>
            <template v-else>
                <ion-item v-for="(gameInfo, index) in matches" :key="index" button
                    :router-link="`/matches/${gameInfo.matchId}`">
                    <ion-note slot="start" :color="gameInfo.playInfo.resultColor">
                        {{ gameInfo.playInfo.result }}
                    </ion-note>
                    <ion-thumbnail slot="start">
                        <img :src="NeopleApi.getCharacterImage(gameInfo.playInfo.characterId)" />
                        <img :src="NeopleApi.getPositionImage(gameInfo.position.name)" class="position-icon" />
                    </ion-thumbnail>
                    <ion-label>
                        <div>
                            [{{ gameInfo.playInfo.partyTypeName }}] KDA: {{ gameInfo.playInfo.kda }}
                        </div>
                        <div>
                            <ion-text color="medium">{{ gameInfo.date }}</ion-text>
                        </div>
                    </ion-label>
                </ion-item>
            </template>
        </ion-list>
        <ion-button v-if="next" expand="block" @click="addMatches(next)">
            더보기
        </ion-button>
    </ion-content>
    <NoDataVue text="플레이어 정보 준비중" v-else></NoDataVue>
</template>

<script lang="ts">
import Common from '@/utils/Common';
import NeopleApi from '@/utils/NeopleApi';
import {
    alertController,
    loadingController,
    IonContent,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonItem,
    IonLabel,
    IonListHeader,
    IonNote,
    IonSegmentButton,
    IonSegment,
    IonThumbnail,
    IonList,
    IonButton
} from '@ionic/vue';
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import NoDataVue from './NoData.vue';

export default defineComponent({
    props: ['playerId', 'playerNickname'],
    components: {
        IonContent,
        IonText,
        IonCol,
        IonRow,
        IonGrid,
        IonItem,
        IonLabel,
        IonListHeader,
        IonNote,
        IonSegmentButton,
        IonSegment,
        IonThumbnail,
        IonList,
        IonButton,
        NoDataVue
    },
    setup(props) {
        const { playerId, playerNickname } = toRefs(props);
        const playerInfo = ref();
        const gameTypeId = ref<'rating' | 'normal'>('rating');
        const next = ref('');
        const matches = ref();
        const searchWords = ref();

        const playerSearch = async () => {
            const loading = await loadingController.create({
                message: `플레이어 '${playerNickname.value}'<br>정보 조회중`,
                mode: "ios",
            });

            await loading.present();

            try {
                playerInfo.value = await NeopleApi.cyPlayerMatches({
                    playerId: playerId.value,
                    gameTypeId: gameTypeId.value,
                });
                gameTypeId.value = playerInfo.value.matches.gameTypeId;
                next.value = playerInfo.value.matches.next;
                matches.value = playerInfo.value.matches.rows;
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
        };

        const getKDA = (data: { playInfo: { killCount: number, deathCount: number, assistCount: number } }) => {
            if (data.playInfo.deathCount > 0) {
                return Math.round(((data.playInfo.killCount + data.playInfo.assistCount) / data.playInfo.deathCount) * 100) / 100;
            } else {
                return "PERFECT";
            }
        };

        const addMatches = async (data: string) => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            await loading.present();

            try {
                const json = await NeopleApi.cyPlayerMatches({
                    playerId: playerId.value,
                    next: data,
                });

                matches.value = [...matches.value, ...json.matches.rows];
                next.value = json.matches.next;
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
        };

        const gameNormalRatio = computed(() => {
            let ratio = 0;
            let game = null;

            if (!Common.isNull(playerInfo)) {
                game = (playerInfo.value.records as any[]).filter(
                    (game) => game.gameTypeId === "normal"
                )[0];
            }

            if (!Common.isNull(game)) {
                if (game.winCount + game.loseCount > 0) {
                    ratio =
                        Math.round(
                            (game.winCount / (game.winCount + game.loseCount)) * 10000
                        ) / 100;
                }
            }

            return ratio;
        });

        const gameNormalRatioColor = computed(() => {
            let color = "";

            if (gameNormalRatio.value >= 75) {
                color = "primary";
            } else if (gameNormalRatio.value >= 50) {
                color = "success";
            } else if (gameNormalRatio.value >= 25) {
                color = "warning";
            } else {
                color = "danger";
            }
            return color;
        });

        const gameRatingRatio = computed(() => {
            let ratio = 0;
            let game = null;

            if (!Common.isNull(playerInfo)) {
                game = (playerInfo.value.records as any[]).filter(
                    (game) => game.gameTypeId === "rating"
                )[0];
            }

            if (!Common.isNull(game)) {
                if (game.winCount + game.loseCount) {
                    ratio =
                        Math.round(
                            (game.winCount / (game.winCount + game.loseCount)) * 10000
                        ) / 100;
                }
            }

            return ratio;
        });

        const gameRatingRatioColor = computed(() => {
            let color = "";

            if (gameRatingRatio.value >= 75) {
                color = "primary";
            } else if (gameRatingRatio.value >= 50) {
                color = "success";
            } else if (gameRatingRatio.value >= 25) {
                color = "warning";
            } else {
                color = "danger";
            }
            return color;
        });

        watch(gameTypeId, (newVal, oldVal) => {
            if (!Common.isNull(oldVal)) playerSearch();
        });

        watch(matches, () => {
            (matches.value as any[]).map(gameInfo => {
                gameInfo.playInfo.resultColor = gameInfo.playInfo.result === 'win' ? 'primary' : 'danger';
                gameInfo.playInfo.partyTypeName = gameInfo.playInfo.partyUserCount > 0 ? `파티 ${gameInfo.playInfo.partyUserCount}인` : "솔로";
                gameInfo.playInfo.kda = getKDA(gameInfo);

                return gameInfo;
            });
        });

        watch(searchWords, () => {
            (searchWords.value as any[]).sort((a, b) => b.date - a.date)
        })

        onMounted(() => {
            playerSearch();
        })

        return {
            NeopleApi,
            Common,
            playerInfo,
            gameNormalRatio,
            gameNormalRatioColor,
            gameRatingRatio,
            gameRatingRatioColor,
            gameTypeId,
            next,
            matches,
            searchWords,
            playerSearch,
            addMatches,
        };
    },
})
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