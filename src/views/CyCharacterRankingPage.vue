<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>캐릭터 랭킹</ion-title>
                <ion-buttons slot="end">
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar v-if="false">
                <ion-buttons slot="start">
                    <ion-button @click="getRanking(true)">
                        <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-searchbar v-model="searchWord"></ion-searchbar>
                <ion-buttons slot="end">
                    <ion-button>
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
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
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
    alertController
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
        SwiperSlide
    },
    setup() {
        const rankingTypes = ref([
            {
                typeKor: '승리수',
                typeEng: 'winCount',
                color: ''
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
        const characterId = ref<string>(characters[0].characterId);
        const rankingType = ref<RankingType>(rankingTypes.value[0].typeEng as RankingType);
        const searchWord = ref<string>('');
        const list = ref<any[]>([]);
        const characterGrid = ref<any[]>([]);
        const offset = ref(0);

        let slides: any = null;
        let row: any[] = [];

        characters.forEach((data, i) => {
            row.push({
                ...data,
                class: i === 0 ? 'active' : '',
                color: i === 0 ? 'primary' : 'medium'
            });
            if ((i + 1) % 5 === 0) {
                characterGrid.value.push(row);
                row = [];
            }
        });

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
                })

                if (Common.isNull(data.rows)) {
                    list.value = [];
                    offset.value = 0;
                } else {
                    list.value = [...list.value, ...data.rows];
                    offset.value += data.rows.length < 10 ? 0 : 10;
                }
            } catch (error) {
                const alert = await alertController.create({
                    header: '오류 발생',
                    subHeader: `${error}`,
                    buttons: ['ok'],
                    mode: 'ios'
                })

                await alert.present();
            } finally {
                await loading.dismiss();
                slides.slideTo(1);
            }
        }

        const showAddBtn = computed(() => offset.value > 0);

        watch(characterId, () => {
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

            getRanking(true);
        })

        watch(rankingType, () => {
            rankingTypes.value.map(data => {
                data.color = data.typeEng === rankingType.value ? '' : 'medium';
                return data;
            })

            getRanking(true);
        })

        watch(list, () => {
            list.value.map(data => {
                data.winRatio = Math.round((data.winCount / (data.winCount + data.loseCount) * 10000)) / 100;
                return data;
            })
        })

        onMounted(() => {
            getRanking(true);
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
            getRanking
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