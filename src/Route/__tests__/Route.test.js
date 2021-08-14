import { findRouteType } from '../Route.js';

describe('findRouteType', () => {
     const plainRoute = findRouteType('/users');
     const parametrizedRoute = findRouteType('/users/:userId');
     const globLikeRoute = findRouteType('/us?rs');

     test('Correctly defines plain routes', () => {
          expect(plainRoute).toBe('plain');
          expect(parametrizedRoute).not.toBe('plain');
          expect(globLikeRoute).not.toBe('plain');
     });

     test('Correctly defines parametrized routes', () => {
          expect(globLikeRoute).not.toBe('parametrized');
          expect(parametrizedRoute).toBe('parametrized');
          expect(plainRoute).not.toBe('parametrized');
     });

     test('Correctly defines glob-like routes', () => {
          expect(globLikeRoute).toBe('globed');
          expect(plainRoute).not.toBe('globed');
          expect(parametrizedRoute).not.toBe('globed');
     });
});

