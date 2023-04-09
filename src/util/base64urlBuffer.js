// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
export function u8aToBase64url(v) {
    return Buffer.from(v).toString('base64url');
}
export function base64urlToU8a(v) {
    return Buffer.from(v, 'base64url');
}
