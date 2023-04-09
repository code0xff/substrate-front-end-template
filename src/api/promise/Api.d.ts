import type { ApiOptions } from '@polkadot/api/types';
import { ApiPromise as ApiPromiseBase } from '@polkadot/api';
export declare class ApiPromise extends ApiPromiseBase {
    static create(options?: ApiOptions): Promise<ApiPromise>;
}
