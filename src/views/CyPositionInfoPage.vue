<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>특성정보</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
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
import { defineComponent, onMounted, ref } from 'vue'
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
        IonBackButton
    },
    setup() {
        const route = useRoute();
        const attributeId = route.params.attributeId as string;
        const positionInfo = ref();

        onMounted(async () => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            loading.present();

            try {
                positionInfo.value = await NeopleApi.cyPositionInfo({ attributeId: attributeId });
            } catch (error) {
                const alert = await alertController.create({
                    header: "오류 발생",
                    subHeader: `${error}`,
                    buttons: ["OK"],
                    mode: "ios",
                });

                await alert.present();
            } finally {
                loading.dismiss();
            }
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