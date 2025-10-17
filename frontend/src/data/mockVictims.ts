// Mock data for victims
import { Victim } from '../types';

export const mockVictims: Victim[] = [
  {
    _id: 'victim1',
    prison_id: 'gherla',
    name: 'Valeriu Gafencu',
    birth_year: 1921,
    death_year: 1952,
    profession: 'Student, membru al Mișcării Legionare',
    biography: 'Cunoscut ca "Sfântul închisorilor", Valeriu Gafencu și-a dedicat viața ajutorării colegilor de suferință. A murit la vârsta de 31 de ani din cauza tuberculozei contractate în închisoare.',
    testimonies: [],
    imprisonment_period: {
      start: '1948',
      end: '1952',
    },
  },
  {
    _id: 'victim2',
    prison_id: 'sighet',
    name: 'Iuliu Maniu',
    birth_year: 1873,
    death_year: 1953,
    profession: 'Prim-ministru al României',
    biography: 'Lider al Partidului Național Țărănesc, Iuliu Maniu a fost una dintre cele mai importante personalități politice ale României interbelice. Condamnat la muncă silnică pe viață, a murit în închisoarea Sighet.',
    testimonies: [],
    imprisonment_period: {
      start: '1947',
      end: '1953',
    },
  },
  {
    _id: 'victim3',
    prison_id: 'pitesti',
    name: 'Alin Tănase',
    birth_year: 1928,
    death_year: 2011,
    profession: 'Student',
    biography: 'Supraviețuitor al experimentului de reeducare de la Pitești. Martor al celor mai cumplite torturi aplicate studenților români.',
    testimonies: [],
    imprisonment_period: {
      start: '1949',
      end: '1952',
    },
  },
  {
    _id: 'victim4',
    prison_id: 'aiud',
    name: 'Gheorghe Calciu-Dumitreasa',
    birth_year: 1925,
    death_year: 2006,
    profession: 'Preot și disident',
    biography: 'Teolog și preot ortodox, a petrecut 21 de ani în închisorile comuniste pentru convingerile sale religioase.',
    testimonies: [],
    imprisonment_period: {
      start: '1948',
      end: '1964',
    },
  },
];