export interface Cookie {
  name: string;
  value?: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'strict' | 'lax';
  overwrite?: boolean;
}

export class Result {
  protected constructor(
    public readonly status: number,
    public readonly value?: unknown,
    public readonly cookies?: Cookie[],
    public readonly headers?: Record<string, string>,
    public readonly redirectUrl?: string
  ) {}
}

/** Used primarily in data routes where we want to force a value and it not show up in the options */
export interface ResultOptionsNoValue {
  local?: Record<string, unknown>;
  cookies?: Cookie[];
  headers?: Record<string, string>;
}

export interface ResultOptionsWithValue extends ResultOptionsNoValue {
  value?: unknown;
}

function ensureNoValueOnOptions(options?: ResultOptionsNoValue): ResultOptionsWithValue {
  if (!options) {
    return {};
  }

  const optionsWithValue: ResultOptionsWithValue = options;

  // Make sure no one is doing any funny business with types
  // Technically the ResultOptionsWithValue will cast to ResultOptionsNoValue
  // given all properties are optional. So this is explicitly setting value to undefined
  // in case it was set.
  optionsWithValue.value = undefined;

  return optionsWithValue;
}

export class DataResult extends Result {
  // Used to ensure UnthinkViewResult can't be assigned to this class.
  public readonly __type: 'DATA_RESULT';

  private constructor(
    status: number,
    redirectUrl?: string,
    options?: ResultOptionsWithValue
  ) {
    super(status, options?.value, options?.cookies, options?.headers, redirectUrl);
  }

  public static ok(options?: ResultOptionsWithValue): DataResult {
    const status = options?.value ? 200 : 204;

    return new DataResult(status, undefined, options);
  }

  public static error(value: unknown, options?: ResultOptionsNoValue): DataResult {
    const optionsWithValue: ResultOptionsWithValue = options ?? {};
    optionsWithValue.value = value;

    return new DataResult(400, undefined, optionsWithValue);
  }

  public static redirect(url: string, status: 301 | 302 = 302, options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(status,url, sanitized);
  }

  public static notFound(options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(404, undefined, sanitized);
  }

  public static unauthorized(options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(401, undefined, sanitized);
  }
}

export class ViewResult extends Result {
  // Used to ensure that UnthinkDataResult can't be assigned to this class
  public readonly __type: 'VIEW_RESULT';

  public readonly template?: string;

  private constructor(
    status: number,
    template?: string,
    redirectUrl?: string,
    options?: ResultOptionsWithValue
  ) {
    super(status, options?.value, options?.cookies, options?.headers, redirectUrl);

    this.template = template;
  }

  public static ok(template: string, options?: ResultOptionsWithValue): ViewResult {
    return new ViewResult(200, template, undefined, options);
  }

  public static redirect(url: string, status: 301 | 302 = 302, options?: ResultOptionsNoValue): ViewResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new ViewResult(status,undefined, url, sanitized);
  }

  public static error(template: string, options?: ResultOptionsWithValue): ViewResult {
    return new ViewResult(400, template, undefined,  options);
  }

  public static notFound(template: string, options?: ResultOptionsWithValue): ViewResult {
    return new ViewResult(404, template, undefined, options);
  }

  public static unauthorized(template: string, options?: ResultOptionsWithValue): ViewResult {
    return new ViewResult(401, template, undefined, options);
  }
}

export class MiddlewareResult extends Result {
  // Used to ensure UnthinkViewResult can't be assigned to this class.
  public readonly __type: 'MIDDLEWARE_RESULT';

  public readonly continue: boolean;
  public readonly end: boolean;

  private constructor(
    status: number,
    cont: boolean,
    end: boolean,
    redirectUrl?: string,
    options?: ResultOptionsWithValue
  ) {
    super(status, options?.value, options?.cookies, options?.headers, redirectUrl);

    this.continue = cont;
    this.end = end;
  }

  /**
   * Advances to the next middleware. To pass data along to the next middleware handler or route handler
   * set options.value. Context.local will be set to the merged values of previous Middleware.continue.
   * @param options
   */
  public static continue(options?: ResultOptionsWithValue): MiddlewareResult {
    // Status being set for compatibility with "result" this may shift as we flesh out
    // middleware a bit more.
    return new MiddlewareResult(200, true, false, undefined, options);
  }

  /**
   * Will end the request with the given status and setting the body to options.value. For view routes the render
   * function will be skipped so any rendering of templates would need to be done explicitly in the middleware.
   *
   * This choice is intentional to allow middleware to handle things like caching or other events that may require it to
   * end the request with some content.
   *
   * @param status
   * @param options
   */
  public static end(status: number, options?: ResultOptionsWithValue): MiddlewareResult {
    return new MiddlewareResult(status, false, true, undefined, options);
  }

  public static error(value: unknown, options?: ResultOptionsNoValue): MiddlewareResult {
    const optionsWithValue: ResultOptionsWithValue = options ?? {};
    optionsWithValue.value = value;

    return new MiddlewareResult(400, false, false, undefined, optionsWithValue);
  }

  public static redirect(url: string, status: 301 | 302 = 302, options?: ResultOptionsNoValue): MiddlewareResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new MiddlewareResult(status,false, false, url, sanitized);
  }

  public static notFound(options?: ResultOptionsNoValue): MiddlewareResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new MiddlewareResult(404, false, false, undefined, sanitized);
  }

  public static unauthorized(options?: ResultOptionsNoValue): MiddlewareResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new MiddlewareResult(401, false, false, undefined, sanitized);
  }
}
