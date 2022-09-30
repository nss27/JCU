<template>
    <ion-button @click="goHome()">
        <ion-icon slot="icon-only" :icon="homeOutline"></ion-icon>
    </ion-button>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import {
    IonButton,
    IonIcon
} from '@ionic/vue';
import { homeOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
    components: {
        IonButton,
        IonIcon
    },
    setup() {
        const router = useRouter();
        const rootIndex = inject<number>('rootIndex');

        const goHome = () => {
            const index = (router.options.history.state.position as number) - (rootIndex as number);
            router.go(index * -1);
        };

        return {
            homeOutline,
            goHome
        }
    },
})
</script>

<style scoped>

</style>