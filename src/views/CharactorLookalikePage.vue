<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>캐릭터 닮은꼴</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <video ref="viewer" class="viewer"></video>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
} from '@ionic/vue'

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonButtons,
        IonToolbar,
        IonTitle,
        IonBackButton,
        IonContent,
    },
    setup() {
        const constraints = {
            audio: false,
            video: true
        };
        const viewer = ref({} as HTMLVideoElement);

        onMounted(() => {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream: MediaStream) => {
                    viewer.value.srcObject = stream;

                    viewer.value.onloadedmetadata = () => {
                        viewer.value.play();
                    };
                });
        });

        onBeforeUnmount(() => {
            const stream = viewer.value.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });

            viewer.value.srcObject = null;
            viewer.value.pause();
        });

        return {
            viewer
        }
    },
})
</script>

<style scoped>
.viewer {
    width: 100%;
    transform: rotateY(180deg);
}
</style>