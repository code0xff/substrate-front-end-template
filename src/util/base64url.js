// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { base64urlUnpadded } from './scure-base.js';
export function u8aToBase64url(v) {
    return base64urlUnpadded.encode(v);
}
export function base64urlToU8a(v) {
    return base64urlUnpadded.decode(v);
}
