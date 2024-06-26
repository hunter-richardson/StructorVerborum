<script lang='ts'>
  import { defineComponent, defineModel, type ComponentOptionsWithoutProps } from 'vue';
  import Gustulus from '../scriptura/gustulus';
  import gustulare from './gustulare.vue';
  import { Verbum, Multiplex, Actus, Numerus } from '../praebeunda/verba';
  import Locutor from '../miscella/locutor';
  import inflectere from './inflectere.vue';
  import Cocutor from '../miscella/cocutor';
  import { Encliticum } from '../miscella/enumerationes';
  import type { Eventus } from '../miscella/dictionarium';
  import type { NumeramenAgendum } from '../praebeunda/agenda';

  const eventus: Eventus | undefined = defineModel<Eventus>('eventus').value;
  const lingua: string | undefined = Cocutor.se.ipse().edatur('lingua');
  const locutor: Locutor = Locutor.se.ipse();

  const verbum: Verbum | undefined = defineProps({ verbum: Verbum }).verbum;
  const enclitica: string[] = Object.keys(Encliticum)
    .filter(encliticum => !verbum?.scriptum.endsWith(encliticum));

  const componenta: ComponentOptionsWithoutProps = {
    'inflectere': inflectere,
    'gustulare': gustulare
  };

  const data = (): {
    eventus: Eventus | undefined,
    verbum: Verbum | undefined,
    propriabile: boolean,
    multiplex: boolean,
    valores: string[],
    enclitica: string[],
    encliticum: string,
    gustulus: Gustulus,
    anglica: boolean;
  } => {
    return {
      gustulus: new Gustulus({}),
      anglica: lingua === 'anglica',
      enclitica: enclitica,
      propriabile: false,
      multiplex: false,
      eventus: eventus,
      verbum: verbum,
      encliticum: '',
      valores: [],
    };
  };

  export default defineComponent({
    components: componenta, data: data,
    methods: {
      async aperi (): Promise<void> {
        switch (this.verbum?.categoria) {
          case 'actus': {
            const actus: Actus = this.verbum as Actus;
            if (actus.modus === 'participium') {
              this.eventus = {
                referendum: await actus.participialis(),
                categoria: 'adiectivum'
              };
            }

            break;
          }
          case 'numerus': {
            const numerus: Numerus = this.verbum as Numerus;
            const agendum: NumeramenAgendum | null = await numerus.numeramen();
            if (agendum) {
              this.eventus = {
                referendum: agendum,
                categoria: 'numeramen'
              };
            }
            break;
          }
        }
      }, adde (): void {
        if (verbum) {
          if ([ this.multiplex, this.encliticum ].all()) {
            (verbum as Multiplex).encliticum = this.encliticum;
          }

          locutor.addatur(verbum);
        }
      }, addeProprium (): void {
        if (verbum && this.propriabile) {
          verbum.scriptum = verbum.scriptum.capitalize();
        }

        this.adde();
      }
    }, mounted (): void {
      this.multiplex = verbum ? verbum instanceof Multiplex : false;
      this.valores = this.multiplex ? (verbum as Multiplex)?.valores() : [];

      this.propriabile = [
        this.multiplex, [
          'nomen', 'adiectivum'
        ].includes(verbum?.categoria ?? ''),
        !verbum?.scriptum.isCapitalized()
      ].all();
    }
  });
</script>

<template lang='vue'>
	<gustulare :gustulus='gustulus' />
	<template v-if='eventus'>
		<inflectere :eventus='eventus' @blur='eventus = undefined;' />
	</template>
  <v-dialog v-else-if='verbum'>
    <v-card :title='verbum.scriptum' :subtitle='verbum.categoria.capitalize()'>
      <template v-if='multiplex'>
        <v-chip-group>
          <v-chip v-for='valor in valores' :key='valor' :text='valor' :id="`valor_${valor}`"
                  selected-class='text-primary' prepend-icon='category' />
        </v-chip-group>
        <v-select density='compact' id='enclitica' v-model='encliticum'
                  :title="anglica ? 'Enclitics' : 'Enclitica'"
                  :items='enclitica' chips flat open-on-clear />
      </template>
      <v-btn-toggle>
        <template v-if='verbum.paratumne()'>
          <v-btn icon='chat_add_on' id='adde' @click='adde();'
                 :text="anglica ? 'Add this to my phrase' : 'Adde hoc locutioni'" />
        </template>
        <template v-if='propriabile'>
          <v-bnt icon='chat_add_on' id='addeProprium' @click='addeProprium();'
                 :text="anglica ? 'Add this to my phrase as a proper name' : 'Adde hoc locutioni ut proprium'" />
        </template>
        <template v-else-if="verbum.categoria === 'numerus'">
          <v-btn icon='quick_reference' id='aperi' @click='aperi();' :text="anglica ? 'Open' : 'Refer'" />
        </template>
        <template v-else-if="verbum.categoria === 'actus' &&
          valores.includes('participium')">
          <v-btn icon='quick_reference' id='aperi' @click='aperi();'
                 :text="anglica ? 'Particple' : 'Participalis'" />
        </template>
      </v-btn-toggle>
    </v-card>
  </v-dialog>
</template>
