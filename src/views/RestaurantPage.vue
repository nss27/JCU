<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>{{ storeInfo['store-name'] }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <KakaoMap height="50%" level="3" :center="storeInfo['store-position']" :markerOptions="storeMarkerOptions"
                v-if="storeInfo['store-position']">
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
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonText } from '@ionic/vue'
import KakaoMap from '@/components/KakaoMap.vue';
import Common from '@/utils/Common';
import GoogleApi from '@/utils/GoogleApi';
import { useRoute } from 'vue-router';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonText,
        KakaoMap
    },
    setup() {
        const route = useRoute();
        let storeInfo = ref({} as any);
        const storeMarkerOptions = computed(() => Common.isNull(storeInfo.value['store-marker-option']) ? [] : [storeInfo.value['store-marker-option']]);
        const storeAddress = computed(() => Common.isNull(storeInfo.value['store-address']) ? '조회된 주소가 없습니다' : storeInfo.value['store-address']);

        onMounted(async () => {
            const list = await GoogleApi.getSingleSheetData('맛집정보') as any[];
            const index = list.findIndex(item => item.no == route.params.no);
            storeInfo.value = ref(list[index]).value;

            if (!Common.isNull(storeInfo.value['store-address'])) {
                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(storeInfo.value['store-address'], (result: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        storeInfo.value['store-position'] = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                        storeInfo.value['store-marker-option'] = {
                            position: storeInfo.value['store-position'],
                            image: new window.kakao.maps.MarkerImage(`assets/images/${storeInfo.value['marker-img']}`, new window.kakao.maps.Size(22, 22), { offset: new window.kakao.maps.Point(11, 11) }),
                            title: storeInfo.value['no'],
                            content: `<div class="name-tag">${storeInfo.value['store-name']}</div>`,
                            yAnchor: -0.75
                        }
                    }
                });
            }
        });

        return {
            storeInfo,
            storeMarkerOptions,
            storeAddress
        }
    }
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