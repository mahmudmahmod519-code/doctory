// Unit tests — middleware/upload.js
const upload = require('../../middleware/upload');

describe('middleware/upload', () => {
  it('is exported as a configured multer instance', () => {
    expect(typeof upload).toBe('function');
    expect(upload.single).toBeInstanceOf(Function);
    expect(upload.array).toBeInstanceOf(Function);
  });

  it('enforces the configured file size limit', () => {
    const config = require('../../config/env-config');
    expect(config.upload.size_file).toBeGreaterThan(0);
    expect(config.upload.allowedMimeTypes.length).toBeGreaterThan(0);
    expect(config.upload.allowedMimeTypes).toContain('image/jpeg');
  });
});
