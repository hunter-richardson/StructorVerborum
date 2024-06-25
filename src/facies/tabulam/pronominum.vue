<script lang='ts'>
  import { defineModel, defineComponent, defineProps } from 'vue'
  import specere from '../specere.vue'
  import seligere from '../seligere.vue'
  import onerare from '../onerare.vue'
  import gustulare from '../gustulare.vue'
  import Gustulus from '../../scriptura/gustulus'
  import { type Columnae, erigantur } from '../../scriptura/columnae'
  import { Pronomen } from '../../praebeunda/verba'
  import { Mantela } from '../../anomala/anomala'
  import Cocutor from '../../miscella/cocutor'
  import Tabula from '../../tabulae/tabula'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { anglicum } from '../../miscella/enumerationes'

  const agendum: Mantela<Pronomen> = defineProps<{ agendum: Mantela<Pronomen> }>().agendum;

  const columnae: Columnae<Pronomen> = erigantur<Pronomen>([ 'genus', 'numerus', 'casus', 'scriptum' ]);
  const pronomen: Pronomen | undefined = defineModel<Pronomen>().value;
  const tabula: Tabula<Pronomen> | null = agendum.putetur();
  const pronomina: Pronomen[] = await tabula?.tabulentur() ?? [];
  const anglica: boolean = Cocutor.se.ipse().edatur('lingua') === 'anglica';

  export default defineComponent({
    components: { gustulare, specere, onerare, seligere },
    data(): {
      gustulus: Gustulus,
      pronomina: Pronomen[],
      pronomen: Pronomen | undefined,
      columnae: Columnae<Pronomen>,
      onerans: boolean,
      anglica: boolean
    } {
      return {
        gustulus: new Gustulus({}),
        pronomina: pronomina,
        pronomen: pronomen,
        columnae: columnae,
        anglica: anglica,
        onerans: true
      };
    }, methods: {
      async omnia(): Promise<Pronomen[]> {
        return await tabula?.tabulentur() ?? [];
      }, async cole(selecta: string[]): Promise<void> {
        this.onerans = true;
        const omnia: Pronomen[] = await this.omnia();
        if (omnia) {
          this.pronomina = omnia.filter(pronomen => selecta.every(selectum =>
              pronomen.valores().includes(selectum)));
        }
        return new Promise(() => this.onerans = false);
      }
    }
  });
</script>

<template>
  <gustulare :gustulus='gustulus' />
  <template v-if='pronomen'>
    <specere :verbum='pronomen' @blur='pronomen = undefined;' />
  </template>
  <template v-else>
    <seligere :multiplicia='pronomina' :selectum='cole' />
    <v-data-table :items='pronomina' :headers='columnae' density='compact'
                  :loading='onerans' :disabled='onerans' id='tabula'
                  items-per-page='10' item-selectable=false>
      <onerare :onerans='onerans' pittacium='pronomina' />
      <template v-if='!onerans'>
        <v-btn v-for='hoc in pronomina' :key='hoc'
               :text="anglica ? 'Inflect' : 'Inflecte'" append-icon='open_in_full'
               :id='`selige_${hoc.unicum.toString()}`' @click='pronomen = hoc' />
      </template>
  </v-data-table>
  </template>
</template>