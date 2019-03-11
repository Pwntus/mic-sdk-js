import CognitoIdentity = require('aws-sdk/clients/cognitoidentity');
import { device } from 'aws-iot-device-sdk';
import axios from 'axios';

import {
  ICredentials,
  IHeaders,
  IManifest,
  IMetadataManifest,
  IOptions,
  IPermissions,
  IUser,
} from './types';

import {
  DEFAULT_STACK,
  ROOT_STACK,
} from './constants';

export default class MIC {
  public manifest: IManifest;
  public metadataManifest: IMetadataManifest;
  public user: IUser | null;
  public credentials: ICredentials | null;
  public permissions: IPermissions | null;

  private config: IOptions;

  constructor () {
    // Default config
    this.config = {
      password: null,
      stack: DEFAULT_STACK,
      username: null,
    };
    this.manifest = {};
    this.metadataManifest = {};
    this.user = null;
    this.credentials = null;
    this.permissions = null;
  }

  /**
   * Init SDK by setting desired stack, username
   * and password. Proceed with fetching the manifest
   * and manifest metadata (to get the API key) and
   * then login.
   * @param config MIC SDK init configuration
   */
  public async init (config: IOptions) {
    try {
      const { stack, username, password } = config;
      this.config = {
        password: password || null,
        stack: stack || DEFAULT_STACK,
        username: username || null,
      };

      await this.getManifest();
      await this.getMetadataManifest();
      await this.login();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetch manifest based on provided user
   * configuration.
   */
  private async getManifest () {
    try {
      if (!this.config.stack) {
        throw new Error('Missing MIC stack');
      }

      const URL = `${ROOT_STACK}/manifest`;
      const { data } = await axios.get(URL, {
        params: {
          hostname: this.config.stack,
        },
      });
      this.manifest = data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Compose the current MIC stack endpoint
   * based on the manifest JSON.
   */
  private getStackEndpoint (): string {
    try {
      const { ApiGatewayRootUrl, StackName } = this.manifest;

      if (!ApiGatewayRootUrl) {
        throw new Error('Missing ApiGatewayRootUrl');
      }
      if (!StackName) {
        throw new Error('Missing StackName');
      }

      return `${ApiGatewayRootUrl}/${StackName}`;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetch manifest metadata based on provided
   * manifest.
   */
  private async getMetadataManifest () {
    try {
      const URL = `${this.getStackEndpoint()}/metadata/manifest`;
      const { data } = await axios.get(URL);
      this.metadataManifest = data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Login a user based on provided user
   * configuration.
   */
  private async login () {
    try {
      const { username, password } = this.config;

      if (!username) {
        throw new Error('Missing username');
      }
      if (!password) {
        throw new Error('Missing password');
      }

      const headers = this.getHeaders();
      const URL = `${this.getStackEndpoint()}/auth/login`;

      const {
        data: {
          user,
          credentials,
          permissions,
        },
      } = await axios.request({
        headers,
        url: URL,
        method: 'post',
        data: {
          password,
          userName: username,
        },
      });

      this.user = user;
      this.credentials = credentials;
      this.permissions = permissions;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Compose a headers object based on provided
   * manifest and authenticated user. If no
   * 'credentials' object present, just return an
   * object with the 'x-api-key' property set.
   */
  private getHeaders (): IHeaders {
    try {
      const { ApiKey } = this.metadataManifest;

      if (!ApiKey) {
        throw new Error('Missing ApiKey');
      }

      let authCredentials = {};
      if (this.credentials) {
        const { token, identityId } = this.credentials;
        authCredentials = {
          identityId,
          Authorization: token,
        };
      }

      return {
        'x-api-key': ApiKey,
        ...authCredentials,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Refresh credentials based on currently
   * authenticated user and the refreshToken.
   */
  private async refresh () {
    try {
      const { ApiKey } = this.metadataManifest;

      if (!ApiKey) {
        throw new Error('Missing ApiKey');
      }

      if (!this.credentials) {
        throw new Error('Missing credentials');
      }

      const { refreshToken } = this.credentials;

      if (!refreshToken) {
        throw new Error('Missing refreshToken');
      }

      const URL = `${this.getStackEndpoint()}/auth/refresh`;

      const {
        data: {
          user,
          credentials,
          permissions,
        },
      } = await axios.request({
        url: URL,
        method: 'post',
        headers: {
          'x-api-key': ApiKey,
        },
        data: {
          refreshToken,
        },
      });

      this.user = user;
      this.credentials = credentials;
      this.permissions = permissions;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Try making an API call, but check response
   * status code and try to refresh credentials
   * before trying one more time. If all else fails
   * throw error.
   * @param requestObject Axios request object
   */
  private async tryCall (requestObject: object) {
    try {
      const axiosRequestObject = Object.assign(requestObject, {
        headers: this.getHeaders(),
      });

      const { data, status } = await axios.request(axiosRequestObject);

      if (status !== 200) {
        await this.refresh();
        axiosRequestObject.headers = this.getHeaders();
        const { data, status } = await axios.request(axiosRequestObject);

        if (status !== 200) {
          throw new Error(data);
        } else {
          return data;
        }
      }

      return data;
    } catch (e) {
      throw e;
    }
  }

  private async getCognitoCredentials () {
    try {
      if (!this.credentials) {
        throw new Error('User is not authenticated');
      }

      const { identityId, token } = this.credentials;
      const { Region, UserPool } = this.manifest;

      const cognitoIdentityPool = new CognitoIdentity({ region: Region });
      const params = {
        IdentityId: identityId,
        Logins: {
          [`cognito-idp.${Region}.amazonaws.com/${UserPool}`]: token
        }
      };

      return await cognitoIdentityPool.getCredentialsForIdentity(params).promise();
    } catch (e) {
      throw e;
    }
  }

  public async mqtt () {
    try {
      // Get Cognito credentials
      const { Credentials } = await this.getCognitoCredentials();

      if (!Credentials) {
        throw new Error('Failed to fetch Cognito credentials');
      }

      const { AccessKeyId, SecretKey, SessionToken } = Credentials;
      const { IotEndpointATS, Region } = this.manifest;

      // Return new AWS IoT device
      return new device({
        host: IotEndpointATS,
        region: Region,
        protocol: 'wss',
        clientId: 'foo',
        accessKeyId: AccessKeyId,
        secretKey: SecretKey,
        sessionToken: SessionToken
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Convenience method to query the
   * [POST]: /observations/find endpoint.
   * @param query Elasticsearch query DSL
   */
  public async elasticsearch (query: object) {
    try {
      return this.post('/observations/find', query);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Convenience method to query the
   * [POST]: /graphql endpoint.
   * @param payload GraphQL payload
   */
  public async graphql (payload: object) {
    try {
      return this.post('/graphql', payload);
    } catch (e) {
      throw e;
    }
  }

  public async post (endpoint: string, body: object = {}) {
    try {
      return await this.tryCall({
        method: 'post',
        url: this.getStackEndpoint() + endpoint,
        data: body,
      });
    } catch (e) {
      throw e;
    }
  }

  public async get (endpoint: string, queryParams: object = {}) {
    try {
      return await this.tryCall({
        method: 'get',
        url: this.getStackEndpoint() + endpoint,
        params: queryParams,
      });
    } catch (e) {
      throw e;
    }
  }
}
