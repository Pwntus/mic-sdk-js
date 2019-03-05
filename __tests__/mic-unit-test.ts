import {
  IOptions,
} from '../src/types';

import MicSDK from '../src/MIC';

const initOptions: IOptions = {};

describe('mic unit test', () => {
  describe('init', () => {
    test('manifest and manifest metadata are fetched', async () => {
      const MIC = new MicSDK();
      await MIC.init(initOptions);

      expect(MIC.manifest).not.toBe({});
      expect(MIC.metadataManifest).not.toBe({});
    })
  })
})
