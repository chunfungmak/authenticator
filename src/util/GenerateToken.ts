import { ConvertOtauthModel } from './ConvertOtauthUri'
import * as notp from 'notp'
// @ts-expect-error
import * as b32 from 'thirty-two'

export function generateToken (payload: ConvertOtauthModel, isNext: boolean = false): string {
  const period = payload.period != null ? parseInt(payload.period) : 30
  return totpGen(decodeGoogleAuthKey(payload.secret), {
    ...(isNext
      ? {
          _t: new Date().getTime() + 1000 * period
        }
      : {}),
    time: period
  })
}

function totpGen (key: string | Buffer | Uint8Array, opt?: notp.TOTPGenOpt | any): string {
  opt = opt ?? {}
  const time = opt.time ?? 30
  let _t = new Date().getTime()
  if (opt._t != null) {
    _t = opt._t
  }
  opt.counter = Math.floor((_t / 1000) / time)
  return notp.hotp.gen(key, opt)
};

function decodeGoogleAuthKey (key: string): string {
  return b32.decode(key.replace(/\W+/g, '').toUpperCase())
}
