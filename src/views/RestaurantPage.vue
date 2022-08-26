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
        <KakaoMap height="50%" level="3" :center="storeInfo['store-position']" delay="500"
            :markerOptions="storeMarkerOptions" v-if="storeInfo['store-position']">
        </KakaoMap>
        <ion-list lines="none">
            <ion-item>
                <ion-label class="ion-text-wrap">
                    <ion-text color="primary">
                        <p>{{ storeInfo['hashtag'] }}</p>
                    </ion-text>
                    <br>
                    <h1>주소</h1>
                    <p>{{ storeAddress }}</p>
                </ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, modalController, IonList, IonItem, IonLabel, IonText } from '@ionic/vue'
import KakaoMap from '@/components/KakaoMap.vue';
import Common from '@/utils/Common';

export default defineComponent({
    props: ['storeInfo'],
    components: {
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonText,
        KakaoMap
    },
    methods: {
        close() {
            modalController.dismiss();
        }
    },
    computed: {
        storeMarkerOptions(): any[] {
            return Common.isNull(this.storeInfo['store-marker-option']) ? [] : [this.storeInfo['store-marker-option']];
        },
        storeAddress() {
            return Common.isNull(this.storeInfo['store-address']) ? '조회된 주소가 없습니다' : this.storeInfo['store-address'];
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