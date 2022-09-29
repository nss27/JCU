<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>{{ license.libraryName }}</ion-title>
                <ion-buttons slot="end">
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            {{ license._licenseContent }}
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
} from '@ionic/vue'
import OpenSourceLicense from '@/jsons/openSourceLicense.json'
import { useRoute } from 'vue-router'
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
        HomeButtonVue
    },
    setup() {
        const route = useRoute();
        const license = ref(OpenSourceLicense[Number(route.params.index)]);

        return {
            license
        }
    },
})
</script>

<style scoped>
ion-content {
    --padding-top: 30px;
    --padding-bottom: 30px;
    --padding-start: 20px;
    --padding-end: 20px;

    white-space: pre-wrap;
}
</style>