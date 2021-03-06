import * as stream from 'stream';

/**
 * context
 */
export interface FCOriginContext {
  requestId: string;
  credentials: {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
  };
  function: {
    name: string;
    handler: string;
    memory: number;
    timeout: number;
    initializer: string;
    initializationTimeout: number;
  };
  service: {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
  };
  region: string;
  accountId: string;
}

/**
 * HTTP Trigger
 */
export interface FCOriginHTTPRequest {
  headers: object;
  path: string;
  queries: object;
  method: string;
  clientIP: string;
  url: string;
}

export interface FCOriginHTTPResponse {
  setStatusCode(statusCode: number);

  setHeader(headerKey: string, headerValue: string);

  deleteHeader(headerKey: string);

  send(body: string | Buffer | stream.Readable);
}

/**
 * API Gateway
 */
export interface FCOriginApiGatewayEvent {
  path: string;
  httpMethod: string;
  headers: object;
  queryParameters: object;
  pathParameters: object;
  body: string;
  isBase64Encoded: 'false' | 'true';
}

export interface FCOriginApiGatewayResponse {
  isBase64Encoded: boolean;
  statusCode: number;
  headers: object;
  body: string;
}

/**
 * OSS
 */
export interface FCOriginInnerOSSEvent {
  eventName: string;
  eventSource: string;
  eventTime: string;
  eventVersion: string;
  oss: {
    bucket: {
      arn: string;
      name: string;
      ownerIdentity: string;
      virtualBucket: string;
    };
    object: {
      deltaSize: number;
      eTag: string;
      key: string;
      size: number;
    };
    ossSchemaVersion: string;
    ruleId: string;
  };
  region: string;
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    requestId: string;
  };
  userIdentity: {
    principalId: string;
  };
}

export interface FCOriginOSSEvent {
  events: FCOriginInnerOSSEvent[];
}

/**
 * Timer
 */
export interface FCOriginTimerEvent {
  triggerTime: string;
  triggerName: string;
  payload: any;
}

/**
 * SLS
 */
export interface FCOriginSLSEvent {
  parameter: object;
  source: {
    endpoint: string;
    projectName: string;
    logstoreName: string;
    shardId: number;
    beginCursor: string;
    endCursor: string;
  };
  jobName: string;
  taskId: string;
  cursorTime: number;
}

/**
 * CDN
 */
export type FCOriginInnerCDNEvent =
  | FCOriginInnerCDNCachedObjectsRefreshedEvent
  | FCOriginInnerCDNCachedObjectsPushedEvent
  | FCOriginInnerCDNCachedObjectsBlockedEvent
  | FCOriginInnerCDNLogFileCreatedEvent;

export interface FCOriginInnerCDNBaseEvent {
  eventName: string; // ????????????
  eventVersion: string; // ???????????????????????????1.0.0??????
  eventSource: string; // ???????????????
  region: string; // ??????????????????"cn-hangzhou"
  eventTime: string; // ??????????????????
  traceId: string; // ????????????????????????id, ??????????????????
  resource: {
    domain: string; // ?????????????????????
  };
  userIdentity: {
    aliUid: string; // ??????ID
  };
}

export interface FCOriginInnerCDNCachedObjectsRefreshedEvent
  extends FCOriginInnerCDNBaseEvent {
  eventParameter: {
    objectPath: string[];
    createTime: number; // ??????????????????
    domain: string; // ?????????????????????
    completeTime: number; // ??????????????????
    objectType: string; // ????????????????????????File???Directory
    taskId: number; // ??????????????????ID
  };
}

export type FCOriginInnerCDNCachedObjectsPushedEvent = FCOriginInnerCDNCachedObjectsRefreshedEvent;

export type FCOriginInnerCDNCachedObjectsBlockedEvent = FCOriginInnerCDNCachedObjectsRefreshedEvent;

export interface FCOriginInnerCDNLogFileCreatedEvent
  extends FCOriginInnerCDNBaseEvent {
  eventParameter: {
    domain: number; // ??????
    endTime: number; // ???????????????????????????
    fileSize: number; // ??????????????????
    filePath: number; // ??????????????????
    startTime: number; // ???????????????????????????
  };
}

export interface FCOriginCDNEvent {
  events: FCOriginInnerCDNEvent[];
}
