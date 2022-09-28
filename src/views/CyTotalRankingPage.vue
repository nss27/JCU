<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>통합랭킹</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="getRanking(true)">
                        <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
                <ion-searchbar placeholder="닉네임을 입력하세요" v-model="searchWord" @keypress="enter($event)"></ion-searchbar>
                <ion-buttons slot="end">
                    <ion-button @click="searchBtnClick()">
                        <ion-icon slot="icon-only" :icon="search"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <NoDataVue v-if="Common.isNull(list)"></NoDataVue>
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
                        </ion-label>
                        <ion-note slot="end" color="primary">{{data.ratingPoint}}점</ion-note>
                    </ion-item>
                </ion-list>
                <ion-button expand="block" @click="getRanking()" v-if="showAddBtn">더보기</ion-button>
            </template>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonText,
    IonSearchbar,
    IonIcon,
    IonButton,
    loadingController,
    alertController,
    onIonViewWillEnter
} from '@ionic/vue';
import { refresh, search } from 'ionicons/icons';
import NeopleApi from '@/utils/NeopleApi';
import Common from '@/utils/Common';
import NoDataVue from '@/components/NoData.vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonList,
        IonItem,
        IonNote,
        IonLabel,
        IonText,
        IonIcon,
        IonSearchbar,
        IonButton,
        NoDataVue
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const list = ref<any[]>([]);
        const offset = ref(0);
        const searchWord = ref('');

        const getRanking = async (refresh?: boolean) => {
            if (!Common.isNull(refresh) && refresh) {
                list.value = [];
                offset.value = 0;
                searchWord.value = '';
            }

            const loading = await loadingController.create({
                message: '데이터 조회중',
                mode: 'ios'
            })

            await loading.present();

            try {
                const data = await NeopleApi.cyTotalRanking({ offset: offset.value });

                if (Common.isNull(data.rows)) {
                    list.value = [];
                    offset.value = 0;
                } else {
                    list.value.push(...data.rows);
                    offset.value += 10;
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
            }
        };

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

                        const playerIdJson = await NeopleApi.cyPlayerId({
                            nickname: encodeURI(nicknames[i]),
                        });

                        if (!Common.isNull(playerIdJson.rows)) {

                            const data = await NeopleApi.cyTotalRanking({
                                playerId: playerIdJson.rows[0].playerId
                            });

                            playerRankings.push(...data.rows);
                        }
                    }

                    list.value = playerRankings;
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
                }
            }
        }

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
                    path: `/totalRanking/${encodeURI(word)}`
                })
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

        const showAddBtn = computed(() => offset.value > 0);

        onIonViewWillEnter(() => {
            if (route.params.searchWord !== searchWord.value) searchWord.value = route.params.searchWord as string;
            if (Common.isNull(list.value)) {
                if (Common.isNull(searchWord.value)) {
                    getRanking(true);
                } else {
                    searchRanking();
                }
            }
        });

        return {
            Common,
            refresh,
            search,
            list,
            searchWord,
            showAddBtn,
            getRanking,
            searchRanking,
            enter,
            searchBtnClick
        }
    },
})
</script>

<style scoped>

</style>