import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes: { [key: string]: RouteStorageObject } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getFullPath(route);
    return path === 'record/open-order'; // Cache only OpenOrderComponent
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = this.getFullPath(route);
    if (this.shouldDetach(route)) {
      this.storedRoutes[path] = { snapshot: route, handle };
      console.log('Stored route:', path);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getFullPath(route);
    const shouldAttach = !!this.storedRoutes[path];
    console.log('Should attach:', path, shouldAttach);
    return shouldAttach;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getFullPath(route);
    return this.storedRoutes[path] ? this.storedRoutes[path].handle : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && 
           JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  private getFullPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map((snapshot) => snapshot.routeConfig?.path || '')
      .filter((path) => path !== '')
      .join('/');
  }

  clearStoredRoutes(): void {
    this.storedRoutes = {};
  }
}