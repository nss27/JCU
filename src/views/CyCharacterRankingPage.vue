<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>캐릭터 랭킹</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <NoDataVue text="서비스 준비중..."></NoDataVue>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
} from '@ionic/vue';
import NoDataVue from '@/components/NoData.vue';

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        NoDataVue
    },
    // setup() {

    // },
})
</script>

<style scoped>

</style>