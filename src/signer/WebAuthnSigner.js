// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WebAuthnSigner_registry, _WebAuthnSigner_credentialId;
import { compactAddLength, hexToU8a, isU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
let id = 0;
export class WebAuthnSigner {
    constructor(registry, credentialId, publicKey) {
        _WebAuthnSigner_registry.set(this, void 0);
        _WebAuthnSigner_credentialId.set(this, void 0);
        __classPrivateFieldSet(this, _WebAuthnSigner_registry, registry, "f");
        __classPrivateFieldSet(this, _WebAuthnSigner_credentialId, isU8a(credentialId) ? credentialId : stringToU8a(credentialId), "f");
        let raw = isU8a(publicKey) ? publicKey : stringToU8a(publicKey);
        if (raw.length === 64 || (raw.length === 65 && raw[0] === 0x04)) {
            raw = u8aConcat(new Uint8Array([0x02 + (raw[raw.length - 1] & 0x01)]), raw.slice(raw.length - 64, raw.length - 32));
        }
        const accountId = __classPrivateFieldGet(this, _WebAuthnSigner_registry, "f").createType('AccountId', compactAddLength(u8aConcat(new Uint8Array([0x80, 0x24]), raw)));
        this.address = accountId.toHuman();
        this.addressRaw = accountId.toU8a();
    }
    async signRaw({ address, data }) {
        if (this.address && this.address !== address) {
            throw new Error('Signer address does not match');
        }
        if (!navigator || !navigator.credentials) {
            throw new Error('WebAuthn is not supported in this environment');
        }
        const response = (await navigator.credentials.get({
            publicKey: {
                allowCredentials: [{
                        id: __classPrivateFieldGet(this, _WebAuthnSigner_credentialId, "f"),
                        type: 'public-key'
                    }],
                challenge: blake2AsU8a(hexToU8a(data))
            }
        })).response;
        return {
            id: ++id,
            signature: __classPrivateFieldGet(this, _WebAuthnSigner_registry, "f").createType('ExtrinsicSignature', {
                /* eslint-disable sort-keys */
                WebAuthn: {
                    clientDataJSON: compactAddLength(new Uint8Array(response.clientDataJSON)),
                    authenticatorData: compactAddLength(new Uint8Array(response.authenticatorData)),
                    signature: compactAddLength(new Uint8Array(response.signature))
                }
                /* eslint-enable sort-keys */
            }).toHex()
        };
    }
    toString() {
        return this.address;
    }
}
_WebAuthnSigner_registry = new WeakMap(), _WebAuthnSigner_credentialId = new WeakMap();
