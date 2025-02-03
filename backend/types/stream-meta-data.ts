import { Platform } from '../constants/platform.js';

export interface StreamMetaData {
  platform: Platform | null;
  streamKey: string;
  streamTitle: string;
  description: string;
}
