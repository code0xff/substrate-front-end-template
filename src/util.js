export const buf2hex = (buffer) => {
  return [...buffer]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

export const hex2buf = (hex) => {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}