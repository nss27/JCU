<template>
  <ion-grid>
    <ion-row class="ion-align-items-center">
      <ion-col class="ion-text-center">{{ showText }}</ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import Common from "@/utils/Common";

export default defineComponent({
  props: ["text"],
  components: {
    IonGrid,
    IonRow,
    IonCol,
  },
  setup(props) {
    const { text } = toRefs(props);

    const showText = computed(() => Common.isNull(text.value) ? '조회된 데이터가 없습니다' : text.value);

    return {
      showText,
    };
  },
});
</script>

<style scoped>
ion-grid,
ion-row {
  height: 100%;
}
</style>
