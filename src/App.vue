<template>
    <ion-app>
        <ion-router-outlet mode="ios" />
    </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, provide } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'App',
    components: {
        IonApp,
        IonRouterOutlet
    },
    setup() {
        const router = useRouter();
        provide('rootIndex', router.options.history.state.position);
    }
});
</script>