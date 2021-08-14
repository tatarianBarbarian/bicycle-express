import { addRoute, findRouteType, getRoute, getRoutePath, routeMatchers } from '../Route.js';

describe('findRouteType', () => {
     const plainRouteType = findRouteType('/users');
     const parametrizedRouteType = findRouteType('/users/:userId');
     const globLikeRouteType = findRouteType('/us?rs');

     test('Correctly defines plain routes', () => {
          expect(plainRouteType).toBe('plain');
          expect(parametrizedRouteType).not.toBe('plain');
          expect(globLikeRouteType).not.toBe('plain');
     });

     test('Correctly defines parametrized routes', () => {
          expect(globLikeRouteType).not.toBe('parametrized');
          expect(parametrizedRouteType).toBe('parametrized');
          expect(plainRouteType).not.toBe('parametrized');
     });

     test('Correctly defines glob-like routes', () => {
          expect(globLikeRouteType).toBe('globed');
          expect(plainRouteType).not.toBe('globed');
          expect(parametrizedRouteType).not.toBe('globed');
     });
});

describe('addRoute', () => {
     test('correctly adds and gets route', () => {
          const method = 'GET';
          const path = '/123';

          addRoute(method, path, [(req, res) => {}]);
          const route = getRoute(method, path);
          
          expect(getRoutePath(route)).toBe(path);
     });
});

describe('routeMatchers', () => {
     const { plain, parametrized, globed } = routeMatchers;

     test('Correctly matches plain routes', () => {
          const plainRoute = '/users';

          expect(plain('/users', plainRoute)).toBeTruthy();
          expect(plain('/users/35', plainRoute)).toBeFalsy();
          expect(plain('/abcde', plainRoute)).toBeFalsy();
          expect(plain('/usees', plainRoute)).toBeFalsy();
     });

     test('Correctly matches parametrized routes', () => {
          const parametrizedRoute = '/users/:userId';

          expect(parametrized('/users/31', parametrizedRoute)).toBeTruthy();
          expect(parametrized('/users/abcd', parametrizedRoute)).toBeTruthy();
          expect(parametrized('/users/31/posts', parametrizedRoute)).toBeFalsy();
          expect(parametrized('/usrrs/31', parametrizedRoute)).toBeFalsy();
     });

     test('Correctly matches glob-like routes', () => {
          const globLikeRoute = '/us?rs';

          expect(globed('/users', globLikeRoute)).toBeTruthy();
          expect(globed('/usars', globLikeRoute)).toBeTruthy();
          expect(globed('/usars/31', globLikeRoute)).toBeFalsy();
     });
});
