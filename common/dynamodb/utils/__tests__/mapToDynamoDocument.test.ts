import { mapToDynamoDocument } from "@common/dynamodb/utils/mapToDynamoDocument";

describe("#mapToDynamoDocument()", () => {
  it("should convert an object with native js values to dynamodb attribute values", () => {
    expect(
      mapToDynamoDocument({
        name: "MyName",
        age: 80,
        pets: [
          {
            kind: "dog",
            name: "Johnson",
          },
        ],
        hasChildren: false,
      })
    ).toEqual({
      name: {
        S: "MyName",
      },
      age: {
        N: "80",
      },
      pets: {
        L: [
          {
            M: {
              kind: {
                S: "dog",
              },
              name: {
                S: "Johnson",
              },
            },
          },
        ],
      },
      hasChildren: {
        BOOL: false,
      },
    });
  });
});
