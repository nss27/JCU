<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>경기결과</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            {{ gameInfo }}
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent
} from '@ionic/vue';
import NeopleApi from '@/utils/NeopleApi';
import { useRoute } from 'vue-router';

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
        const gameInfo = ref();

        const route = useRoute();

        const getMatchesInfo = async () => {
            gameInfo.value = await NeopleApi.cyPlayerMatchesInfo({
                matchId: route.params.matchId as string
            });
            console.log(gameInfo.value);
        };

        getMatchesInfo();

        return {
            gameInfo
        }
    },
})
</script>

<style scoped>

</style>