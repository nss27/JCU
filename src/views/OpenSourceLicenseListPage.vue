<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>open source list</ion-title>
                <ion-buttons slot="end">
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-list>
                <ion-item v-for="(license, index) in licenses" :key="index" button
                    :router-link="`/openSourceLicense/${index}`">
                    <ion-label>{{ license.libraryName }}</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
} from '@ionic/vue'
import OpenSourceLicense from '@/jsons/openSourceLicense.json'
import HomeButtonVue from '@/components/HomeButton.vue'

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonBackButton,
        IonList,
        IonItem,
        IonLabel,
        HomeButtonVue
    },
    setup() {
        const licenses = ref(OpenSourceLicense);

        return {
            licenses
        }
    },
})
</script>

<style scoped>

</style>