import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import { Environment } from "@common/env/Environment";

const marshallOptions: TranslateConfig["marshallOptions"] = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: true, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions: TranslateConfig["unmarshallOptions"] = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig: TranslateConfig = { marshallOptions, unmarshallOptions };

const documentDbClient = new DynamoDBClient({
  region: Environment.REGION,
});

const documentClient = DynamoDBDocumentClient.from(
  documentDbClient,
  translateConfig
);

export { documentClient };
