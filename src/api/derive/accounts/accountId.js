// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { of } from 'rxjs';
import { memo } from '@polkadot/api-derive/util';
import { isU8a } from '@polkadot/util';
import { decodeAddress } from '../../../util/address.js';
export function accountId(instanceId, api_) {
    return memo(instanceId, (...args) => {
        const address = args[0];
        const api = api_;
        const decoded = isU8a(address) ? address : decodeAddress((address || '').toString());
        return of(api.registry.createType('AccountId', decoded));
    });
}
