import type { HexString } from '@polkadot/util/types';
export declare function encodeAddress(key: HexString | Uint8Array | string, _ss58Format?: number): string;
export declare function decodeAddress(encoded?: HexString | string | Uint8Array | null, _ignoreChecksum?: boolean, _ss58Format?: number): Uint8Array;
