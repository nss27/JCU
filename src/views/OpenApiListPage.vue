<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>open api list</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-card v-for="(openApi, index) in openApis" :key="index">
                <ion-grid>
                    <ion-row class="ion-align-items-center">
                        <ion-col>
                            <ion-text color="dark">{{ openApi.apiName }}</ion-text>
                        </ion-col>
                        <ion-col size="3" v-if="theme === 'light' && openApi.logo">
                            <img :src="openApi.logo">
                        </ion-col>
                        <ion-col size="3" v-if="theme === 'dark' && openApi['logo-dark-mode']">
                            <img :src="openApi['logo-dark-mode']">
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        <ion-col>
                            <ion-button expand="full" :href="openApi.homepage" target="_blank" class="ion-no-margin">
                                홈페이지
                            </ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button expand="full" :href="openApi.terms" target="_blank" class="ion-no-margin"
                                color="medium">
                                이용약관
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card>
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
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonText
} from '@ionic/vue'
import OpenApi from '@/jsons/openApi.json'

export default defineComponent({
    components: {
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonBackButton,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonCard,
        IonText
    },
    setup() {
        const openApis = ref(OpenApi);
        const theme = ref('');

        theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
            theme.value = e.matches ? 'dark' : 'light';
        });

        return {
            openApis,
            theme
        }
    },
})
</script>

<style scoped>
ion-text {
    font-size: 20px;
}
</style>