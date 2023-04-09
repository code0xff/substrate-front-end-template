import type { Registry, Signer, SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
export declare class WebAuthnSigner implements Signer {
    #private;
    readonly address: string;
    readonly addressRaw: Uint8Array;
    constructor(registry: Registry, credentialId: Uint8Array | string, publicKey: Uint8Array | string);
    signRaw({ address, data }: SignerPayloadRaw): Promise<SignerResult>;
    toString(): string;
}
