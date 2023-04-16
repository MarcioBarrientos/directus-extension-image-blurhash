import { defineHook } from '@directus/extensions-sdk'
const axios = require('axios');
const { encode } = require('blurhash');
const sharp = require('sharp');

export default defineHook(({ action }, { services }) => {
  const { FilesService } = services
  action('files.upload', async ({payload, key}, { schema }) => {
    const fetchImage = async (url: string): Promise<Buffer> => {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data, 'binary');
    }
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'].includes(payload.type)) {
      try {
        const publicUrl = process.env.PUBLIC_URL || 'http://0.0.0.0:8055'
        const imageData = await fetchImage(`${publicUrl}/assets/${key}?key=system-medium-cover`);
        const { data, info } = await sharp(imageData).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
        const blur_hash = encode(new Uint8ClampedArray(data), info.width, info.height,4,4);
        const service = new FilesService({ schema });
        await service.updateOne(key, { blur_hash });
      } catch (e) {console.log(e)}
    }
  })
})

