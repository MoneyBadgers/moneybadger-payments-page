/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Invoice {
  amount_cents?: number;
  currency?: string;
  /**
   * when this invoice will expire (UTC Time)
   * @format date-time
   */
  expires_at?: string;
  id?: string;
  merchant_code?: string;
  merchant_name?: string;
  order_description?: string;
  /** Merchant's order ID */
  order_id?: string;
  /**
   * when this invoice was paid (UTC Time)
   * @format date-time
   */
  paid_at?: string;
  /** Payment request details. This is what needs to be provided to the user to make payment */
  payment_request?: PaymentRequest;
  /** Invoice Status */
  status?: InvoiceStatusEnum;
  status_webhook_url?: string;
}

export interface InvoiceRequest {
  /** Allowed payment methods, in preferred order */
  allowed_payment_methods?: string[];
  /** @format int64 */
  amount_cents: number;
  /**
   * Amount in sats. This is needed for LNURL payments, when an exact sats amount is required.
   * @format int64
   */
  amount_sats?: number;
  /**
   * Automatically confirm the invoice when paid
   * @example false
   */
  auto_confirm?: boolean;
  /**
   * Payment request currency code. If none specified, merchant default is used, otherwise 'ZAR'
   * @example "ZAR"
   */
  currency?: string;
  device_id?: string;
  order_description?: string;
  order_id?: string;
  /** Allowed payment currencies, in order of preference. If none specified, merchant default and/or value store default is used, otherwise 'BTC'. NB: Not all value stores support multiple currencies. */
  payment_currencies?: string[];
  scan_id?: string;
  status_webhook_url?: string;
  /** Sub Merchant information */
  sub_merchant?: SubMerchant;
  timeout_in_seconds?: number;
  transaction_id?: string;
  user_id?: string;
}

export interface InvoiceStatusUpdate {
  invoice?: {
    id?: any;
    order_id?: any;
  };
}

export interface InvoiceUpdatePaymentMethod {
  /** Allowed payment currencies, in order of preference. If none specified, merchant default and/or value store default is used, otherwise 'BTC'. NB: Not all value stores support multiple currencies. */
  payment_currencies?: string[];
  /**
   * Payment method to use for invoice
   * @example "lightning"
   */
  payment_method?: string;
  /** Recipient to refund to (optional, dependent on payment method) */
  refund_recipient?: RefundRecipient;
  /** Transaction ID for payment method */
  transaction_id?: string;
}

export interface Merchant {
  id?: string;
  logoUrl?: string;
  name?: string;
}

/** Payment request details. This is what needs to be provided to the user to make payment */
export interface PaymentRequest {
  /** @example 100.00007 */
  amount?: number;
  /** @example "BTC" */
  currency?: string;
  /** encoded data for use by app/value store. e.g. lightning invoice, deeplink, etc. */
  data?: string;
  /** deeplink for app to open and complete payment */
  deeplink?: string;
  /** @example "sats" */
  denomination?: string;
  /**
   * Conversion rate from fiat to crypto
   * @format double
   * @example 0.05
   */
  exchange_rate?: number;
  /**
   * when this payment will expire (UTC Time). May differ from the Invoice (e.g. for lightning)
   * @format date-time
   */
  expires_at?: string;
  /**
   * Overpayment amount in fiat currency of invoice
   * @example 0.01
   */
  over_payment?: number;
  /**
   * list of payment method types with payment instruction data the client can use to complete payment
   * @example {"luno|XBT":"currency=xbt&amount=0.013"}
   */
  payment_methods?: Record<string, object>;
  /** QR code content (string, usually a URL or encoded data) */
  qr_code_content?: string;
  /** Url for QR code representation of encoded data (for use in webpage) */
  qr_code_url?: string;
  /** UserID is the id used by the partner to identify their user */
  user_id?: string;
  /** @example "binance" */
  value_store?: string;
}

export interface Refund {
  /** @format date-time */
  created_at?: string;
  /** ID is the id of the refund */
  id?: string;
  /** Invoice ID is the id of the invoice to refund */
  invoice_id?: string;
  refund_amount?: number;
  refund_currency?: string;
  request_amount_cents?: number;
  request_currency?: string;
  /** Status is the status of the refund */
  status?: RefundStatusEnum;
  /** @format date-time */
  updated_at?: string;
}

export interface RefundRecipient {
  /** Address to send refund to */
  address?: string;
}

export interface RefundRequest {
  amount_cents?: number;
  currency?: string;
  /** Invoice ID is the id of the invoice to refund */
  invoice_id?: string;
}

/** Sub Merchant details. */
export interface SubMerchant {
  /** Sub Merchant unique id */
  id: string;
  /** Sub Merchant category code */
  mcc: string;
  /** Sub Merchant name */
  name: string;
}

/** Invoice Status */
export enum InvoiceStatusEnum {
  REQUESTED = "REQUESTED",
  AUTHORIZED = "AUTHORIZED",
  CONFIRMED = "CONFIRMED",
  TIMED_OUT = "TIMED_OUT",
  CANCELLED = "CANCELLED",
  ERROR = "ERROR",
}

/** Status is the status of the refund */
export enum RefundStatusEnum {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}

/** Retrieve invoice by (id or orderId) */
export enum GetInvoiceParamsByEnum {
  ID = "ID",
  ORDER_ID = "ORDER_ID",
  LIGHTNING_INVOICE = "LIGHTNING_INVOICE",
}

/** Retrieve invoice by (id or orderId) */
export enum CancelInvoiceParamsByEnum {
  Id = "id",
  OrderId = "orderId",
}

/** Retrieve invoice by (id or orderId) */
export enum ConfirmInvoiceParamsByEnum {
  Id = "id",
  OrderId = "orderId",
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://api.cryptoqr.net/api/v2";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MoneyBadger Payments API
 * @version 2.0.0
 * @license MoneyBadger (https://moneybadger.co.za/license)
 * @termsOfService https://moneybadger.co.za/terms
 * @baseUrl http://api.cryptoqr.net/api/v2
 * @contact <info@moneybadger.co.za>
 *
 * MoneyBadger Payments API
 */
export class InvoiceApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  health = {
    /**
     * @description Returns health check status
     *
     * @tags info
     * @name HealthCheck
     * @summary Health check
     * @request GET:/health
     */
    healthCheck: (params: RequestParams = {}) =>
      this.request<
        {
          /** API build */
          build?: string;
          /** Health check message */
          message?: string;
        },
        any
      >({
        path: `/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  invoice = {
    /**
     * No description
     *
     * @tags invoice
     * @name RequestInvoice
     * @summary Request a new Invoice
     * @request POST:/invoice
     * @secure
     */
    requestInvoice: (body: InvoiceRequest, params: RequestParams = {}) =>
      this.request<Invoice, void>({
        path: `/invoice`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  invoices = {
    /**
     * @description Returns an array of Invoice objects according to query parameters
     *
     * @tags invoice
     * @name GetInvoiceHistory
     * @summary Get invoice history with various filters
     * @request GET:/invoices/
     * @secure
     */
    getInvoiceHistory: (
      query?: {
        /**
         * only show invoices created after this date/time (UTC)
         * @format date-time
         */
        startTime?: string;
        /**
         * only show invoices created before this date/time (UTC)
         * @format date-time
         */
        endTime?: string;
        /** Maximum number of objects to return */
        limit?: number;
        /** Number of invoices to skip */
        skip?: number;
        /** Filter invoices by status (REQUESTED, AUTHORIZED, CONFIRMED, TIMED_OUT, CANCELLED, ERROR). Provide value as comma-separated list. */
        statusList?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Invoice[], void>({
        path: `/invoices/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single invoice
     *
     * @tags invoice
     * @name GetInvoice
     * @summary Find invoice by ID or merchant order ID
     * @request GET:/invoices/{id}
     * @secure
     */
    getInvoice: (
      id: string,
      query?: {
        /** Retrieve invoice by (id or orderId) */
        by?: GetInvoiceParamsByEnum;
        /**
         * wait the specified number of seconds until invoice state changes ( max 10 seconds. The current invoice record will be returned once the 'wait' timeout has expired. ).
         * @min 1
         * @max 10
         */
        wait?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Invoice, void>({
        path: `/invoices/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags invoice
     * @name CancelInvoice
     * @summary Cancel an invoice
     * @request POST:/invoices/{id}/cancel
     * @secure
     */
    cancelInvoice: (
      id: string,
      query?: {
        /** Retrieve invoice by (id or orderId) */
        by?: CancelInvoiceParamsByEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<Invoice, void>({
        path: `/invoices/${id}/cancel`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags invoice
     * @name ConfirmInvoice
     * @summary Confirm an invoice
     * @request POST:/invoices/{id}/confirm
     * @secure
     */
    confirmInvoice: (
      id: string,
      query?: {
        /** Retrieve invoice by (id or orderId) */
        by?: ConfirmInvoiceParamsByEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<Invoice, void>({
        path: `/invoices/${id}/confirm`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags invoice
     * @name UpdatePaymentMethod
     * @summary Update payment method for an invoice
     * @request POST:/invoices/{id}/payment_methods
     * @secure
     */
    updatePaymentMethod: (
      id: string,
      body: InvoiceUpdatePaymentMethod,
      params: RequestParams = {},
    ) =>
      this.request<Invoice, void>({
        path: `/invoices/${id}/payment_methods`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  merchants = {
    /**
     * @description Returns merchant information
     *
     * @tags merchant
     * @name GetMerchantInfo
     * @summary Get merchant information
     * @request GET:/merchants
     */
    getMerchantInfo: (
      query: {
        /** The merchant's unique URL code resembling the merchant's name */
        code: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Merchant, void>({
        path: `/merchants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  qrpng = {
    /**
     * @description Returns the QR code PNG image associated with the given ID
     *
     * @tags png
     * @name GetQrPng
     * @summary Get QR code as a PNG image.
     * @request GET:/qrpng/{id}.png
     */
    getQrPng: (id: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/qrpng/${id}.png`,
        method: "GET",
        format: "blob",
        ...params,
      }),
  };
  refund = {
    /**
     * No description
     *
     * @tags invoice
     * @name RequestRefund
     * @summary Request a new Refund
     * @request POST:/refund
     * @secure
     */
    requestRefund: (body: RefundRequest, params: RequestParams = {}) =>
      this.request<Refund, void>({
        path: `/refund`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  swaggerJson = {
    /**
     * @description Returns API swagger spec
     *
     * @tags info
     * @name GetSwaggerSpec
     * @summary Get API swagger spec
     * @request GET:/swagger.json
     */
    getSwaggerSpec: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/swagger.json`,
        method: "GET",
        ...params,
      }),
  };
}
