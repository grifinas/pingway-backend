import { Environment } from "@common/env/Environment";

export interface IConfigService {
  get: <TKey extends keyof typeof Environment>(
    key: TKey
  ) => typeof Environment[TKey];
}
