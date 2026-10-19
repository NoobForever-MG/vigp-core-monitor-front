import { parseAppConfig } from './app-config.loader';

const valid = {
  apiBaseUrl: '/api/',
  platformReturnUrl: 'https://plataformadigital.protectasecurity.pe/',
  pageSizeDefault: 12,
  featureFlags: { x: true },
  devMock: true,
};

describe('parseAppConfig', () => {
  it('acepta una config valida y quita la "/" final de apiBaseUrl', () => {
    const c = parseAppConfig(valid, false);
    expect(c.apiBaseUrl).toBe('/api');
    expect(c.pageSizeDefault).toBe(12);
    expect(c.featureFlags).toEqual({ x: true });
  });

  it('en produccion devMock siempre es false, aunque el JSON lo traiga', () => {
    expect(parseAppConfig(valid, true).devMock).toBe(false);
    expect(parseAppConfig(valid, false).devMock).toBe(true);
  });

  it('acepta apiBaseUrl absoluta http(s)', () => {
    expect(parseAppConfig({ ...valid, apiBaseUrl: 'https://localhost:7126/api' }, false).apiBaseUrl)
      .toBe('https://localhost:7126/api');
  });

  it('featureFlags ausente queda como objeto vacio', () => {
    expect(parseAppConfig({ ...valid, featureFlags: undefined }, false).featureFlags).toEqual({});
  });

  it.each([
    ['no es objeto', 'texto'],
    ['sin apiBaseUrl', { ...valid, apiBaseUrl: undefined }],
    ['apiBaseUrl vacia', { ...valid, apiBaseUrl: '  ' }],
    ['apiBaseUrl invalida', { ...valid, apiBaseUrl: 'api' }],
    ['platformReturnUrl invalida', { ...valid, platformReturnUrl: 'javascript:alert(1)' }],
    ['pageSizeDefault 0', { ...valid, pageSizeDefault: 0 }],
    ['pageSizeDefault texto', { ...valid, pageSizeDefault: '12' }],
    ['featureFlags arreglo', { ...valid, featureFlags: [] }],
  ])('rechaza: %s', (_caso, raw) => {
    expect(() => parseAppConfig(raw, false)).toThrow(/app-config\.json/);
  });
});
