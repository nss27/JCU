<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>투신전 랭킹</ion-title>
                <ion-buttons slot="end">
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <no-data-vue text="서비스 준비중..."></no-data-vue>
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
import HomeButtonVue from '@/components/HomeButton.vue';

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        NoDataVue,
        HomeButtonVue
    },
    // setup() {

    // },
})
</script>

<style scoped>

</style>