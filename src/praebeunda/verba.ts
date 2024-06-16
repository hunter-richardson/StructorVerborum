import Structor from './structor';
import LectorVerbalis from '../lectores/verbalis';
import * as Enumerationes from '../miscella/enumerationes';
import Numeral from '../miscella/numeral';
import {
  AdiectivumAgendum,
  NumeramenAgendum,
  type Agendum,
  type Positor
} from './agenda';

export class Verbum {
  static readonly Errator: ((exemplar: string, res: string) => Error) =
    (exemplar: string, res: string) => new Error([ "Malu'st", exemplar, res ].join(' '));
  readonly unicum: symbol = Symbol();
  categoria: string = '';
  protected _scriptum: string = '';

  get scriptum (): string {
    return this._scriptum;
  }

  set scriptum (valor: string) {
    if (valor.trim()) {
      this._scriptum = valor;
    } else {
      throw Verbum.Errator('scriptum', valor);
    }
  }

  paratumne(): boolean {
    return !!this.scriptum;
  }
}

export class Numerus extends Verbum {
  override categoria: string = 'numerus';
  override _scriptum: string = this.latinum();
  private _anglicus: number = -1;

  private latinum (): string {
    return Numeral.romanus(this._anglicus);
  }

  get anglicus (): number {
    return this._anglicus;
  }

  set anglicus (valor: number) {
    if (Numeral.convertibilis(valor)) {
      this._anglicus = valor;
    } else {
      throw Numerus.Errator('anclicus', valor.toString());
    }
  }

  static readonly numerator: ((anglicus: number) => Numerus) = (anglicus: number): Numerus => {
    return new Structor<Numerus>(() => new Numerus)
      .ponatur(numerus => numerus.anglicus = anglicus)
      .struatur();
  };

  async numeramen (): Promise<NumeramenAgendum | null> {
    const lector: LectorVerbalis<NumeramenAgendum> = LectorVerbalis.Numeraminum.ipse();
    return await lector.legatur(this.scriptum);
  }
}

export abstract class Multiplex extends Verbum {
  static colamina(categoria: string): string[] {
    switch(categoria) {
      case 'actus':
        return [ 'modus', 'vox', 'tempus', 'numeralis', 'persona' ];
      case 'adiectivum':
        return [ 'gradus', 'genus', 'numeralis', 'casus' ];
      case 'adverbium':
        return [ 'gradus' ];
      case 'nomen':
        return [ 'factum', 'numeralis', 'casus' ];
      case 'numeramen':
        return [ 'numerium' ];
      case 'pronomen':
        return [ 'genus', 'numeralis', 'casus' ];
      default:
        return [  ];
    }
  }

  private _encliticum: string = Enumerationes.Encliticum.Nolens;

  abstract valores(): string[];

  get encliticum (): string {
    return this._encliticum;
  }

  set encliticum (valor: Enumerationes.Encliticum) {
    this._encliticum = valor;

    if (valor) {
      this.scriptum = this.scriptum.concat(valor);
    }
  }
}

export class Actus extends Multiplex {
  override categoria: string = 'actus';
  private _modus: string = '';
  private _vox: string = '';
  private _tempus: string = '';
  private _numeralis: string = '';
  private _persona: string = '';

  get modus (): string {
    return this._modus;
  }

  get vox (): string {
    return this._vox;
  }

  get tempus (): string {
    return this._tempus;
  }

  get numeralis (): string {
    return this._numeralis;
  }

  get persona (): string {
    return this._persona;
  }

  set modus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.modi.includes(valor)) {
      this._modus = valor;
    } else {
      throw Actus.Errator('modus', valor);
    }
  }

  set vox (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.voces.includes(valor)
    ].any()) {
      this._vox = valor ?? '';
    } else {
      throw Actus.Errator('vox', valor);
    }
  }

  set tempus (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.tempora.includes(valor)
    ].any()) {
      this._tempus = valor ?? '';
    } else {
      throw Actus.Errator('tempus', valor);
    }
  }

  set numeralis (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.numerales.includes(valor)
    ].any()) {
      this._numeralis = valor ?? '';
    } else {
      throw Actus.Errator('numeralis', valor);
    }
  }

  set persona (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.personae.includes(valor)
    ].any()) {
      this._persona = valor ?? '';
    } else {
      throw Actus.Errator('persona', valor);
    }
  }

  valores(): string[] {
    return [ this.modus, this.vox, this.tempus, this.numeralis, this.persona ];
  }

  override paratumne(): boolean {
    return this.modus !== 'participalis' && super.paratumne();
  }

  static readonly positor: Positor<Actus> = (istud: Agendum<Actus>): Actus => {
    return new Structor<Actus>(() => new Actus)
      .ponatur(actus => actus.modus = istud.modus)
      .ponatur(actus => actus.vox = istud.vox ?? '')
      .ponatur(actus => actus.tempus = istud.tempus ?? '')
      .ponatur(actus => actus.numeralis = istud.numeralis ?? '')
      .ponatur(actus => actus.persona = istud.persona ?? '')
      .ponatur(actus => actus.scriptum = istud.scriptum)
      .struatur();
  };

  async participialis (): Promise<AdiectivumAgendum> {
    if (this.modus === 'participialis') {
      if (this.tempus === 'praesens') {
        const structor: Structor<AdiectivumAgendum> = new Structor(() => new AdiectivumAgendum)
          .ponatur(adiectivum => adiectivum.versio = 'positivusTertia/cumTruncoVario')
          .ponatur(adiectivum => adiectivum.positivum = this.scriptum);
        if (this.scriptum.slice(-3) === 'āre') {
          structor.ponatur(adiectivum => adiectivum.comparativum =
            this.scriptum.replace('āns$', 'antior'));
          structor.ponatur(adiectivum => adiectivum.superlativum =
            this.scriptum.replace('āns$', 'antissimum'));
        } else {
          structor.ponatur(adiectivum => adiectivum.comparativum =
            this.scriptum.replace('ēns$', 'entior'));
          structor.ponatur(adiectivum => adiectivum.superlativum =
            this.scriptum.replace('ēns$', 'entissimum'));
        }

        return structor.struatur();
      } else {
        return new Structor(() => new AdiectivumAgendum)
          .ponatur(adiectivum => adiectivum.versio = 'postivusAutPrimaAutSecunda')
          .ponatur(adiectivum => adiectivum.positivum = this.scriptum)
          .ponatur(adiectivum => adiectivum.comparativum =
            this.scriptum.replace('um$', 'ius'))
          .ponatur(adiectivum => adiectivum.comparativum =
            this.scriptum.replace('um$', 'issimum'))
          .struatur();
      }
    } else {
      throw Actus.Errator('modus', this.modus);
    }
  }
}

export class Adverbium extends Multiplex {
  override categoria: string = 'adverbium';
  private _gradus: string = '';

  get gradus (): string {
    return this._gradus;
  }

  set gradus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.gradi.includes(valor)) {
      this._gradus = valor;
    } else {
      throw Adverbium.Errator('gradus', valor);
    }
  }

  valores(): string[] {
    return [ this.gradus ];
  }

  static readonly positor: Positor<Adverbium> = (istud: Agendum<Adverbium>): Adverbium =>
    new Structor<Adverbium>(() => new Adverbium)
      .ponatur(adverbium => adverbium.gradus = istud.gradus ?? '')
      .ponatur(adverbium => adverbium.scriptum = istud.scriptum)
      .struatur();
}

export class Nomen extends Multiplex {
  override categoria: string = 'nomen';
  private _factum: string = '';
  private _numeralis: string = '';
  private _casus: string = 'derectus';

  get factum (): string {
    return this._factum;
  }

  get numeralis (): string {
    return this._numeralis;
  }

  get casus (): string {
    return this._casus;
  }

  set factum (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.facta.includes(valor)
    ].any()) {
      this._factum = valor ?? '';
    } else {
      throw Nomen.Errator('factum', valor);
    }
  }

  set numeralis (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.numerales.includes(valor)
    ].any()) {
      this._numeralis = valor ?? '';
    } else {
      throw Nomen.Errator('numeralis', valor);
    }
  }

  set casus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.casus.includes(valor)) {
      this._casus = valor ?? '';
    } else {
      throw Nomen.Errator('casus', valor);
    }
  }

  valores(): string[] {
    return [ this.factum, this.numeralis, this.casus ];
  }

  static readonly positor: Positor<Nomen> = (istud: Agendum<Nomen>): Nomen =>
    new Structor<Nomen>(() => new Nomen)
      .ponatur(nomen => nomen.numeralis = istud.numeralis ?? '')
      .ponatur(nomen => nomen.casus = istud.casus ?? '')
      .ponatur(nomen => nomen.scriptum = istud.scriptum)
      .struatur();
}

export class Pronomen extends Multiplex {
  override categoria: string = 'pronomen';
  private _genus: string = '';
  private _numeralis: string = '';
  private _casus: string = 'derectus';

  get genus (): string {
    return this._genus;
  }

  get numeralis (): string {
    return this._numeralis;
  }

  get casus (): string {
    return this._casus;
  }

  set genus (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.genera.includes(valor)
    ].any()) {
      this._genus = valor ?? '';
    } else {
      throw Pronomen.Errator('genus', valor);
    }
  }

  set numeralis (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.numerales.includes(valor)
    ].any()) {
      this._numeralis = valor ?? '';
    } else {
      throw Pronomen.Errator('numeralis', valor);
    }
  }

  set casus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.casus.includes(valor)) {
      this._casus = valor ?? '';
    } else {
      throw Pronomen.Errator('casus', valor);
    }
  }

  valores(): string[] {
    return [ this.genus, this.numeralis, this.casus ];
  }

  static readonly positor: Positor<Pronomen> = (istud: Agendum<Pronomen>): Pronomen => {
    if (!istud.casus || istud.casus === 'Derectus') {
      throw this.Errator('casus', istud.casus);
    } else {
      return new Structor<Pronomen>(() => new Pronomen)
        .ponatur(pronomen => pronomen.casus = istud.casus)
        .ponatur(pronomen => pronomen.genus = istud.genus ?? '')
        .ponatur(pronomen => pronomen.numeralis = istud.numeralis ?? '')
        .ponatur(pronomen => pronomen.scriptum = istud.scriptum)
        .struatur();
    }
  };
}

export class Adiectivum extends Multiplex {
  override categoria: string = 'adiectivum';
  private _gradus: string = '';
  private _genus: string = '';
  private _numeralis: string = '';
  private _casus: string = 'derectus';

  get gradus (): string {
    return this._gradus;
  }

  get genus (): string {
    return this._genus;
  }

  get numeralis (): string {
    return this._numeralis;
  }

  get casus (): string {
    return this._casus;
  }

  set gradus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.gradi.includes(valor)) {
      this._gradus = valor;
    } else {
      throw Adiectivum.Errator('gradus', valor);
    }
  }

  set genus (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.genera.includes(valor)
    ].any()) {
      this._genus = valor ?? '';
    } else {
      throw Adiectivum.Errator('genus', valor);
    }
  }

  set numeralis (valor: string) {
    valor = valor.toLowerCase();

    if ([
      !(valor),
      Enumerationes.numerales.includes(valor)
    ].any()) {
      this._numeralis = valor ?? '';
    } else {
      throw Adiectivum.Errator('numeralis', valor);
    }
  }

  set casus (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.casus.includes(valor)) {
      this._casus = valor;
    } else {
      throw Adiectivum.Errator('casus', valor);
    }
  }

  valores(): string[] {
    return [ this.gradus, this.genus, this.numeralis, this.casus ];
  }

  static readonly positor: Positor<Adiectivum> = (istud: Agendum<Adiectivum>): Adiectivum =>
    new Structor<Adiectivum>(() => new Adiectivum)
      .ponatur(adiectivum => adiectivum.gradus = istud.gradus ?? '')
      .ponatur(adiectivum => adiectivum.genus = istud.genus ?? '')
      .ponatur(adiectivum => adiectivum.numeralis = istud.numeralis ?? '')
      .ponatur(adiectivum => adiectivum.casus = istud.casus ?? '')
      .ponatur(adiectivum => adiectivum.scriptum = istud.scriptum)
      .struatur();
}

export class Numeramen extends Multiplex {
  override categoria: string = 'numeramen';
  private _numerium: string = '';

  get numerium (): string {
    return this._numerium;
  }

  set numerium (valor: string) {
    valor = valor.toLowerCase();

    if (Enumerationes.numeria.includes(valor)) {
      this.numerium = valor;
    } else {
      throw Numeramen.Errator('casus', valor);
    }
  }

  valores(): string[] {
    return [ this.numerium ];
  }

  override paratumne(): boolean {
    return false;
  }

  static readonly positor: Positor<Numeramen> = (istud: Agendum<Numeramen>): Numeramen =>
    new Structor<Numeramen>(() => new Numeramen)
      .ponatur(numeramen => numeramen.numerium = istud.numerium)
      .ponatur(numeramen => numeramen.scriptum = istud.scriptum)
      .struatur();
}