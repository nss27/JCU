<template>
    <ion-card>
        <img :src="`assets/images/${storeInfo['marker-img']}`" class="store-icon">
        <ion-card-header>
            <ion-card-subtitle>{{ storeInfo['store-type'] }}</ion-card-subtitle>
            <ion-card-title>{{ storeInfo['store-name'] }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <div class="hashtag">{{ storeInfo['hashtag'] }}</div>
        </ion-card-content>
    </ion-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue'

export default defineComponent({
    name: 'StoreCard',
    props: ['storeInfo'],
    components: {
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardSubtitle,
        IonCardTitle
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