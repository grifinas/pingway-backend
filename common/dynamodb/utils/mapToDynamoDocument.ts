import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Marshaller } from "@aws/dynamodb-auto-marshaller";

const marshaller = new Marshaller({ onEmpty: "nullify" });

export function mapToDynamoDocument(
  object: any
): Record<string, AttributeValue> {
  return marshaller.marshallItem(object) as Record<string, AttributeValue>;
}
