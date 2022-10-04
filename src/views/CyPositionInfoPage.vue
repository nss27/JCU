<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>특성정보</ion-title>
                <ion-buttons slot="end">
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
    alertController,
    IonLabel,
    IonThumbnail,
    IonTitle,
    IonBackButton
} from '@ionic/vue';
import NeopleApi from '@/utils/NeopleApi';
import { useRoute } from 'vue-router';
import HomeButtonVue from '@/components/HomeButton.vue';

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
        HomeButtonVue
    },
    setup() {
        const abortController = new AbortController();
        const route = useRoute();
        const attributeId = route.params.attributeId as string;

        const positionInfo = ref();

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

        onMounted(async () => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            await loading.present();

            try {
                positionInfo.value = await NeopleApi.cyPositionInfo({ attributeId: attributeId }, { signal: abortController.signal });
            } catch (err: any) {
                errorHanbler(err);
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