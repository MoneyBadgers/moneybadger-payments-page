/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * CryptoConvert Payments API
 * CryptoConvert Payments API
 *
 * OpenAPI spec version: 2.0.0
 * Contact: info@cryptoconvert.co.za
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as url from 'url'
import * as portableFetch from 'portable-fetch'
import { Configuration } from './configuration'

const BASE_PATH = 'http://api.cryptoqr.co.za/api/v2'.replace(/\/+$/, '')

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|'
}

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
  (url: string, init?: any): Promise<Response>
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
  url: string
  options: any
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
  protected configuration?: Configuration

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected fetch: FetchAPI = portableFetch
  ) {
    if (configuration) {
      this.configuration = configuration
      this.basePath = configuration.basePath || this.basePath
    }
  }
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
  name = 'RequiredError'
  constructor(
    public field: string,
    msg?: string
  ) {
    super(msg)
  }
}

/**
 *
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
  /**
   * API build
   * @type {string}
   * @memberof InlineResponse200
   */
  build?: string
  /**
   * Health check message
   * @type {string}
   * @memberof InlineResponse200
   */
  message?: string
}

/**
 *
 * @export
 * @interface Invoice
 */
export interface Invoice {
  /**
   *
   * @type {number}
   * @memberof Invoice
   */
  amountCents?: number
  /**
   *
   * @type {string}
   * @memberof Invoice
   */
  currency?: string
  /**
   * when this invoice will expire (UTC Time)
   * @type {Date}
   * @memberof Invoice
   */
  expiresAt?: Date
  /**
   *
   * @type {string}
   * @memberof Invoice
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof Invoice
   */
  orderDescription?: string
  /**
   * Merchant's order ID
   * @type {string}
   * @memberof Invoice
   */
  orderId?: string
  /**
   * when this invoice was paid (UTC Time)
   * @type {Date}
   * @memberof Invoice
   */
  paidAt?: Date
  /**
   *
   * @type {PaymentRequest}
   * @memberof Invoice
   */
  paymentRequest?: PaymentRequest
  /**
   * Invoice Status
   * @type {string}
   * @memberof Invoice
   */
  status?: Invoice.StatusEnum
  /**
   *
   * @type {string}
   * @memberof Invoice
   */
  statusWebhookUrl?: string
}

/**
 * @export
 * @namespace Invoice
 */
export namespace Invoice {
  /**
   * @export
   * @enum {string}
   */
  export enum StatusEnum {
    REQUESTED = <any>'REQUESTED',
    AUTHORIZED = <any>'AUTHORIZED',
    CONFIRMED = <any>'CONFIRMED',
    TIMEDOUT = <any>'TIMED_OUT',
    CANCELLED = <any>'CANCELLED',
    ERROR = <any>'ERROR'
  }
}

/**
 *
 * @export
 * @interface InvoiceRequest
 */
export interface InvoiceRequest {
  /**
   * Allowed payment methods, in preferred order
   * @type {Array<string>}
   * @memberof InvoiceRequest
   */
  allowedPaymentMethods?: Array<string>
  /**
   *
   * @type {number}
   * @memberof InvoiceRequest
   */
  amountCents: number
  /**
   * Payment request currency code. If none specified, merchant default is used, otherwise 'ZAR'
   * @type {string}
   * @memberof InvoiceRequest
   */
  currency?: string
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  deviceId?: string
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  orderDescription?: string
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  orderId?: string
  /**
   * Allowed payment currencies, in order of preference. If none specified, merchant default and/or value store default is used, otherwise 'BTC'. NB: Not all value stores support multiple currencies.
   * @type {Array<string>}
   * @memberof InvoiceRequest
   */
  paymentCurrencies?: Array<string>
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  scanId?: string
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  statusWebhookUrl?: string
  /**
   *
   * @type {number}
   * @memberof InvoiceRequest
   */
  timeoutInSeconds?: number
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  transactionId?: string
  /**
   *
   * @type {string}
   * @memberof InvoiceRequest
   */
  userId?: string
}

/**
 *
 * @export
 * @interface InvoiceStatusUpdate
 */
export interface InvoiceStatusUpdate {
  /**
   *
   * @type {InvoiceStatusUpdateInvoice}
   * @memberof InvoiceStatusUpdate
   */
  invoice?: InvoiceStatusUpdateInvoice
}

/**
 *
 * @export
 * @interface InvoiceStatusUpdateInvoice
 */
export interface InvoiceStatusUpdateInvoice {
  /**
   *
   * @type {Invoicepropertiesid}
   * @memberof InvoiceStatusUpdateInvoice
   */
  id?: Invoicepropertiesid
  /**
   *
   * @type {InvoicepropertiesorderId}
   * @memberof InvoiceStatusUpdateInvoice
   */
  orderId?: InvoicepropertiesorderId
}

/**
 *
 * @export
 * @interface Merchant
 */
export interface Merchant {
  /**
   *
   * @type {string}
   * @memberof Merchant
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof Merchant
   */
  logoUrl?: string
  /**
   *
   * @type {string}
   * @memberof Merchant
   */
  name?: string
}

/**
 * Payment request details. This is what needs to be provided to the user to make payment
 * @export
 * @interface PaymentRequest
 */
export interface PaymentRequest {
  /**
   *
   * @type {number}
   * @memberof PaymentRequest
   */
  amount?: number
  /**
   *
   * @type {string}
   * @memberof PaymentRequest
   */
  currency?: string
  /**
   * encoded data for use by app/value store. e.g. lightning invoice, deeplink, etc.
   * @type {string}
   * @memberof PaymentRequest
   */
  data?: string
  /**
   *
   * @type {string}
   * @memberof PaymentRequest
   */
  denomination?: string
  /**
   * Conversion rate from fiat to crypto
   * @type {number}
   * @memberof PaymentRequest
   */
  exchangeRate?: number
  /**
   * when this payment will expire (UTC Time). May differ from the Invoice (e.g. for lightning)
   * @type {Date}
   * @memberof PaymentRequest
   */
  expiresAt?: Date
  /**
   * list of payment method types with payment instruction data the client can use to complete payment
   * @type {{ [key: string]: any; }}
   * @memberof PaymentRequest
   */
  paymentMethods?: { [key: string]: any }
  /**
   * Url for QR code representation of encoded data (for use in webpage)
   * @type {string}
   * @memberof PaymentRequest
   */
  qrCodeUrl?: string
  /**
   *
   * @type {string}
   * @memberof PaymentRequest
   */
  valueStore?: string
}

/**
 * InfoApi - fetch parameter creator
 * @export
 */
export const InfoApiFetchParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Returns API swagger spec
     * @summary Get API swagger spec
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getSwaggerSpec(options: any = {}): FetchArgs {
      const localVarPath = `/swagger.json`
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    },
    /**
     * Returns health check status
     * @summary Health check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthCheck(options: any = {}): FetchArgs {
      const localVarPath = `/health`
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    }
  }
}

/**
 * InfoApi - functional programming interface
 * @export
 */
export const InfoApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Returns API swagger spec
     * @summary Get API swagger spec
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getSwaggerSpec(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string> {
      const localVarFetchArgs = InfoApiFetchParamCreator(configuration).getSwaggerSpec(options)
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    },
    /**
     * Returns health check status
     * @summary Health check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthCheck(
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse200> {
      const localVarFetchArgs = InfoApiFetchParamCreator(configuration).healthCheck(options)
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    }
  }
}

/**
 * InfoApi - factory interface
 * @export
 */
export const InfoApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Returns API swagger spec
     * @summary Get API swagger spec
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getSwaggerSpec(options?: any) {
      return InfoApiFp(configuration).getSwaggerSpec(options)(fetch, basePath)
    },
    /**
     * Returns health check status
     * @summary Health check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthCheck(options?: any) {
      return InfoApiFp(configuration).healthCheck(options)(fetch, basePath)
    }
  }
}

/**
 * InfoApi - object-oriented interface
 * @export
 * @class InfoApi
 * @extends {BaseAPI}
 */
export class InfoApi extends BaseAPI {
  /**
   * Returns API swagger spec
   * @summary Get API swagger spec
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InfoApi
   */
  public getSwaggerSpec(options?: any) {
    return InfoApiFp(this.configuration).getSwaggerSpec(options)(this.fetch, this.basePath)
  }

  /**
   * Returns health check status
   * @summary Health check
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InfoApi
   */
  public healthCheck(options?: any) {
    return InfoApiFp(this.configuration).healthCheck(options)(this.fetch, this.basePath)
  }
}

/**
 * InvoiceApi - fetch parameter creator
 * @export
 */
export const InvoiceApiFetchParamCreator = function (configuration?: Configuration) {
  return {
    /**
     *
     * @summary Cancel an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    cancelInvoice(id: string, by?: 'id' | 'orderId', options: any = {}): FetchArgs {
      // verify required parameter 'id' is not null or undefined
      if (id === null || id === undefined) {
        throw new RequiredError(
          'id',
          'Required parameter id was null or undefined when calling cancelInvoice.'
        )
      }
      const localVarPath = `/invoices/{id}/cancel`.replace(
        `{${'id'}}`,
        encodeURIComponent(String(id))
      )
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'POST' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      // authentication APIKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-API-Key')
            : configuration.apiKey
        localVarHeaderParameter['X-API-Key'] = localVarApiKeyValue
      }

      if (by !== undefined) {
        localVarQueryParameter['by'] = by
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    },
    /**
     *
     * @summary Confirm an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    confirmInvoice(id: string, by?: 'id' | 'orderId', options: any = {}): FetchArgs {
      // verify required parameter 'id' is not null or undefined
      if (id === null || id === undefined) {
        throw new RequiredError(
          'id',
          'Required parameter id was null or undefined when calling confirmInvoice.'
        )
      }
      const localVarPath = `/invoices/{id}/confirm`.replace(
        `{${'id'}}`,
        encodeURIComponent(String(id))
      )
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'POST' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      // authentication APIKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-API-Key')
            : configuration.apiKey
        localVarHeaderParameter['X-API-Key'] = localVarApiKeyValue
      }

      if (by !== undefined) {
        localVarQueryParameter['by'] = by
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    },
    /**
     * Returns a single invoice
     * @summary Find invoice by ID or merchant order ID
     * @param {string} id ID of invoice or merchant order ID
     * @param {'ID' | 'ORDER_ID'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInvoice(id: string, by?: 'ID' | 'ORDER_ID', options: any = {}): FetchArgs {
      // verify required parameter 'id' is not null or undefined
      if (id === null || id === undefined) {
        throw new RequiredError(
          'id',
          'Required parameter id was null or undefined when calling getInvoice.'
        )
      }
      const localVarPath = `/invoices/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)))
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      // authentication APIKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-API-Key')
            : configuration.apiKey
        localVarHeaderParameter['X-API-Key'] = localVarApiKeyValue
      }

      // authentication merchantCode required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-Merchant-Code')
            : configuration.apiKey
        localVarHeaderParameter['X-Merchant-Code'] = localVarApiKeyValue
      }

      if (by !== undefined) {
        localVarQueryParameter['by'] = by
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    },
    /**
     *
     * @summary Request a new Invoice
     * @param {InvoiceRequest} body Invoice request details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    requestInvoice(body: InvoiceRequest, options: any = {}): FetchArgs {
      // verify required parameter 'body' is not null or undefined
      if (body === null || body === undefined) {
        throw new RequiredError(
          'body',
          'Required parameter body was null or undefined when calling requestInvoice.'
        )
      }
      const localVarPath = `/invoice`
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'POST' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      // authentication APIKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-API-Key')
            : configuration.apiKey
        localVarHeaderParameter['X-API-Key'] = localVarApiKeyValue
      }

      // authentication merchantCode required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-Merchant-Code')
            : configuration.apiKey
        localVarHeaderParameter['X-Merchant-Code'] = localVarApiKeyValue
      }

      localVarHeaderParameter['Content-Type'] = 'application/json'

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)
      const needsSerialization =
        <any>'InvoiceRequest' !== 'string' ||
        localVarRequestOptions.headers['Content-Type'] === 'application/json'
      localVarRequestOptions.body = needsSerialization ? JSON.stringify(body || {}) : body || ''

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    }
  }
}

/**
 * InvoiceApi - functional programming interface
 * @export
 */
export const InvoiceApiFp = function (configuration?: Configuration) {
  return {
    /**
     *
     * @summary Cancel an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    cancelInvoice(
      id: string,
      by?: 'id' | 'orderId',
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Invoice> {
      const localVarFetchArgs = InvoiceApiFetchParamCreator(configuration).cancelInvoice(
        id,
        by,
        options
      )
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    },
    /**
     *
     * @summary Confirm an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    confirmInvoice(
      id: string,
      by?: 'id' | 'orderId',
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Invoice> {
      const localVarFetchArgs = InvoiceApiFetchParamCreator(configuration).confirmInvoice(
        id,
        by,
        options
      )
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    },
    /**
     * Returns a single invoice
     * @summary Find invoice by ID or merchant order ID
     * @param {string} id ID of invoice or merchant order ID
     * @param {'ID' | 'ORDER_ID'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInvoice(
      id: string,
      by?: 'ID' | 'ORDER_ID',
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Invoice> {
      const localVarFetchArgs = InvoiceApiFetchParamCreator(configuration).getInvoice(
        id,
        by,
        options
      )
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    },
    /**
     *
     * @summary Request a new Invoice
     * @param {InvoiceRequest} body Invoice request details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    requestInvoice(
      body: InvoiceRequest,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Invoice> {
      const localVarFetchArgs = InvoiceApiFetchParamCreator(configuration).requestInvoice(
        body,
        options
      )
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    }
  }
}

/**
 * InvoiceApi - factory interface
 * @export
 */
export const InvoiceApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     *
     * @summary Cancel an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    cancelInvoice(id: string, by?: 'id' | 'orderId', options?: any) {
      return InvoiceApiFp(configuration).cancelInvoice(id, by, options)(fetch, basePath)
    },
    /**
     *
     * @summary Confirm an invoice
     * @param {string} id ID of invoice or merchant order ID
     * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    confirmInvoice(id: string, by?: 'id' | 'orderId', options?: any) {
      return InvoiceApiFp(configuration).confirmInvoice(id, by, options)(fetch, basePath)
    },
    /**
     * Returns a single invoice
     * @summary Find invoice by ID or merchant order ID
     * @param {string} id ID of invoice or merchant order ID
     * @param {'ID' | 'ORDER_ID'} [by] Retrieve invoice by (id or orderId)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInvoice(id: string, by?: 'ID' | 'ORDER_ID', options?: any) {
      return InvoiceApiFp(configuration).getInvoice(id, by, options)(fetch, basePath)
    },
    /**
     *
     * @summary Request a new Invoice
     * @param {InvoiceRequest} body Invoice request details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    requestInvoice(body: InvoiceRequest, options?: any) {
      return InvoiceApiFp(configuration).requestInvoice(body, options)(fetch, basePath)
    }
  }
}

/**
 * InvoiceApi - object-oriented interface
 * @export
 * @class InvoiceApi
 * @extends {BaseAPI}
 */
export class InvoiceApi extends BaseAPI {
  /**
   *
   * @summary Cancel an invoice
   * @param {string} id ID of invoice or merchant order ID
   * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public cancelInvoice(id: string, by?: 'id' | 'orderId', options?: any) {
    return InvoiceApiFp(this.configuration).cancelInvoice(
      id,
      by,
      options
    )(this.fetch, this.basePath)
  }

  /**
   *
   * @summary Confirm an invoice
   * @param {string} id ID of invoice or merchant order ID
   * @param {'id' | 'orderId'} [by] Retrieve invoice by (id or orderId)
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public confirmInvoice(id: string, by?: 'id' | 'orderId', options?: any) {
    return InvoiceApiFp(this.configuration).confirmInvoice(
      id,
      by,
      options
    )(this.fetch, this.basePath)
  }

  /**
   * Returns a single invoice
   * @summary Find invoice by ID or merchant order ID
   * @param {string} id ID of invoice or merchant order ID
   * @param {'ID' | 'ORDER_ID'} [by] Retrieve invoice by (id or orderId)
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public getInvoice(id: string, by?: 'ID' | 'ORDER_ID', options?: any) {
    return InvoiceApiFp(this.configuration).getInvoice(id, by, options)(this.fetch, this.basePath)
  }

  /**
   *
   * @summary Request a new Invoice
   * @param {InvoiceRequest} body Invoice request details
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public requestInvoice(body: InvoiceRequest, options?: any) {
    return InvoiceApiFp(this.configuration).requestInvoice(body, options)(this.fetch, this.basePath)
  }
}

/**
 * MerchantApi - fetch parameter creator
 * @export
 */
export const MerchantApiFetchParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Returns merchant information
     * @summary Get merchant information
     * @param {string} code The merchant&#39;s unique URL code resembling the merchant&#39;s name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getMerchantInfo(code: string, options: any = {}): FetchArgs {
      // verify required parameter 'code' is not null or undefined
      if (code === null || code === undefined) {
        throw new RequiredError(
          'code',
          'Required parameter code was null or undefined when calling getMerchantInfo.'
        )
      }
      const localVarPath = `/merchants`
      const localVarUrlObj = url.parse(localVarPath, true)
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      if (code !== undefined) {
        localVarQueryParameter['code'] = code
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      )
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions
      }
    }
  }
}

/**
 * MerchantApi - functional programming interface
 * @export
 */
export const MerchantApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Returns merchant information
     * @summary Get merchant information
     * @param {string} code The merchant&#39;s unique URL code resembling the merchant&#39;s name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getMerchantInfo(
      code: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Merchant> {
      const localVarFetchArgs = MerchantApiFetchParamCreator(configuration).getMerchantInfo(
        code,
        options
      )
      return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          }
        )
      }
    }
  }
}

/**
 * MerchantApi - factory interface
 * @export
 */
export const MerchantApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Returns merchant information
     * @summary Get merchant information
     * @param {string} code The merchant&#39;s unique URL code resembling the merchant&#39;s name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getMerchantInfo(code: string, options?: any) {
      return MerchantApiFp(configuration).getMerchantInfo(code, options)(fetch, basePath)
    }
  }
}

/**
 * MerchantApi - object-oriented interface
 * @export
 * @class MerchantApi
 * @extends {BaseAPI}
 */
export class MerchantApi extends BaseAPI {
  /**
   * Returns merchant information
   * @summary Get merchant information
   * @param {string} code The merchant&#39;s unique URL code resembling the merchant&#39;s name
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof MerchantApi
   */
  public getMerchantInfo(code: string, options?: any) {
    return MerchantApiFp(this.configuration).getMerchantInfo(code, options)(
      this.fetch,
      this.basePath
    )
  }
}
