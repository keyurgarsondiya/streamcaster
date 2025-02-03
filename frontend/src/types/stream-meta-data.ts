import { Platform } from '@/constants';

export interface StreamMetaData {
  platform: Platform | null;
  streamKey: string;
  streamTitle: string;
  description: string;
}
