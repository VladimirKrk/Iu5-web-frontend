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

export interface ApiTypesApplicationDetailedResponse {
  completed_at?: string;
  created_at?: string;
  creator?: ApiTypesUserResponse;
  formed_at?: string;
  id?: number;
  items?: ApiTypesProductionItemResponse[];
  moderator?: ApiTypesUserResponse;
  production_name?: string;
  status?: string;
}

export interface ApiTypesApplicationResponse {
  /** answers_count */
  calculated_items_count?: number;
  completed_at?: string;
  created_at?: string;
  creator?: ApiTypesUserResponse;
  formed_at?: string;
  id?: number;
  /** Добавим кол-во позиций */
  items_count?: number;
  moderator?: ApiTypesUserResponse;
  status?: string;
}

export interface ApiTypesApplicationUpdateRequest {
  production_name?: string;
}

export interface ApiTypesCartInfoResponse {
  application_id?: number;
  item_count?: number;
}

export interface ApiTypesErrorResponse {
  error?: string;
}

export interface ApiTypesProductionItemResponse {
  calculation_status?: string;
  found_defects?: number;
  predicted_output?: string;
  workshop?: ApiTypesWorkshopResponse;
}

export interface ApiTypesProductionItemUpdateRequest {
  found_defects?: number;
}

export interface ApiTypesStatusResponse {
  status?: string;
}

export interface ApiTypesTokenResponse {
  token?: string;
}

export interface ApiTypesUserLoginRequest {
  login: string;
  password: string;
}

export interface ApiTypesUserRegisterRequest {
  login: string;
  password: string;
}

export interface ApiTypesUserResponse {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

export interface ApiTypesUserUpdateRequest {
  password?: string;
}

export interface ApiTypesWorkshopRequest {
  century?: string;
  description?: string;
  name: string;
}

export interface ApiTypesWorkshopResponse {
  century?: string;
  description?: string;
  extra_image_key?: string;
  id?: number;
  image_key?: string;
  name?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * @description Authenticates a user and returns a JWT token.
     *
     * @tags Auth
     * @name LoginCreate
     * @summary Log in a user
     * @request POST:/login
     */
    loginCreate: (
      credentials: ApiTypesUserLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesTokenResponse, ApiTypesErrorResponse>({
        path: `/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Invalidates the current user's JWT token by adding it to a blacklist.
     *
     * @tags Auth
     * @name LogoutCreate
     * @summary Log out a user
     * @request POST:/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<ApiTypesStatusResponse, ApiTypesErrorResponse>({
        path: `/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * @description Creates a new user account.
     *
     * @tags Auth
     * @name RegisterCreate
     * @summary Register a new user
     * @request POST:/register
     */
    registerCreate: (
      user: ApiTypesUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesUserResponse, ApiTypesErrorResponse>({
        path: `/register`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Retrieves the profile information for the authenticated user.
     *
     * @tags User
     * @name GetUsers
     * @summary Get current user's profile
     * @request GET:/users/me
     * @secure
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<ApiTypesUserResponse, ApiTypesErrorResponse>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the password for the authenticated user.
     *
     * @tags User
     * @name PutUsers
     * @summary Update current user's profile
     * @request PUT:/users/me
     * @secure
     */
    putUsers: (user: ApiTypesUserUpdateRequest, params: RequestParams = {}) =>
      this.request<ApiTypesUserResponse, ApiTypesErrorResponse>({
        path: `/users/me`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  workshopApplications = {
    /**
     * @description Get applications. Regular users see their own, moderators see all. Excludes drafts and deleted.
     *
     * @tags Applications
     * @name WorkshopApplicationsList
     * @summary Get list of applications
     * @request GET:/workshop_applications
     * @secure
     */
    workshopApplicationsList: (
      query?: {
        /** Filter by status (e.g., 'formed', 'completed') */
        status?: string;
        /** Start date for filtering (YYYY-MM-DD) */
        date_from?: string;
        /** End date for filtering (YYYY-MM-DD) */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesApplicationResponse[], ApiTypesErrorResponse>({
        path: `/workshop_applications`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user's draft application ID and item count.
     *
     * @tags Applications
     * @name InfoList
     * @summary Get cart info
     * @request GET:/workshop_applications/info
     * @secure
     */
    infoList: (params: RequestParams = {}) =>
      this.request<ApiTypesCartInfoResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/info`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get details of a single application. Users can only access their own, moderators can access any.
     *
     * @tags Applications
     * @name WorkshopApplicationsDetail
     * @summary Get an application by ID
     * @request GET:/workshop_applications/{id}
     * @secure
     */
    workshopApplicationsDetail: (id: number, params: RequestParams = {}) =>
      this.request<ApiTypesApplicationDetailedResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update fields of a draft application (e.g., production name). Only for the creator.
     *
     * @tags Applications
     * @name WorkshopApplicationsUpdate
     * @summary Update a draft application
     * @request PUT:/workshop_applications/{id}
     * @secure
     */
    workshopApplicationsUpdate: (
      id: number,
      request: ApiTypesApplicationUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesApplicationDetailedResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logically delete a draft application. Only for the creator.
     *
     * @tags Applications
     * @name WorkshopApplicationsDelete
     * @summary Delete a draft application
     * @request DELETE:/workshop_applications/{id}
     * @secure
     */
    workshopApplicationsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Change status to 'completed', calculates production output. Requires moderator rights.
     *
     * @tags Applications
     * @name CompleteCreate
     * @summary Complete a formed application (Moderator only)
     * @request POST:/workshop_applications/{id}/complete
     * @secure
     */
    completeCreate: (id: number, params: RequestParams = {}) =>
      this.request<ApiTypesApplicationDetailedResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}/complete`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Change the status of a draft application to 'formed'. Only for the creator.
     *
     * @tags Applications
     * @name FormCreate
     * @summary Submit (form) a draft application
     * @request POST:/workshop_applications/{id}/form
     * @secure
     */
    formCreate: (id: number, params: RequestParams = {}) =>
      this.request<ApiTypesApplicationDetailedResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}/form`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes the status of a formed application to 'rejected'. Requires moderator rights.
     *
     * @tags Applications
     * @name RejectCreate
     * @summary Reject a formed application (Moderator only)
     * @request POST:/workshop_applications/{id}/reject
     * @secure
     */
    rejectCreate: (id: number, params: RequestParams = {}) =>
      this.request<ApiTypesApplicationResponse, ApiTypesErrorResponse>({
        path: `/workshop_applications/${id}/reject`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  workshopProduction = {
    /**
     * @description Adds a workshop to the current user's draft.
     *
     * @tags Production (Cart)
     * @name ItemsCreate
     * @summary Add a workshop to the draft application
     * @request POST:/workshop_production/items
     * @secure
     */
    itemsCreate: (
      request: {
        workshop_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesProductionItemResponse, ApiTypesErrorResponse>({
        path: `/workshop_production/items`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes 'found_defects' for a workshop within the user's draft.
     *
     * @tags Production (Cart)
     * @name ItemsUpdate
     * @summary Update an item in a draft application
     * @request PUT:/workshop_production/{app_id}/items/{ws_id}
     * @secure
     */
    itemsUpdate: (
      appId: number,
      wsId: number,
      request: ApiTypesProductionItemUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesProductionItemResponse, ApiTypesErrorResponse>({
        path: `/workshop_production/${appId}/items/${wsId}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a workshop from the current user's draft.
     *
     * @tags Production (Cart)
     * @name ItemsDelete
     * @summary Delete an item from a draft application
     * @request DELETE:/workshop_production/{app_id}/items/{ws_id}
     * @secure
     */
    itemsDelete: (appId: number, wsId: number, params: RequestParams = {}) =>
      this.request<void, ApiTypesErrorResponse>({
        path: `/workshop_production/${appId}/items/${wsId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  workshops = {
    /**
     * @description Get all workshops with optional name filter. Publicly accessible.
     *
     * @tags Workshops
     * @name WorkshopsList
     * @summary Get list of workshops
     * @request GET:/workshops
     */
    workshopsList: (
      query?: {
        /** Filter by workshop name (case-insensitive) */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesWorkshopResponse[], ApiTypesErrorResponse>({
        path: `/workshops`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a new workshop to the database. Requires moderator rights.
     *
     * @tags Workshops
     * @name WorkshopsCreate
     * @summary Create a new workshop (Moderator only)
     * @request POST:/workshops
     * @secure
     */
    workshopsCreate: (
      workshop: ApiTypesWorkshopRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesWorkshopResponse, ApiTypesErrorResponse>({
        path: `/workshops`,
        method: "POST",
        body: workshop,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get details of a single workshop by its ID. Publicly accessible.
     *
     * @tags Workshops
     * @name WorkshopsDetail
     * @summary Get a workshop by ID
     * @request GET:/workshops/{id}
     */
    workshopsDetail: (id: number, params: RequestParams = {}) =>
      this.request<ApiTypesWorkshopResponse, ApiTypesErrorResponse>({
        path: `/workshops/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates an existing workshop's data. Requires moderator rights.
     *
     * @tags Workshops
     * @name WorkshopsUpdate
     * @summary Update a workshop (Moderator only)
     * @request PUT:/workshops/{id}
     * @secure
     */
    workshopsUpdate: (
      id: number,
      workshop: ApiTypesWorkshopRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesWorkshopResponse, ApiTypesErrorResponse>({
        path: `/workshops/${id}`,
        method: "PUT",
        body: workshop,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a workshop by its ID. Requires moderator rights.
     *
     * @tags Workshops
     * @name WorkshopsDelete
     * @summary Delete a workshop (Moderator only)
     * @request DELETE:/workshops/{id}
     * @secure
     */
    workshopsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, ApiTypesErrorResponse>({
        path: `/workshops/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Upload an image and/or extra image for a workshop. Requires moderator rights.
     *
     * @tags Workshops
     * @name ImageCreate
     * @summary Upload an image for a workshop (Moderator only)
     * @request POST:/workshops/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Main image file */
        image?: File;
        /** Extra image file */
        extra_image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiTypesWorkshopResponse, ApiTypesErrorResponse>({
        path: `/workshops/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
}
