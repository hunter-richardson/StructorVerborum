<script lang='ts'>
  import { defineModel, defineProps, defineComponent } from 'vue'
  import specere from '../specere.vue'
  import seligere from '../seligere.vue'
  import onerare from '../onerare.vue'
  import gustulare from '../gustulare.vue'
  import Gustulus from '../../scriptura/gustulus'
  import { type Columnae, erigantur } from '../../scriptura/columnae'
  import { AdverbiumAgendum } from '../../praebeunda/agenda'
  import { Adverbium } from '../../praebeunda/verba'
  import Cocutor from '../../miscella/cocutor'
  import Tabula from '../../tabulae/tabula'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { anglicum } from '../../miscella/enumerationes'

  const agendum: AdverbiumAgendum = defineProps<{ agendum: AdverbiumAgendum }>().agendum;

  const columnae: Columnae<Adverbium> = erigantur<Adverbium>([ 'gradus', 'scriptum' ]);
  const adverbium: Adverbium | undefined = defineModel<Adverbium>().value;
  const tabula: Tabula<Adverbium> | null = agendum.putetur();
  const adverbia: Adverbium[] = await tabula?.tabulentur() ?? [];
  const anglica: boolean = Cocutor.se.ipse().edatur('lingua') === 'anglica';

  export default defineComponent({
    components: { gustulare, specere, seligere, onerare },
    data(): {
      gustulus: Gustulus,
      adverbia: Adverbium[],
      adverbium: Adverbium | undefined,
      columnae: Columnae<Adverbium>,
      onerans: boolean,
      anglica: boolean
    } {
      return {
        gustulus: new Gustulus({}),
        adverbia: adverbia,
        adverbium: adverbium,
        columnae: columnae,
        anglica: anglica,
        onerans: true
      };
    }, methods: {
      async omnia(): Promise<Adverbium[]> {
        return await tabula?.tabulentur() ?? [];
      }, async cole(selecta: string[]): Promise<void> {
        this.onerans = true;
        const omnia: Adverbium[] = await this.omnia();
        if (omnia) {
          this.adverbia = omnia.filter(adverbium => selecta.every(selectum =>
            adverbium.valores().includes(selectum)));
        }

        return new Promise(() => this.onerans = false);
      }
    }
  });
</script>

<template lang='vue'>
  <gustulare :gustulsu='gustulus' />
  <template v-if='adverbium'>
    <specere :verbum='adverbium' @blur='adverbium = undefined;' />
  </template>
  <template v-else>
    <seligere :multiplicia='adverbia' :selectum='cole' />
    <v-data-table :items='adverbia' :headers='columnae' density='compact'
                  :loading='onerans' :disabled='onerans' id='tabula'
                  items-per-page='10' item-selectable=false>
      <onerare :onerans='onerans' pittacium='adverbia' />
      <template v-if='!onerans'>
        <v-btn v-for'hoc in adverbia' :key='hoc'
               :text="anglica ? 'Inflect' : 'Inflecte'" append-icon='open_in_full'
               :id='`selige_${hoc.unicum.toString()}`' @click='adverbium = hoc;' />
      </template>
  </v-data-table>
  </template>
</template>