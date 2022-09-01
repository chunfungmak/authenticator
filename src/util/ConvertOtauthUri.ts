import * as protobuf from 'protobufjs'
import { base32 } from 'rfc4648'

interface QueryParam {
  secret: string
  issuer: string
  counter: number
  algorithm: string
  digits: number
  period: string
}

export type ConvertOtauthModel = {
  url: string
  schema: string
  accountName: string
  token?: string
  time?: {
    period: number
    timeLeft: number
    window: number
    fastForward: number
    isFastForward: boolean
  }
} & QueryParam

const otpauthMigrationProto = `syntax = "proto3";

message MigrationPayload {
  enum Algorithm {
    ALGORITHM_UNSPECIFIED = 0;
    ALGORITHM_SHA1 = 1;
    ALGORITHM_SHA256 = 2;
    ALGORITHM_SHA512 = 3;
    ALGORITHM_MD5 = 4;
  }

  enum DigitCount {
    DIGIT_COUNT_UNSPECIFIED = 0;
    DIGIT_COUNT_SIX = 1;
    DIGIT_COUNT_EIGHT = 2;
  }

  enum OtpType {
    OTP_TYPE_UNSPECIFIED = 0;
    OTP_TYPE_HOTP = 1;
    OTP_TYPE_TOTP = 2;
  }

  message OtpParameters {
    bytes secret = 1;
    string name = 2;
    string issuer = 3;
    Algorithm algorithm = 4;
    DigitCount digits = 5;
    OtpType type = 6;
    int64 counter = 7;
  }

  repeated OtpParameters otp_parameters = 1;
  int32 version = 2;
  int32 batch_size = 3;
  int32 batch_index = 4;
  int32 batch_id = 5;
}`

const ALGORITHM: Record<number, string> = {
  0: 'sha256',
  1: 'sha1',
  2: 'sha256',
  3: 'sha512',
  4: 'md5'
}

const DIGIT_COUNT: Record<number, number> = {
  0: 6,
  1: 6,
  2: 8
}

const protobufPromise = async (): Promise<any> => {
  return protobuf.parse(otpauthMigrationProto).root
}

const migrationParser = async (sourceUrl: string): Promise<ConvertOtauthModel[]> => {
  if (typeof sourceUrl !== 'string') {
    throw new Error('source url must be a string')
  }

  if (sourceUrl.indexOf('otpauth-migration://offline') !== 0) {
    throw new Error(
      'source url must be begun with otpauth-migration://offline'
    )
  }

  const sourceData = new URL(sourceUrl).searchParams.get('data')
  if (sourceData == null) {
    throw new Error("source url doesn't contain otpauth data")
  }

  const protobufRoot = await protobufPromise()

  const migrationPayload = protobufRoot.lookupType('MigrationPayload')
  const decodedOtpPayload = migrationPayload.decode(
    Buffer.from(sourceData, 'base64')
  )

  const otpParameters: ConvertOtauthModel[] = []
  for (const otpParameter of decodedOtpPayload.otpParameters) {
    console.log(otpParameter)
    const payload: ConvertOtauthModel = {
      period: otpParameter.period ?? 30,
      schema: 'otpauth',
      url: '',
      secret: base32.stringify(otpParameter.secret),
      accountName: otpParameter.name,
      issuer: otpParameter.issuer,
      algorithm: ALGORITHM[otpParameter.algorithm],
      digits: DIGIT_COUNT[otpParameter.digits],
      counter: otpParameter.counter
    }
    const query: QueryParam = {
      secret: base32.stringify(otpParameter.secret),
      issuer: otpParameter.issuer,
      counter: otpParameter.counter,
      algorithm: ALGORITHM[otpParameter.algorithm],
      digits: DIGIT_COUNT[otpParameter.digits],
      period: otpParameter.period ?? 30
    }
    payload.url = `otpauth://${encodeURIComponent(otpParameter.issuer as string)}:${encodeURIComponent(otpParameter.name as string)}?${Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`).join('&')}`
    otpParameters.push(payload)
  }

  return otpParameters
}

const otpauthParser = (schema: string, uri: string, url: string): ConvertOtauthModel => {
  const [pathname, queryString] = uri.replace(/^totp\//, '').split('?')
  const queryParam: QueryParam = Object.fromEntries(queryString.split('&').map(e => e.split('=')))

  let issuer, accountName
  const meta = pathname.split(':')
  if (meta.length > 1) {
    issuer = queryParam.issuer ?? meta[0].replace(/^\//, '')
    accountName = meta[1]
  } else {
    issuer = queryParam.issuer
    accountName = meta[0]
  }

  return {
    ...queryParam,
    counter: queryParam.counter !== undefined ? parseInt(queryParam.counter as any) : queryParam.counter,
    digits: queryParam.digits !== undefined ? parseInt(queryParam.digits as any) : queryParam.digits,
    url,
    schema,
    issuer,
    accountName
  }
}

export const convertOtauthUrl = async (url: string): Promise<ConvertOtauthModel[]> => {
  const [schema, uri] = decodeURIComponent(url).split('://')
  console.log({ schema, uri })

  switch (schema) {
    case 'otpauth': {
      return [otpauthParser(schema, uri, url)]
    }
    case 'otpauth-migration': {
      return await migrationParser(url)
    }
    default: {
      throw new Error('Qrcode schema not correct.')
    }
  }
}
