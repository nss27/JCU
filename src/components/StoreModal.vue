<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>{{ storeInfo['store-name'] }}</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="close()">Close</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <KakaoMap height="50%" level="3" :center="storeGps"></KakaoMap>
        <ion-card>
            <img :src="'assets/images/' + storeInfo['marker-img']" class="store-icon">
            <ion-card-header>
                <ion-card-subtitle>{{ storeInfo['store-type'] }}</ion-card-subtitle>
                <ion-card-title>{{ storeInfo['store-name'] }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <div class="hashtag">{{ storeInfo['hashtag'] }}</div>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, modalController } from '@ionic/vue'
import KakaoMap from '@/components/KakaoMap.vue';

export default defineComponent({
    name: 'StoreModal',
    props: ['storeInfo'],
    components: {
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardSubtitle,
        IonCardTitle,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonTitle,
        IonContent,
        KakaoMap
    },
    data() {
        return {
            storeGps: [] as number[]
        }
    },
    mounted() {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(this.storeInfo['store-address'], (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                this.storeGps = [result[0].y, result[0].x];
            }
        });
    },
    methods: {
        close() {
            modalController.dismiss();
        }
    },
})
</script>

<style scoped>
ion-card {
    min-height: 130px;
}

.store-icon {
    position: absolute;
    width: 140px;
    right: -30px;
    bottom: -30px;
    opacity: 0.25;
}

.hashtag {
    color: var(--ion-color-primary);
}
</style>