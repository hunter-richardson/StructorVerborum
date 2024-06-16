import TabulaDefecta from './defecta';
import { numerales, personae, tempora } from '../../miscella/enumerationes';
import { Actus } from '../../praebeunda/verba';
import { type Colamen } from '../../praebeunda/agenda';

export default class TabulaPerfecta extends TabulaDefecta<Actus> {
  static apponatur (): Colamen<Actus>[] {
    const colamina: Colamen<Actus>[] = [
      { modus: 'infinitivus' } as Colamen<Actus>
    ];

    [
      'indicativus', 'subiunctivus'
    ].forEach(modus => {
      tempora.forEach(tempus => {
        if ([
          modus === 'infinitiuvs', [
            'praesens', 'infectum'
          ].includes(tempus)
        ].all()) {
          numerales.forEach(numeralis => {
            personae.forEach(persona => {
              colamina.push({
                modus: modus,
                tempus: tempus,
                numeralis: numeralis,
                persona: persona
              } as Colamen<Actus>);
            });
          });
        }
      });
    });

    return colamina;
  }

  protected referatur (colamen: Colamen<Actus>): Colamen<Actus> | null {
    switch (colamen.modus) {
      case 'infinitivus':
        if ([
          colamen.vox === 'activa',
          colamen.tempus === 'perfectum'
        ].all()) {
          colamen.vox = '';
          colamen.tempus = '';
        } else {
          return null;
        }
        break;
      case 'indicativus':
      case 'subiunctivus':
        switch (colamen.tempus) {
          case 'perfectum':
            colamen.tempus = 'praesens';
            break;
          case 'plusquamperfectum':
            colamen.tempus = 'infectum';
            break;
          case 'exigendum':
            colamen.tempus = 'futurum';
            break;
          default:
            return null;
        }
      default:
        return null;
    }

    return colamen;
  }
}
