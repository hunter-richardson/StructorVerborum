<script lang='ts'>
  import { defineModel, defineProps, defineComponent, type ComponentOptionsWithoutProps } from 'vue';
  import specere from '../specere.vue';
  import onerare from '../onerare.vue';
  import seligere from '../seligere.vue';
  import inflectere from '../inflectere.vue';
  import gustulare from '../gustulare.vue';
  import Gustulus from '../../scriptura/gustulus';
  import { type Columnae, categoricum } from '../../scriptura/columnae';
  import { NomenActum } from '../../praebeunda/agenda';
  import type { Faciendum } from '../../praebeunda/interfecta';
  import { Nomen, Actus } from '../../praebeunda/verba';
  import Cocutor from '../../miscella/cocutor';
  import Tabula from '../../tabulae/tabula';

  const agendum: Faciendum<Nomen> = defineProps<{ agendum: Faciendum<Nomen>; }>().agendum;

  const anglica: boolean = Cocutor.se.ipse().edatur('lingua') === 'anglica';
  const tabula: Tabula<Nomen> | null = agendum.putetur();

  const nomen: Nomen | undefined = defineModel<Nomen>().value;
  const actus: Faciendum<Actus> | undefined = defineModel<Faciendum<Actus>>().value;
  const actum: boolean = agendum instanceof NomenActum;

  const componenta: ComponentOptionsWithoutProps = {
    'inflectere': inflectere,
    'gustulare': gustulare,
    'seligere': seligere,
    'specere': specere,
    'onerare': onerare
  };

  const data = (): {
    actus: Faciendum<Actus> | undefined,
    agendum: Faciendum<Nomen>,
    nomen: Nomen | undefined,
    columnae: Columnae,
    gustulus: Gustulus,
    onerans: boolean,
    anglica: boolean,
    nomina: Nomen[],
    actum: boolean
  } => {
    return {
      gustulus: new Gustulus({}),
      agendum: agendum,
      anglica: anglica,
      onerans: true,
      nomen: nomen,
      actus: actus,
      actum: actum,
      columnae: [],
      nomina: [],
    };
  };

  export default defineComponent({
    components: componenta, data: data,
    methods: {
      async omnia (): Promise<Nomen[]> {
        return await tabula?.tabulentur() ?? [];
      }, async oneratust (): Promise<void> {
        return new Promise(() => this.onerans = false);
      }, async cole (selecta: string[]): Promise<void> {
        this.onerans = true;
        const omnia: Nomen[] = await this.omnia();
        if (omnia) {
          this.nomina = omnia.filter(nomen => selecta.every(selectum =>
            nomen.valores().includes(selectum)));
        }

        return this.oneratust();
      }, async refer(): Promise<void> {
        this.actus = await (agendum as NomenActum).actus() ?? undefined;
      }
    }, async mounted (): Promise<void> {
      this.nomina = await this.omnia();
      this.columnae = categoricum<Nomen>({
        categoria: 'nomen',
        haec: this.nomina as Nomen[]
      });

      return this.oneratust();
    }
  });
</script>

<template lang='vue'>
	<gustulare :gustulus='gustulus' />
	<specere v-if='nomen' :verbum='nomen' @blur='nomen = undefined;' />
  <inflectere v-else-if='actus' :agendum='actus' @blur='actus = undefined;' />
	<template v-else>
		<seligere :multiplicia='nomina' :selectum='cole' />
		<v-data-table :items='adiectiva' :headers='columnae' density='compact' :loading='onerans' :disabled='onerans'
			id='tabula' items-per-page='10' item-selectable=false>
			<onerare :onerans='onerans' pittacium='nomina' />
			<template v-if='!onerans'>
				<v-btn v-for='hoc in nomina' :key='hoc.unicum' :text="anglica ? 'Inflect' : 'Inflecte'"
					append-icon='open_in_full' :id='`selige_${hoc.unicum.toString()}`' @click='nomen = hoc;' />
			</template>
    </v-data-table>
    <v-btn v-if='actum' :text="anglica ? 'Verb' : 'Actus'" append-icon='sprint'
           id='actus' @click='refer()' />
  </template>
</template>
