import type { AnyNumber, AnyString, Registry } from '@polkadot/types-codec/types';
import { U128 } from '@polkadot/types-codec';
export declare class AccountName extends U128 {
    constructor(registry: Registry, name: AnyString | AnyNumber, tag?: number);
    toHuman(): string;
    toRawType(): string;
}
