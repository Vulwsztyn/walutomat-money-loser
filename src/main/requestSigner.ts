import * as sshpk from 'sshpk'
declare const Buffer

export function signIt(key, data2): string {
  return sshpk
  .parsePrivateKey(key, 'auto')
  .createSign('sha256')
  .update(new Buffer(data2, 'utf8'))
  .sign()
  .toString()
}
