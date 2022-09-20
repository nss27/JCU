<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>특성정보</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="dismiss()">close</ion-button>
            </ion-buttons>
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue'
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    loadingController,
    alertController,
    IonLabel,
    IonThumbnail,
    modalController,
    IonTitle
} from '@ionic/vue';
import NeopleApi from '@/utils/NeopleApi';

export default defineComponent({
    props: ['attributeId'],
    components: {
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonThumbnail,
        IonTitle
    },
    setup(props) {
        const { attributeId } = toRefs(props);
        const positionInfo = ref();

        const dismiss = async () => {
            await modalController.dismiss();
        };

        onMounted(async () => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            loading.present();

            try {
                positionInfo.value = await NeopleApi.cyPositionInfo({ attributeId: attributeId.value });
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
            dismiss,
        }
    },
})
</script>

<style scoped>

</style>