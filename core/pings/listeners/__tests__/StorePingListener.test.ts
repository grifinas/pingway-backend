import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import { Ping } from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories";
import { StorePingListener } from "@core/pings/listeners/StorePingListener";

const mockPingsRepository: IPingsRepository = {
  addPing: jest.fn(),
  getPingById: jest.fn(),
  getCurrentPings: jest.fn(),
  nextIdentity: jest.fn(),
};

describe("Store ping listener", () => {
  let storePingListener: StorePingListener;

  beforeEach(() => {
    storePingListener = new StorePingListener(mockPingsRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#handle()", () => {
    it("should store all pings via pings repository", async () => {
      const querySpy = jest
        .spyOn(mockPingsRepository, "addPing")
        .mockImplementation();

      await storePingListener.handle(new StorePingCommand({} as Ping));

      expect(querySpy).toBeCalled();
    });
  });
});
