// Mock testimonies data
import { Testimony } from '../types';

export const mockTestimonies: Testimony[] = [
  {
    _id: 'testimony1',
    prison_id: 'gherla',
    victim_id: 'victim1',
    text: 'În celula de izolare, frigul era atât de intens încât simțeam cum oasele îmi îngheață. Nu aveam nicio pătură, nicio speranță. Doar credința în Dumnezeu mă ținea în viață.',
    source: 'Mărturii din Gherla',
    year: 1950,
    type: 'written',
    created_at: new Date().toISOString(),
  },
  {
    _id: 'testimony2',
    prison_id: 'pitesti',
    victim_id: 'victim3',
    text: 'Ceea ce s-a întâmplat la Pitești depășește orice imaginație. Eram obligați să ne torturăm colegii, să ne renegăm tot ce era sfânt pentru noi. Era o încercare de a ne distruge sufletul.',
    source: 'Supraviețuitori Pitești',
    year: 1951,
    type: 'written',
    created_at: new Date().toISOString(),
  },
  {
    _id: 'testimony3',
    prison_id: 'sighet',
    text: 'Am văzut oameni mari, lideri ai națiunii, murind în bezna celulelor. Nimeni nu știa de soarta lor. Familiile lor credeau că sunt în viață. Era o moarte lentă, umilitoare.',
    source: 'Arhivele Memorialului Sighet',
    year: 1952,
    type: 'written',
    created_at: new Date().toISOString(),
  },
];