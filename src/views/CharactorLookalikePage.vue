<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>캐릭터 닮은꼴</ion-title>
                <ion-buttons slot="end">
                    <home-button-vue></home-button-vue>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <!-- <video ref="viewer" class="viewer"></video> -->
            <no-data-vue text="서비스 준비중..."></no-data-vue>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import {
    defineComponent,
    // onBeforeUnmount,
    // onMounted,
    // ref
} from 'vue'
import {
    IonPage,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
} from '@ionic/vue'
import NoDataVue from '@/components/NoData.vue';
import HomeButtonVue from '@/components/HomeButton.vue';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonButtons,
        IonToolbar,
        IonTitle,
        IonBackButton,
        IonContent,
        NoDataVue,
        HomeButtonVue
    },
    // setup() {
    //     const constraints = {
    //         audio: false,
    //         video: true
    //     };
    //     const viewer = ref({} as HTMLVideoElement);

    //     onMounted(() => {
    //         navigator.mediaDevices.getUserMedia(constraints)
    //             .then((stream: MediaStream) => {
    //                 viewer.value.srcObject = stream;

    //                 viewer.value.onloadedmetadata = () => {
    //                     viewer.value.play();
    //                 };
    //             });
    //     });

    //     onBeforeUnmount(() => {
    //         const stream = viewer.value.srcObject as MediaStream;
    //         const tracks = stream.getTracks();
    //         tracks.forEach(track => {
    //             track.stop();
    //         });

    //         viewer.value.srcObject = null;
    //         viewer.value.pause();
    //     });

    //     return {
    //         viewer
    //     }
    // },
})
</script>

<style scoped>
.viewer {
    width: 100%;
    transform: rotateY(180deg);
}
</style>