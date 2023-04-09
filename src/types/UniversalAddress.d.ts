import { AnyU8a, Registry } from '@polkadot/types-codec/types';
import { Binary } from './Binary.js';
export declare class UniversalAddress extends Binary {
    static validate(u8a: Uint8Array): Uint8Array;
    constructor(registry: Registry, value?: AnyU8a);
    toHuman(): string;
    toString(): string;
    toRawType(): string;
}
