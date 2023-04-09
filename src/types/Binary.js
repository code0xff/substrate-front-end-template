// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { Bytes } from '@polkadot/types';
import { compactAddLength, hexToU8a, isHex, isString, isU8a, u8aToU8a } from '@polkadot/util';
import { base64urlToU8a, u8aToBase64url } from '../util/base64url.js';
export function decodeBinary(value) {
    if (isU8a(value) || Array.isArray(value)) {
        return u8aToU8a(value);
    }
    else if (!value) {
        return new Uint8Array();
    }
    else if (isHex(value)) {
        return hexToU8a(value);
    }
    else if (isString(value)) {
        return compactAddLength(base64urlToU8a(value.toString()));
    }
    throw new Error(`Unknown type passed to binary decoder, found typeof ${typeof value}`);
}
export class Binary extends Bytes {
    constructor(registry, value) {
        super(registry, decodeBinary(value));
    }
    toHuman() {
        return u8aToBase64url(this.toU8a(true));
    }
    toRawType() {
        return 'Binary';
    }
}
