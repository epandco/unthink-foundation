
export class Result {
  protected constructor(
    public readonly status: number,
    public readonly value?: unknown,
    public readonly cookies?: unknown,
    public readonly headers?: Record<string, string>
  ) {}
}

export class DataResult extends Result {
  // Used to ensure UnthinkViewResult can't be assigned to this class.
  private readonly __type: 'DATA_RESULT';

  private constructor(
    status: number,
    value?: unknown,
    cookies?: unknown,
    headers?: Record<string, string>
  ) {
    super(status, value, cookies, headers);

    // dummy read to compile - see notes above
    this.__type;
  }

  public static ok(value?: unknown, cookies?: unknown, headers?: Record<string, string>): DataResult {
    const status = value ? 200 : 204;
    return new DataResult(status, value, cookies, headers);
  }

  public static error(value?: unknown, cookies?: unknown, headers?: Record<string, string>): DataResult {
    return new DataResult(400, value, cookies, headers);
  }

  public static notFound(cookies?: unknown, headers?: Record<string, string>): DataResult {
    return new DataResult(404, undefined, cookies, headers);
  }

  public static unauthorized(cookies?: unknown, headers?: Record<string, string>): DataResult {
    return new DataResult(401, undefined, cookies, headers);
  }
}

export class ViewResult extends Result {
  // Used to ensure that UnthinkDataResult can't be assigned to this class
  private readonly __type: 'VIEW_RESULT';

  public template?: string;
  public redirectUrl?: string;

  private constructor(
    status: number,
    value?: unknown,
    cookies?: unknown,
    headers?: Record<string, string>,
    template?: string,
    redirectUrl?: string
  ) {
    super(status, value, cookies, headers);

    // Dummy read to compile
    this.__type;
    this.template = template;
    this.redirectUrl = redirectUrl;
  }

  public static ok(template: string, value?: unknown, cookies?: unknown, headers?: Record<string, string>): ViewResult {
    return new ViewResult(200, value, cookies, headers, template);
  }

  public static redirect(url: string, status: 301 | 302 = 302, cookies?: unknown, headers?: Record<string, string>): ViewResult {
    return new ViewResult(status,undefined, cookies, headers, undefined, url);
  }

  public static error(template: string, value?: unknown,  cookies?: unknown, headers?: Record<string, string>): ViewResult {
    return new ViewResult(400, value, cookies, headers, template);
  }

  public static notFound(template: string, value?: unknown, cookies?: unknown, headers?: Record<string, string>): ViewResult {
    return new ViewResult(404, value, cookies, headers, template);
  }

  public static unauthorized(template: string, value?: unknown, cookies?: unknown, headers?: Record<string, string>): ViewResult {
    return new ViewResult(401, value, cookies, headers, template);
  }
}
