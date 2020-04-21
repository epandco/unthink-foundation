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
    public readonly headers?: Record<string, string>
  ) {}
}

export interface ResultOptionsWithValue {
  value?: unknown;
  cookies?: Cookie[];
  headers?: Record<string, string>;
}

/** Used primarily in data routes where we want to force a value and it not show up in the options */
export interface ResultOptionsNoValue {
  cookies?: Cookie[];
  headers?: Record<string, string>;
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
  private readonly __type: 'DATA_RESULT';

  private constructor(
    status: number,
    options?: ResultOptionsWithValue
  ) {
    super(status, options?.value, options?.cookies, options?.headers);

    // dummy read to compile - see notes above
    this.__type;
  }

  public static ok(value: unknown, options?: ResultOptionsNoValue): DataResult {
    const optionsWithValue: ResultOptionsWithValue = options ?? {};
    optionsWithValue.value = value;

    return new DataResult(200, optionsWithValue);
  }

  public static noResult(options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(204, sanitized);
  }

  public static error(value: unknown, options?: ResultOptionsNoValue): DataResult {
    const optionsWithValue: ResultOptionsWithValue = options ?? {};
    optionsWithValue.value = value;

    return new DataResult(400, options);
  }

  public static notFound(options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(404, sanitized);
  }

  public static unauthorized(options?: ResultOptionsNoValue): DataResult {
    const sanitized = ensureNoValueOnOptions(options);
    return new DataResult(401, sanitized);
  }
}

export class ViewResult extends Result {
  // Used to ensure that UnthinkDataResult can't be assigned to this class
  private readonly __type: 'VIEW_RESULT';

  public template?: string;
  public redirectUrl?: string;

  private constructor(
    status: number,
    template?: string,
    redirectUrl?: string,
    options?: ResultOptionsWithValue
  ) {
    super(status, options?.value, options?.cookies, options?.headers);

    // Dummy read to compile
    this.__type;
    this.template = template;
    this.redirectUrl = redirectUrl;
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
