<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>매칭기록</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            {{ text }}
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent
} from '@ionic/vue';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent
    },
    setup() {
        let text = '서비스 준비중...';

        return {
            text
        }
    },
})
</script>

<style scoped>

</style>