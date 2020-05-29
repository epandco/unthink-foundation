import { Cookie, DataResult, MiddlewareResult, ViewResult } from './result';
import { BaseLogger } from 'pino';

/** Routes */

export enum RouteType {
  VIEW = 'VIEW',
  DATA = 'DATA'
}

export enum MiddlewareType {
  COMMON = 'UNTHINK_COMMON_MIDDLEWARE',
  DATA = 'UNTHINK_DATA_MIDDLEWARE',
  VIEW = 'UNTHINK_VIEW_MIDDLEWARE',
  RAW = 'UNTHINK_RAW_MIDDLEWARE',
}

export type RouteMethod = 'get' | 'put' | 'post' | 'delete';
export type ResourceRouteHandler<Result, ResourceMiddleware> = ResourceRouteHandlerBase<Result> | ResourceRouteHandlerWithMiddleware<Result, ResourceMiddleware>
export type ResourceMethodMap<Result, ResourceMiddleware> = Partial<Record<RouteMethod, ResourceRouteHandler<Result, ResourceMiddleware>>>;

// Directly support results from https://www.npmjs.com/package/qs
// Type definition lifted from @types/express didn't see a need to alter
// should be usable across many backends
export interface Query {
  [key: string]: string | Query | (string | Query)[];
}

export interface RouteContext {
  query?: Query;
  params?: Record<string, string>;
  body?: object;
  headers?: Record<string, string>;
  cookies?: Cookie[];
  local?: Record<string, unknown>;
  logger: BaseLogger;
  path: string;
}

export interface UnthinkMiddlewareHandler {
  (context: RouteContext): MiddlewareResult | Promise<MiddlewareResult>;
}

export interface UnthinkCommonMiddleware extends UnthinkMiddlewareHandler {
  __middlewareType: MiddlewareType.COMMON;
}

export interface UnthinkDataMiddleware extends UnthinkMiddlewareHandler {
  __middlewareType: MiddlewareType.DATA;
}

export interface UnthinkViewMiddleware extends UnthinkMiddlewareHandler {
  __middlewareType: MiddlewareType.VIEW;
}

export interface UnthinkRawMiddleware {
  __middlewareType: MiddlewareType.RAW;
}

export type UnthinkMiddleware = UnthinkCommonMiddleware | UnthinkDataMiddleware | UnthinkViewMiddleware | UnthinkRawMiddleware;

export interface ResourceRouteHandlerBase<Result = unknown> {
  (context: RouteContext): Promise<Result>;
}

export interface ResourceRouteHandlerWithMiddleware<Result, ResourceMiddleware> {
  handler: ResourceRouteHandlerBase<Result>;
  middleware: ResourceMiddleware[];
}

export interface ResourceRouteDefinitionBase<Result, ResourceMiddleware> {
  path: string;
  prefix?: string;
  routeId?: string;
  middleware?: ResourceMiddleware[];
  methods: ResourceMethodMap<Result, ResourceMiddleware>;
}

/** Resource definitions */
export type ResourceRouteDefinition<ResourceMiddleware> = ResourceDataRouteDefinition<ResourceMiddleware> | ResourceViewRouteDefinition<ResourceMiddleware>;

export interface ResourceDataRouteDefinition<ResourceMiddleware> extends ResourceRouteDefinitionBase<DataResult, ResourceMiddleware> {
  __routeType: RouteType.DATA;
}

export interface ResourceViewRouteDefinition<ResourceMiddleware> extends ResourceRouteDefinitionBase<ViewResult, ResourceMiddleware> {
  __routeType: RouteType.VIEW;
}

export interface ResourceDefinition<ResourceMiddleware> {
  name: string;
  basePath?: string;
  middleware?: ResourceMiddleware[];
  routes: ResourceRouteDefinition<ResourceMiddleware>[];
}
