interface QueryParam {
  secret: string
  issuer: string
  algorithm: string
  digits: string
  period: string
}

export type ConvertOtauthModel = {
  schema: string
  accountName: string
  token?: string
} & QueryParam

export const convertOtauthUrl = (url: string): ConvertOtauthModel => {
  const [schema, uri] = decodeURIComponent(url).split('://')
  if (schema !== 'otpauth') throw new Error('Qrcode schema not correct.')

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
    schema,
    issuer,
    accountName
  }
}
