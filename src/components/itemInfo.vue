<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>아이템정보</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="dismiss()">close</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content>
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
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs } from 'vue'
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
    props: ['itemId'],
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
        const { itemId } = toRefs(props);
        const itemInfo = ref();
        const detail = ref(false);

        const dismiss = async () => {
            await modalController.dismiss();
        };

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

            loading.present();

            try {
                itemInfo.value = await NeopleApi.cyItemsInfo({ itemId: itemId.value });
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
            itemInfo,
            NeopleApi,
            dismiss,
            detailView,
            explain,
            btnName
        }
    },
})
</script>

<style scoped>

</style>