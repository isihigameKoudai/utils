import { RAKUTEN_RECORD } from '../constants/rakuten';

export type RakutenRecordValue = typeof RAKUTEN_RECORD[keyof typeof RAKUTEN_RECORD]['value'];
export type RakutenRecordLabel = typeof RAKUTEN_RECORD[keyof typeof RAKUTEN_RECORD]['label'];

