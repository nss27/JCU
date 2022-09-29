<template>
    <ion-app>
        <ion-router-outlet mode="ios" />
    </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { ComponentInternalInstance, defineComponent, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'App',
    components: {
        IonApp,
        IonRouterOutlet
    },
    setup() {
        const router = useRouter();
        const app = getCurrentInstance() as ComponentInternalInstance;

        app.appContext.config.globalProperties.rootIndex = router.options.history.state.position;
    }
});
</script>