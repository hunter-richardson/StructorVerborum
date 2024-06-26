<script lang='ts'>
  import { defineComponent, defineModel, type ComponentOptionsWithoutProps } from 'vue';
  import Numerator from '../miscella/numerator';
  import { Numerus } from '../praebeunda/verba';
  import specere from './specere.vue';
  import Cocutor from '../miscella/cocutor';
  import type { ModelRef } from 'vue';
  import Gustulus from '../scriptura/gustulus';
  import gustulare from './gustulare.vue';

  type Arabicus = {
    integer: number,
    numerator: number,
    denominator: number
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const numerus: ModelRef<Numerus | undefined, string> = defineModel<Numerus>();

  const arabicus: Arabicus = {
    integer: 0,
    numerator: 0,
    denominator: 12
  };

  const anglica: boolean = Cocutor.se.ipse().edatur('lingua') === 'anglica';

  const validator: ((arabicus: number) => boolean | string)[] = [
    (arabicus: number): boolean | string => {
      const error: string = anglica ?
        'Only Roman numerals allowed' : 'Romani numeri soli licuntur';
      return Number.isInteger(arabicus) || error;
    }
  ];

  const componenta: ComponentOptionsWithoutProps = {
    'gustulare': gustulare,
    'specere': specere
  };

  const data = (): {
    validator: ((arabicus: number) => boolean | string)[],
    gustulus: Gustulus,
    anglica: boolean,
    numerus: Numerus | undefined,
    arabicus: Arabicus,
    romanus: string
  } => {
    return {
      gustulus: new Gustulus({}),
      anglica: anglica,
      validator: validator,
      numerus: numerus.value,
      arabicus: arabicus,
      romanus: ''
    };
  };

  export default defineComponent({
    components: componenta, data: data,
    methods: {
      effiat (): void {
        this.romanus = Numerator.romanus(this.arabicus.integer + (this.arabicus.numerator / this.arabicus.denominator));
      }, refer (): void {
        if (this.arabicus.numerator === 0) {
          this.numerus = Numerus.numerator(this.arabicus.integer);
        }
      }
    }, mounted(): void {
      this.effiat();
    }
  });
</script>

<template lang='vue'>
	<gustulare :gustulus='gustulus' />
	<template v-if='numerus'>
		<specere :verbum='numerus' @blur='numerus = undefined' />
	</template>
  <div class='text-center'>
    <v-card id='effectus' :text='romanus' />
    <template v-if='anglicus.numerator === 0'>
      <v-btn icon='equal' id='aequa' @click='refer();' />
    </template>
  </div>
  <div class='text-center'>
    <v-number-input @change='effiat();' id='integer' :rules='validator' validateOn='input'
                    v-model='anglicus.integer' autofocus clearable flat reverse />
    <v-card text=' + ' />
    <v-number-input @change='effiat();' id='numerator' :rules='validator' validateOn='input'
                    v-model='anglicus.numerator' clearable flat />
    <v-card :text="' ÷ '.concat(anglicus.denominator.toString())" />
  </div>
</template>
