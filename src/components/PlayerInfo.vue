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
                <ion-label>일반전 승률</ion-label>
            </ion-list-header>

            <ion-item v-if="gameNormal">
                <ion-label>
                    <ion-grid class="ion-no-padding">
                        <ion-row>
                            <ion-col>{{gameNormal.totalCount}}전</ion-col>
                            <ion-col>{{gameNormal.winCount}}승</ion-col>
                            <ion-col>{{gameNormal.loseCount}}패</ion-col>
                            <ion-col>{{gameNormal.stopCount}}중단</ion-col>
                            <ion-col>
                                <ion-text :color="gameNormal.rateColor">{{gameNormal.rate}}%</ion-text>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-label>
            </ion-item>

            <ion-item v-else>
                <no-data-vue text="조회된 일반전 정보가 없습니다"></no-data-vue>
            </ion-item>

            <ion-list-header>
                <ion-label>공식전 승률</ion-label>
            </ion-list-header>

            <template v-if="gameRating">
                <ion-item>
                    <ion-label>
                        <ion-grid class="ion-no-padding">
                            <ion-row>
                                <ion-col>{{gameRating.totalCount}}전</ion-col>
                                <ion-col>{{gameRating.winCount}}승</ion-col>
                                <ion-col>{{gameRating.loseCount}}패</ion-col>
                                <ion-col>{{gameRating.stopCount}}중단</ion-col>
                                <ion-col>
                                    <ion-text :color="gameRating.rateColor">{{gameRating.rate}}%</ion-text>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-label>
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
                    <no-data-vue text="배치고사중"></no-data-vue>
                </ion-item>
            </template>

            <ion-item v-else>
                <no-data-vue text="조회된 공식전 정보가 없습니다"></no-data-vue>
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
                <no-data-vue text="매칭기록이 존재하지 않습니다"></no-data-vue>
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
    <no-data-vue text="플레이어 정보 준비중" v-else></no-data-vue>
</template>

<script lang="ts">
import Common from '@/utils/Common';
import NeopleApi from '@/utils/NeopleApi';
import {
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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
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
        const abortController = new AbortController();

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
                playerInfo.value = await NeopleApi.cyPlayerMatches(
                    {
                        playerId: playerId.value,
                        gameTypeId: gameTypeId.value,
                    },
                    { signal: abortController.signal }
                );
                gameTypeId.value = playerInfo.value.matches.gameTypeId;
                next.value = playerInfo.value.matches.next;
                matches.value = playerInfo.value.matches.rows;
            } catch (err: any) {
                await Common.errorHandler(err);
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
            } catch (err: any) {
                await Common.errorHandler(err);
            } finally {
                await loading.dismiss();
            }
        };

        const gameRateColor = (rate: number) => {
            let color = "";

            if (rate >= 75) {
                color = "primary";
            } else if (rate >= 50) {
                color = "success";
            } else if (rate >= 25) {
                color = "warning";
            } else {
                color = "danger";
            }
            return color;
        }

        const gameNormal = computed(() => {
            let game = null;

            if (!Common.isNull(playerInfo)) {
                game = (playerInfo.value.records as any[]).filter(game => game.gameTypeId === "normal")[0];

                if (!Common.isNull(game)) {
                    game.totalCount = game.winCount + game.loseCount + game.stopCount;

                    if (game.winCount + game.loseCount > 0) {
                        game.rate = Math.round((game.winCount / (game.winCount + game.loseCount)) * 10000) / 100;
                    } else {
                        game.rate = 0;
                    }

                    game.rateColor = gameRateColor(game.rate);
                }
            }

            return game;
        });

        const gameRating = computed(() => {
            let game = null;

            if (!Common.isNull(playerInfo)) {
                game = (playerInfo.value.records as any[]).filter(game => game.gameTypeId === "rating")[0];

                if (!Common.isNull(game)) {
                    game.totalCount = game.winCount + game.loseCount + game.stopCount;

                    if (game.winCount + game.loseCount > 0) {
                        game.rate = Math.round((game.winCount / (game.winCount + game.loseCount)) * 10000) / 100;
                    } else {
                        game.rate = 0;
                    }
                    game.rateColor = gameRateColor(game.rate);
                }
            }

            return game;
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

        onBeforeUnmount(() => {
            abortController.abort();
        })

        return {
            NeopleApi,
            Common,
            playerInfo,
            gameNormal,
            gameRating,
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

ion-thumbnail>img {
    width: 100% !important;
}

.position-icon {
    --size: 36px;

    position: absolute;
    width: var(--size) !important;
    height: var(--size) !important;
    bottom: -10px;
    right: -16px;
}
</style>