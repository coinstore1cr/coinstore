// custom-route-reuse-strategy.ts
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

/**
 * Custom Route Reuse Strategy to cache OpenOrderComponent under specific conditions
 */
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // Storage for cached routes
  private storedRoutes: { [key: string]: RouteStorageObject } = {};

  /**
   * Determines if a route should be detached (cached)
   * Cache OpenOrderComponent when leaving the route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Cache only the 'record/open-order' route
    const path = this.getFullPath(route);
    return path === 'record/open-order';
  }

  /**
   * Stores the detached route handle
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = this.getFullPath(route);
    if (this.shouldDetach(route)) {
      this.storedRoutes[path] = {
        snapshot: route,
        handle: handle
      };
    }
  }

  /**
   * Determines if a route should be reattached (reused from cache)
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getFullPath(route);
    // Check if we have a stored route and the orderData exists in SharedService
    return !!this.storedRoutes[path];
  }

  /**
   * Retrieves the stored route handle
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getFullPath(route);
    return this.storedRoutes[path] ? this.storedRoutes[path].handle : null;
  }

  /**
   * Determines if a route should be reused or re-rendered
   * Don't reuse if navigating to a different route
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && 
           JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  /**
   * Helper method to get the full route path
   */
  private getFullPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map((snapshot) => snapshot.routeConfig?.path || '')
      .filter((path) => path !== '')
      .join('/');
  }

  /**
   * Method to clear stored routes (optional, for manual cleanup)
   */
  clearStoredRoutes(): void {
    this.storedRoutes = {};
  }
}