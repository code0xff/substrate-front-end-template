import type { AnyString, AnyU8a, Registry } from '@polkadot/types-codec/types';
import { Bytes } from '@polkadot/types';
export declare function decodeBinary(value?: AnyU8a | AnyString): Uint8Array;
export declare class Binary extends Bytes {
    constructor(registry: Registry, value?: AnyU8a);
    toHuman(): string;
    toRawType(): string;
}
