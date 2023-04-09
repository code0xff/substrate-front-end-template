import { isHex, isU8a, u8aToHex, u8aToU8a } from '@polkadot/util';
import { decodeAddress } from '../util/address.js';
// Copyright 2017-2023 @polkadot/keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Pairs_map;
export class Pairs {
    constructor() {
        _Pairs_map.set(this, {});
    }
    add(pair) {
        __classPrivateFieldGet(this, _Pairs_map, "f")[decodeAddress(pair.address).toString()] = pair;
        return pair;
    }
    all() {
        return Object.values(__classPrivateFieldGet(this, _Pairs_map, "f"));
    }
    get(address) {
        const pair = __classPrivateFieldGet(this, _Pairs_map, "f")[decodeAddress(address).toString()];
        if (!pair) {
            throw new Error(`Unable to retrieve keypair '${isU8a(address) || isHex(address)
                ? u8aToHex(u8aToU8a(address))
                : address}'`);
        }
        return pair;
    }
    remove(address) {
        delete __classPrivateFieldGet(this, _Pairs_map, "f")[decodeAddress(address).toString()];
    }
}
_Pairs_map = new WeakMap();
