<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>캐릭터 랭킹</ion-title>
                <ion-buttons slot="end">
                    <web-share-button-vue></web-share-button-vue>
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="getRanking(true)">
                        <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-searchbar v-model="searchWord" placeholder="닉네임을 입력하세요" @keypress.enter="enter()"></ion-searchbar>
                <ion-buttons slot="end">
                    <ion-button @click="searchBtnClick()">
                        <ion-icon slot="icon-only" :icon="search"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
                <div class="search-list">
                    <div v-for="(data, index) in rankingTypes" :key="index">
                        <ion-chip :color="data.color" @click="rankingTypeClick(data.typeEng as RankingType)">
                            <ion-label>{{data.typeKor}}</ion-label>
                        </ion-chip>
                    </div>
                </div>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <swiper @swiper="onSwiper" :modules="modules" :pagination="true">
                <swiper-slide>
                    <ion-content>
                        <ion-grid class="ion-no-padding character-grid">
                            <ion-row v-for="(row, index) in characterGrid" :key="index" class="character-row">
                                <ion-col v-for="(data, index) in row" :key="index" :class="data.class"
                                    @click="characterClick(data.characterId)">
                                    <img :src="NeopleApi.getCharacterImage(data.characterId)" alt="">
                                    <ion-text :color="data.color" class="character-name">
                                        <strong>{{data.characterName}}</strong>
                                    </ion-text>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-content>
                </swiper-slide>
                <swiper-slide>
                    <ion-content>
                        <no-data-vue v-if="Common.isNull(list)"></no-data-vue>
                        <template v-else>
                            <ion-list>
                                <ion-item v-for="(data, index) in list" :key="index"
                                    :router-link="`/playerInfo/${encodeURI(data.nickname)}`" button>
                                    <ion-note slot="start" color="dark">{{data.rank}}위</ion-note>
                                    <ion-label>
                                        <h3 class="ion-no-margin" v-if="!Common.isNull(data.clanName)">
                                            <ion-text color="warning">{{data.clanName}}</ion-text>
                                        </h3>
                                        <h1 class="ion-no-margin">{{data.nickname}}</h1>
                                        <ion-grid class="ion-no-padding">
                                            <ion-row v-if="rankingType !== 'exp'" class="ion-align-items-center">
                                                <ion-col>
                                                    승: <ion-text color="primary">
                                                        <strong>{{data.winCount}}</strong>
                                                    </ion-text>
                                                </ion-col>
                                                <ion-col>
                                                    패: <ion-text color="danger">
                                                        <strong>{{data.loseCount}}</strong>
                                                    </ion-text>
                                                </ion-col>
                                                <ion-col size="5">승률: {{data.winRatio}}%</ion-col>
                                            </ion-row>

                                            <ion-row v-if="data.killCount" class="ion-align-items-center">
                                                <ion-col>킬: {{Common.commaFormat(data.killCount)}}</ion-col>
                                            </ion-row>

                                            <ion-row v-if="data.assistCount" class="ion-align-items-center">
                                                <ion-col>도움: {{Common.commaFormat(data.assistCount)}}</ion-col>
                                            </ion-row>

                                            <ion-row v-if="data.exp" class="ion-align-items-center">
                                                <ion-col>경험치: {{Common.commaFormat(data.exp)}}</ion-col>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-label>
                                </ion-item>
                            </ion-list>
                            <ion-button v-if="showAddBtn" expand="block" @click="getRanking()">더보기</ion-button>
                        </template>
                    </ion-content>
                </swiper-slide>
            </swiper>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonChip,
    IonLabel,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
    loadingController,
    alertController,
    onIonViewWillEnter,
} from '@ionic/vue';
import NoDataVue from '@/components/NoData.vue';
import HomeButtonVue from '@/components/HomeButton.vue';
import characters from '@/jsons/characters.json';
import NeopleApi from '@/utils/NeopleApi';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/vue/css/ionic-swiper.css';
import { search, refresh } from 'ionicons/icons';
import Common from '@/utils/Common';
import { useRoute, useRouter } from 'vue-router';
import WebShareButtonVue from '@/components/WebShareButton.vue';

type RankingType = "winCount" | "winRate" | "killCount" | "assistCount" | "exp";

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonChip,
        IonLabel,
        IonSearchbar,
        IonButton,
        IonIcon,
        IonList,
        IonItem,
        IonNote,
        NoDataVue,
        HomeButtonVue,
        Swiper,
        SwiperSlide,
        WebShareButtonVue
    },
    setup() {
        const abortController = new AbortController();
        const router = useRouter();
        const route = useRoute();

        const rankingTypes = ref([
            {
                typeKor: '승리수',
                typeEng: 'winCount',
                color: 'medium'
            },
            {
                typeKor: '승률',
                typeEng: 'winRate',
                color: 'medium'
            },
            {
                typeKor: '킬',
                typeEng: 'killCount',
                color: 'medium'
            },
            {
                typeKor: '도움',
                typeEng: 'assistCount',
                color: 'medium'
            },
            {
                typeKor: '경험치',
                typeEng: 'exp',
                color: 'medium'
            }
        ])
        const characterId = ref<string>('');
        const rankingType = ref<RankingType>('' as RankingType);
        const searchWord = ref<string>('');
        const list = ref<any[]>([]);
        const characterGrid = ref<any[]>([]);
        const offset = ref(0);

        let slides: any = null;
        let row: any[] = [];

        characters.forEach((data, i) => {
            row.push({
                ...data,
                class: '',
                color: 'medium'
            });
            if ((i + 1) % 5 === 0) {
                characterGrid.value.push(row);
                row = [];
            }
        });

        const errorHanbler = async (err: Error) => {
            if (err.name !== 'AbortError') {
                const alert = await alertController.create({
                    header: '오류 발생',
                    subHeader: `${err.message}`,
                    buttons: ['ok'],
                    mode: 'ios'
                })

                await alert.present();
            }
        }

        const characterClick = (data: string) => {
            characterId.value = data;
        }

        const rankingTypeClick = (data: RankingType) => {
            rankingType.value = data;
        }

        const onSwiper = (swiper: any) => {
            slides = swiper;
        }

        const getRanking = async (refresh?: boolean) => {
            if (!Common.isNull(refresh) && refresh) {
                list.value = [];
                offset.value = 0;
                searchWord.value = '';
            }

            const loading = await loadingController.create({
                message: `캐릭터 '${characters.filter(data => data.characterId === characterId.value)[0].characterName}'<br>랭킹 조회중`,
                mode: 'ios'
            })

            await loading.present();

            try {
                const data = await NeopleApi.cyCharacterRanking({
                    characterId: characterId.value,
                    rankingType: rankingType.value,
                    offset: offset.value
                }, {
                    signal: abortController.signal
                })

                if (Common.isNull(data.rows)) {
                    list.value = [];
                    offset.value = 0;
                } else {
                    list.value = [...list.value, ...data.rows];
                    offset.value += data.rows.length < 10 ? 0 : 10;
                }

                slides.slideTo(1);
            } catch (err: any) {
                errorHanbler(err);
            } finally {
                await loading.dismiss();
            }
        }

        const searchRanking = async () => {
            const nicknames = searchWord.value.split(' ').filter(nickname => !Common.isNull(nickname));

            if (!Common.isNull(nicknames)) {
                list.value = [];
                offset.value = -1;

                const playerRankings: any[] = [];

                const loading = await loadingController.create({
                    message: '데이터 조회중',
                    mode: 'ios'
                })

                await loading.present();

                try {
                    for (let i = 0; i < nicknames.length; i++) {
                        loading.message = `플레이어 '${nicknames[i]}'<br>랭킹 조회중`;

                        const playerIdJson = await NeopleApi.cyPlayerId({ nickname: encodeURI(nicknames[i]) }, { signal: abortController.signal });

                        if (!Common.isNull(playerIdJson.rows)) {
                            const data = await NeopleApi.cyCharacterRanking(
                                {
                                    characterId: characterId.value,
                                    rankingType: rankingType.value,
                                    playerId: playerIdJson.rows[0].playerId
                                },
                                { signal: abortController.signal }
                            );
                            playerRankings.push(...data.rows);
                        }
                    }

                    list.value = playerRankings;
                    slides.slideTo(1);
                } catch (err) {
                    errorHanbler(err as Error);
                } finally {
                    await loading.dismiss();
                }
            }
        }

        const movePage = async (search?: boolean) => {
            if (search && Common.isNull(searchWord.value)) {
                const alert = await alertController.create({
                    message: '닉네임을 입력 후 다시 시도해주세요',
                    buttons: ["OK"],
                    mode: "ios",
                });

                await alert.present();
            } else {
                router.push({
                    path: `/characterRanKing/${characterId.value}/${rankingType.value}/${encodeURI(searchWord.value)}`
                })
            }
        }

        const enter = () => {
            setTimeout(() => {
                movePage(true);
            }, 250);
        };

        const searchBtnClick = () => {
            movePage(true);
        };

        const showAddBtn = computed(() => offset.value > 0);

        watch(characterId, () => {
            movePage();
        })

        watch(rankingType, () => {
            movePage();
        })

        watch(list, () => {
            list.value.map(data => {
                data.winRatio = Math.round((data.winCount / (data.winCount + data.loseCount) * 10000)) / 100;
                return data;
            })
        })

        onIonViewWillEnter(() => {
            characterId.value = route.params.characterId as string;
            rankingType.value = route.params.rankingType as RankingType;

            characterGrid.value.map((row: any[]) => {
                row.map(data => {
                    if (data.characterId === characterId.value) {
                        data.class = 'active';
                        data.color = 'primary';
                    } else {
                        data.class = '';
                        data.color = 'medium';
                    }
                    return data;
                })
                return row;
            })

            rankingTypes.value.map(data => {
                data.color = data.typeEng === rankingType.value ? '' : 'medium';
                return data;
            })

            if (route.params.searchWord !== searchWord.value) searchWord.value = route.params.searchWord as string;
            if (Common.isNull(list.value)) {
                if (Common.isNull(searchWord.value)) {
                    getRanking(true);
                } else {
                    searchRanking();
                }
            }
        })

        onBeforeUnmount(() => {
            abortController.abort();
        })

        return {
            NeopleApi,
            Common,
            characterGrid,
            rankingTypes,
            search,
            refresh,
            searchWord,
            list,
            modules: [Pagination],
            showAddBtn,
            rankingType,
            characterClick,
            rankingTypeClick,
            onSwiper,
            getRanking,
            enter,
            searchBtnClick
        }
    },
})
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

img {
    filter: grayscale(1);
    width: 100% !important;
}

.active img {
    filter: grayscale(0);
}

.character-grid {
    margin: 5px;
}

.character-row {
    margin-bottom: 5px;
}

.character-name {
    font-size: 16px;
}
</style>