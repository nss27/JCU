<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>맛집지도</ion-title>
            </ion-toolbar>
            <ion-toolbar>
                <ion-searchbar v-model="sotreSearch" :debounce="250"></ion-searchbar>
            </ion-toolbar>
            <ion-toolbar>
                <ion-chip v-for="(item, index) in storeTypes" :key="index" :outline="!(item === storeTypeSearch)"
                    @click="() => storeTypeSearch = item">{{ item }}
                </ion-chip>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <template v-for="store in storeList" :key="store">
                <StoreCard v-if="store.show" :storeInfo="store" :router-link="`/restaurant/${store.no}`">
                </StoreCard>
            </template>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonBackButton, IonChip } from '@ionic/vue';
import { defineComponent, onMounted, ref, watch } from 'vue';
import StoreCard from '@/components/StoreCard.vue';
import GoogleApi from '@/utils/GoogleApi';

export default defineComponent({
    components: {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonSearchbar,
        IonButtons,
        IonBackButton,
        StoreCard,
        IonChip
    },
    setup() {
        const storeList = ref([] as any[]);
        const storeTypes = ['전체', '음식점', '카페'];
        const storeTypeSearch = ref('전체');
        const sotreSearch = ref('');

        const searchWordChange = () => {
            storeList.value.map(store => {
                const storeName = store['store-name'] as string;
                const storeType = store['store-type'] as string;

                switch (storeTypeSearch.value) {
                    case '전체':
                        store.show = storeName.includes(sotreSearch.value);
                        break;

                    default:
                        store.show = storeName.includes(sotreSearch.value) && storeType.includes(storeTypeSearch.value);
                        break;
                }

                return store;
            })
        };

        watch(sotreSearch, searchWordChange);
        watch(storeTypeSearch, searchWordChange);

        onMounted(async () => {
            storeList.value = ref(await GoogleApi.getSingleSheetData('맛집정보')).value;
            storeList.value.forEach(store => store.show = true);
        });

        return {
            storeList,
            storeTypes,
            storeTypeSearch,
            sotreSearch
        }
    }
});
</script>

<style scoped>
ion-searchbar {
    padding-top: 0;
    padding-bottom: 0;
}
</style>
