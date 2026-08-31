import { beforeEach, describe, expect, it } from 'bun:test';
import { OverrideManager } from './override-manager.js';

describe('OverrideManager', () => {
  let manager: OverrideManager;

  beforeEach(() => {
    manager = new OverrideManager();
  });

  it('should set a primitive key and restore the original value', () => {
    const target = { FLAG: false, KEY: 'value' };

    manager.set(target, 'FLAG', true);
    expect(target).toEqual({ FLAG: true, KEY: 'value' });

    manager.restoreAll();
    expect(target).toEqual({ FLAG: false, KEY: 'value' });
  });

  it('should set an object key and restore the original reference', () => {
    const originalConfig = { host: 'localhost', port: 8080 };
    const target = { CONFIG: originalConfig };

    manager.set(target, 'CONFIG', { host: 'example.com', port: 9090 });
    expect(target.CONFIG).toEqual({ host: 'example.com', port: 9090 });

    manager.restoreAll();
    expect(target.CONFIG).toEqual(originalConfig);
  });
});
