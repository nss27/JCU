<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>특성정보</ion-title>
                <ion-buttons slot="end">
                    <web-share-button-vue></web-share-button-vue>
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-list v-if="positionInfo" lines="none">
                <ion-item>
                    <ion-thumbnail slot="start">
                        <img :src="`${NeopleApi.cyPositionAttributesUrl}/${positionInfo.attributeId}`">
                    </ion-thumbnail>
                    <ion-label>
                        <h1 class="ion-no-margin">{{positionInfo.attributeName}}</h1>
                        <p class="ion-no-margin">{{positionInfo.positionName}}</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <div style="white-space: pre-wrap;">{{positionInfo.explain}}</div>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    loadingController,
    IonLabel,
    IonThumbnail,
    IonTitle,
    IonBackButton
} from '@ionic/vue';
import NeopleApi from '@/utils/NeopleApi';
import { useRoute } from 'vue-router';
import HomeButtonVue from '@/components/HomeButton.vue';
import WebShareButtonVue from '@/components/WebShareButton.vue';
import Common from '@/utils/Common';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonThumbnail,
        IonTitle,
        IonBackButton,
        HomeButtonVue,
        WebShareButtonVue
    },
    setup() {
        const abortController = new AbortController();
        const route = useRoute();
        const attributeId = route.params.attributeId as string;

        const positionInfo = ref();

        onMounted(async () => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            await loading.present();

            try {
                positionInfo.value = await NeopleApi.cyPositionInfo({ attributeId: attributeId }, { signal: abortController.signal });
            } catch (err: any) {
                await Common.errorHandler(err);
            } finally {
                await loading.dismiss();
            }
        })

        onBeforeUnmount(() => {
            abortController.abort();
        })

        return {
            positionInfo,
            NeopleApi,
        }
    },
})
</script>

<style scoped>

</style>