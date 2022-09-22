<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>경기결과</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list v-if="gameInfo" lines="none">
        <template v-for="(player, index) in players" :key="index">
          <ion-item :color="player.gameResult" :id="player.playerId">
            <ion-thumbnail slot="start">
              <img :src="`${NeopleApi.cyCharactersUrl}/${player.playInfo.characterId}`" />
              <img :src="NeopleApi.getPositionImage(player.position.name)" class="position-icon" />
            </ion-thumbnail>
            <ion-label>
              <h1 class="ion-no-margin">
                <strong>{{ player.nickname }}</strong>
              </h1>
              <div>
                [{{ randomText(player.playInfo.random) }}] {{ player.playInfo.characterName }} Lv.{{
                player.playInfo.level }}
              </div>
            </ion-label>
          </ion-item>

          <ion-item v-if="player.playInfo.partyUserCount > 0" :color="player.gameResult">
            <div>
              <ion-chip v-for="(partyInfo, index) in getParty({...player.playInfo, playerId: player.playerId})"
                :key="index" color="dark" @click="moveToId(partyInfo.playerId)">
                <ion-avatar>
                  <img :src="`${NeopleApi.cyCharactersUrl}/${partyInfo.playInfo.characterId}`">
                </ion-avatar>
                <ion-label>{{partyInfo.nickname}}</ion-label>
              </ion-chip>
            </div>
          </ion-item>

          <ion-item lines="inset">
            <ion-grid>
              <ion-row>
                <ion-col>
                  K: {{ player.playInfo.killCount }}
                </ion-col>
                <ion-col>
                  D: {{ player.playInfo.deathCount }}
                </ion-col>
                <ion-col>
                  A: {{ player.playInfo.assistCount }}
                </ion-col>
                <ion-col size="5">
                  KDA: {{ gameKDA(player.playInfo.killCount, player.playInfo.deathCount, player.playInfo.assistCount) }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>

          <ion-item lines="inset">
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-text color="medium">공격량</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.attackPoint) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">피해량</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.damagePoint) }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  <ion-text color="medium">전투참여</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.battlePoint) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">시야확보</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.sightPoint) }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  <ion-text color="medium">힐량</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.healAmount) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">타워공격</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.towerAttackPoint) }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  <ion-text color="medium">획득코인</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.getCoin) }}
                </ion-col>
                <ion-col>
                  <ion-text color="medium">도핑코인</ion-text>
                </ion-col>
                <ion-col>
                  {{ commaFormat(player.playInfo.spendConsumablesCoin) }}
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="3">
                  <ion-text color="medium">총 CS</ion-text>
                </ion-col>
                <ion-col>
                  {{ getCSCount({...player.playInfo}) }}
                </ion-col>
                <!-- <ion-col>
                  <ion-text color="medium">분당 CS</ion-text>
                </ion-col>
                <ion-col>
                  {{ getCSCount({...player.playInfo}) }}
                </ion-col> -->
              </ion-row>
            </ion-grid>
          </ion-item>

          <ion-item lines="inset">
            <ion-label>
              <ion-text color="medium">특성</ion-text>
              <div class="position-box">
                <img v-for="(position, index) in player.position.attribute" :key="index"
                  :src="`${NeopleApi.cyPositionAttributesUrl}/${position.id}`" @click="getPositionInfo(position.id)">
              </div>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <ion-text color="medium">아이템</ion-text>
              <div class="item-box">
                <div v-for="(item, index) in player.items" :key="index"
                  :class="[`item-${item.slotCode}`, getSeason(item.itemName)]" @click="getItemInfo(item.itemId)">
                  <img :src="`${NeopleApi.cyitemsUrl}/${item.itemId}`">
                </div>
              </div>
            </ion-label>
          </ion-item>
        </template>
      </ion-list>
      <template v-else>
        <NoData></NoData>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  loadingController,
  alertController,
  IonList,
  IonItem,
  IonChip,
  IonAvatar,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  IonText
} from "@ionic/vue";
import NeopleApi from "@/utils/NeopleApi";
import { useRoute, useRouter } from "vue-router";
import Common from "@/utils/Common";
import NoData from "@/components/NoData.vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    NoData,
    IonList,
    IonItem,
    IonChip,
    IonAvatar,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonText
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const gameInfo = ref();

    const randomText = (random: boolean) => (random ? "랜덤" : "선택");

    const players = computed(() => {
      let result = [] as any[];

      if (!Common.isNull(gameInfo.value)) {
        (gameInfo.value.teams as any[]).forEach((team) => {
          (team.players as string[]).forEach((playerId) => {
            result.push({
              gameResult: team.result,
              ...(gameInfo.value.players as any[]).filter(
                (info) => info.playerId === playerId
              )[0],
            });
          });
        });
      }

      return result.sort((a) => (a.gameResult === "win" ? -1 : 1));
    });

    const getItemInfo = async (itemId: string) => {
      router.push({
        path: `/itemInfo/${itemId}`
      });
    }

    const getParty = (data: { partyUserCount: number, partyId: string, playerId: string }) => {
      let players = [];

      if (data.partyUserCount > 0) {
        players = [...gameInfo.value.players].filter(player => player.playInfo.partyId === data.partyId && player.playerId !== data.playerId);
      }

      return players;
    }

    const gameKDA = (
      killCount: number,
      deathCount: number,
      assistCount: number
    ) => {
      if (deathCount > 0) {
        return Math.round(((killCount + assistCount) / deathCount) * 100) / 100;
      } else {
        return "PERFECT";
      }
    };

    const getSeason = (itemName: string) => {
      let season = itemName.substring(0, 1);
      if (['E', 'S'].includes(season)) {
        return `season-${season}`;
      } else {
        return null;
      }
    };

    const getPositionInfo = (attributeId: string) => {
      router.push({
        path: `/positionInfo/${attributeId}`
      });
    }

    const commaFormat = (data: string | number) => {
      let list = [...String(data)];
      if (list.length > 3) {
        list = list.reverse().map((val, i) => (i + 1) % 3 === 0 ? `,${val}` : val).reverse();
      }
      return list.join('');
    };

    const getCSCount = (data: { sentinelKillCount: number, demolisherKillCount: number }) => commaFormat(data.sentinelKillCount + data.demolisherKillCount);

    const moveToId = (playerId: string) => {
      router.replace({
        hash: `#${playerId}`
      })
    }

    onMounted(async () => {
      const loading = await loadingController.create({
        message: "데이터 조회중",
        mode: "ios",
      });

      loading.present();

      try {
        gameInfo.value = await NeopleApi.cyPlayerMatchesInfo({
          matchId: route.params.matchId as string,
        });
      } catch (error) {
        const alert = await alertController.create({
          header: "오류 발생",
          subHeader: `${error}`,
          buttons: ["OK"],
          mode: "ios",
        });

        await alert.present();
      } finally {
        loading.dismiss();
      }
    });

    return {
      gameInfo,
      NeopleApi,
      randomText,
      players,
      getItemInfo,
      getParty,
      gameKDA,
      getSeason,
      getPositionInfo,
      commaFormat,
      getCSCount,
      moveToId
    };
  },
});
</script>

<style scoped>
ion-thumbnail {
  position: relative;
}

.position-icon {
  --size: 36px;

  position: absolute;
  width: var(--size);
  height: var(--size);
  bottom: -10px;
  right: -16px;
}

.item-box,
.position-box {
  margin-top: 10px;
}

.item-box {
  display: grid;
  grid-template-areas:
    '101 102 103 104 105 106 202 203'
    '301 302 303 304 305 107 204 205';
}

.item-box>div {
  margin-bottom: -4px;
}

.item-box .item-101 {
  grid-area: '101';
}

.item-box .item-102 {
  grid-area: '102';
}

.item-box .item-103 {
  grid-area: '103';
}

.item-box .item-104 {
  grid-area: '104';
}

.item-box .item-105 {
  grid-area: '105';
}

.item-box .item-106 {
  grid-area: '106';
}

.item-box .item-202 {
  grid-area: '202';
}

.item-box .item-203 {
  grid-area: '203';
}

.item-box .item-301 {
  grid-area: '301';
}

.item-box .item-302 {
  grid-area: '302';
}

.item-box .item-303 {
  grid-area: '303';
}

.item-box .item-304 {
  grid-area: '304';
}

.item-box .item-305 {
  grid-area: '305';
}

.item-box .item-107 {
  grid-area: '107';
}

.item-box .item-204 {
  grid-area: '204';
}

.item-box .item-205 {
  grid-area: '205';
}

.position-box {
  display: flex;
}

.season-E::before {
  content: 'E';
}

.season-S::before {
  content: 'S';
}

.season-E::before,
.season-S::before {
  position: absolute;
  padding: 0 5px;
  background-color: #000000;
  color: #ffffff;
}
</style>
