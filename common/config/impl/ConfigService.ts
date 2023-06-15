import { Environment } from "@common/env/Environment";
import { IConfigService } from "@common/config/IConfigService";

export class ConfigService implements IConfigService {
  get(key: keyof typeof Environment) {
    return Environment[key];
  }
}
