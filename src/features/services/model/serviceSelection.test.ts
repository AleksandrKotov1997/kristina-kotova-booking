import { describe, expect, it } from "vitest";
import { parseServiceSelectionRequest } from "./serviceSelection";

const serviceId = "d883f62e-44a8-4380-b0d0-a2dd4ec45c67";

const invalidSelectionValues: unknown[] = [
  "",
  "not-a-service-id",
  "123",
  null,
  123,
  { serviceId },
  [serviceId],
  [serviceId, serviceId],
];

describe("booking serviceId URL contract", () => {
  it("leaves a direct booking visit without a requested service", () => {
    expect(parseServiceSelectionRequest(undefined)).toEqual({
      status: "empty",
    });
  });

  it("preserves a valid service identifier for database lookup", () => {
    expect(parseServiceSelectionRequest(serviceId)).toEqual({
      status: "requested",
      serviceId,
    });
  });

  it.each(invalidSelectionValues.map((value) => ({ value })))(
    "rejects invalid or repeated values: %j",
    ({ value }) => {
      expect(parseServiceSelectionRequest(value)).toEqual({
        status: "invalid",
      });
    },
  );
});
