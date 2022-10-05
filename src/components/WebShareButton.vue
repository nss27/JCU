<template>
    <ion-button @click="shareBtnClick()">
        <ion-icon slot="icon-only" :icon="shareSocial"></ion-icon>
    </ion-button>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { IonButton, IonIcon } from '@ionic/vue';
import { shareSocial } from 'ionicons/icons';
import Common from '@/utils/Common';

export default defineComponent({
    props: ['shareData'],
    components: {
        IonButton,
        IonIcon
    },
    setup(props) {
        const { shareData } = toRefs(props);

        const shareBtnClick = async () => {
            if (Common.isNull(shareData.value)) {
                await navigator.share({
                    url: location.pathname
                });
            } else {
                await navigator.share(shareData.value);
            }
        }

        return {
            shareSocial,
            shareBtnClick
        }
    },
})
</script>

<style scoped>

</style>