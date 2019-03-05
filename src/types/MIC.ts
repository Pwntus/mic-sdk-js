/**
 * MIC SDK options.
 */
export interface IOptions {
  password?: string | null;
  username?: string | null;
  stack?: string;
}

/**
 * MIC manifest.
 */
export interface IManifest {
  ManifestLambda?: string;
  Rev?: string;
  ResponseLambda?: string;
  PermissionsLambda?: string;
  IdentityPool?: string;
  LogLevel?: string;
  IotEndpoint?: string;
  ThingBatchLambda?: string;
  AuthLambda?: string;
  UserPoolClient?: string;
  UserLambda?: string;
  ObservationLambda?: string;
  GraphQLLambda?: string;
  EventLambda?: string;
  ApiGatewayRootUrl?: string;
  Es5Endpoint?: string;
  FileLambda?: string;
  ManagementLambda?: string;
  Region?: string;
  ThingLambda?: string;
  ThingTypeLambda?: string;
  IotEndpointATS?: string;
  DashboardLambda?: string;
  DomainLambda?: string;
  ObservationsBucket?: string;
  SignUpVerificationMedium?: string;
  ThingGroupsLambda?: string;
  LoraLambda?: string;
  UserPool?: string;
  ConsentRequired?: string;
  ThingFilesBucket?: string;
  ThingCertsBucket?: string;
  SmsLambda?: string;
  RuleLambda?: string;
  SearchLambda?: string;
  FileLambdaV2?: string;
  ThingJobsLambda?: string;
  Protocol?: string;
  SupportedThingProtocols?: string;
  ApiKeyId?: string;
  EsVersion?: string;
  AccountNumber?: string;
  ResourceLambda?: string;
  PublicBucket?: string;
  GraphIQLLambda?: string;
  ApiId?: string;
  StackName?: string;
  MqttFn?: string;
  NbIotLambda?: string;
}

/**
 * MIC manifest metadata.
 */
export interface IMetadataManifest {
  ApiKey?: string;
  IotEndpoint?: string;
  IotEndpointATS?: string;
  IdentityPool?: string;
  UserPool?: string;
  Region?: string;
}

/**
 * MIC authenticated request headers.
 */
export interface IHeaders {
  'Authorization'?: string;
  'identityId'?: string;
  'x-api-key'?: string;
}

/**
 * MIC logged in user.
 */
export interface IUser {
  userName: string;
  roleName: 'Read' | 'ReadWrite';
  firstName: string;
  lastName: string;
  email: string;
  domainName?: string;
  domainPath?: string;
}

/**
 * MIC logged in user credentials.
 */
export interface ICredentials {
  identityId: string;
  token: string;
  refreshToken: string;
}

/**
 * MIC logged in user permissions.
 */
export interface IPermissions {
  objects: object[];
}
