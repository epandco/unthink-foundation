import { DataResult, ViewResult } from './result';
import {
  MiddlewareType,
  ResourceDataRouteDefinition,
  ResourceDefinition,
  ResourceMethodMap,
  ResourceRouteHandler,
  ResourceViewRouteDefinition,
  RouteType,
  UnthinkCommonMiddleware,
  UnthinkDataMiddleware,
  UnthinkMiddleware,
  UnthinkMiddlewareHandler,
  UnthinkViewMiddleware
} from './resource-definition';

export interface ResourceRouteConfig<ResourceMiddleware> {
  prefix?: string;
  routeId?: string;
  middleware?: ResourceMiddleware[];
}

export function data<ResourceMiddleware>(
  path: string,
  methods: ResourceMethodMap<DataResult, ResourceMiddleware>,
  config: ResourceRouteConfig<ResourceMiddleware> = {}): ResourceDataRouteDefinition<ResourceMiddleware> {

  if (!config.prefix) {
    config.prefix = '/api';
  }

  return {
    __routeType: RouteType.DATA,
    path: path,
    methods: methods,
    prefix: config.prefix,
    middleware: config.middleware
  };
}

export function view<ResourceMiddleware>(
  path: string,
  handler: string | ResourceRouteHandler<ViewResult, ResourceMiddleware>,
  config: ResourceRouteConfig<ResourceMiddleware> = {}): ResourceViewRouteDefinition<ResourceMiddleware> {

  let methodMap: ResourceMethodMap<ViewResult, ResourceMiddleware>;

  if (typeof handler === 'string') {
    methodMap = {
      'get': async (): Promise<ViewResult> => ViewResult.ok(handler)
    };
  } else {
    methodMap = {
      'get': handler
    };
  }

  return {
    __routeType: RouteType.VIEW,
    path: path,
    methods: methodMap,
    prefix: config.prefix,
    middleware: config.middleware
  };
}

export function agnosticMiddleware(func: UnthinkMiddlewareHandler): UnthinkCommonMiddleware {
  const commonMiddlewareHandler = func as UnthinkCommonMiddleware;
  commonMiddlewareHandler.__middlewareType = MiddlewareType.COMMON;

  return commonMiddlewareHandler;
}

export function dataMiddleware(func: UnthinkMiddlewareHandler): UnthinkDataMiddleware {
  const dataMiddlewareHandler = func as UnthinkDataMiddleware;
  dataMiddlewareHandler.__middlewareType = MiddlewareType.DATA;

  return dataMiddlewareHandler;
}

export function viewMiddleware(func: UnthinkMiddlewareHandler): UnthinkViewMiddleware {
  const viewMiddlewareHandler = func as UnthinkViewMiddleware;
  viewMiddlewareHandler.__middlewareType = MiddlewareType.VIEW;

  return viewMiddlewareHandler;
}

export function unthinkResource(
  resourceDefinition: ResourceDefinition<UnthinkMiddleware>
): ResourceDefinition<UnthinkMiddleware> {
  return resourceDefinition;
}

