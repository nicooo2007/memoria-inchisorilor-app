// Mock documents data
import { Document } from '../types';

export const mockDocuments: Document[] = [
  {
    _id: 'doc1',
    title: 'Sentința Tribunalului Militar - Condamnare pentru "trădare de patrie"',
    document_type: 'sentence',
    scan_url: 'https://placeholder.com/sentence1.pdf',
    transcription: 'În numele poporului... Condamnăm pe acuzatul [NUME] la 25 de ani muncă silnică pentru crimă de trădare de patrie și activitate antidemocratică...',
    prison_id: 'gherla',
    year: 1948,
    description: 'Sentință tipică din perioada stalinistă, în care simpla exprimare a opiniilor politice era considerată "trădare de patrie".',
    created_at: new Date().toISOString(),
  },
  {
    _id: 'doc2',
    title: 'Scrisoare din închisoare către familie',
    document_type: 'letter',
    scan_url: 'https://placeholder.com/letter1.pdf',
    transcription: 'Dragii mei, sunt bine și mă gândesc la voi în fiecare zi. Nu vă faceți griji pentru mine. Păstrați-vă credința și speranța. Vă iubesc.',
    victim_id: 'victim1',
    year: 1951,
    description: 'Una dintre puținele scrisori care a reușit să ajungă la destinație. Majoritatea scrisorilor erau confiscate de autoritățile comuniste.',
    created_at: new Date().toISOString(),
  },
  {
    _id: 'doc3',
    title: 'Dosar Securitate - Raport de supraveghere',
    document_type: 'securitate_file',
    scan_url: 'https://placeholder.com/securitate1.pdf',
    prison_id: 'pitesti',
    year: 1952,
    description: 'Document desecretizat care arată amploarea aparatului represiv comunist și metodele de supraveghere a populației.',
    created_at: new Date().toISOString(),
  },
];