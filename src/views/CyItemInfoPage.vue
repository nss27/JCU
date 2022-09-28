<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>아이템정보</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-list v-if="itemInfo" lines="none">
                <ion-item>
                    <ion-thumbnail slot="start">
                        <img :src="`${NeopleApi.cyitemsUrl}/${itemInfo.itemId}`">
                    </ion-thumbnail>
                    <ion-label>
                        <h1 class="ion-no-margin">{{itemInfo.itemName}}</h1>
                        <p class="ion-no-margin">{{itemInfo.slotName}}</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <div style="white-space: pre-wrap;">{{explain}}</div>
                    </ion-label>
                </ion-item>
            </ion-list>
            <ion-button expand="block" @click="detailView()">{{btnName}}</ion-button>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import {
    IonPage,
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
        IonButton,
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
        const itemId = route.params.itemId as string;
        const itemInfo = ref();
        const detail = ref(false);

        const explain = computed(() => {
            if (detail.value) {
                return itemInfo.value.explainDetail;
            } else {
                return itemInfo.value.explain;
            }
        })

        const btnName = computed(() => detail.value ? '간략히보기' : '자세히보기');

        const detailView = () => {
            detail.value = !detail.value;
        }

        onMounted(async () => {
            const loading = await loadingController.create({
                message: "데이터 조회중",
                mode: "ios",
            });

            await loading.present();

            try {
                itemInfo.value = await NeopleApi.cyItemsInfo({ itemId: itemId });
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
        })

        return {
            itemInfo,
            NeopleApi,
            detailView,
            explain,
            btnName
        }
    },
})
</script>

<style scoped>

</style>