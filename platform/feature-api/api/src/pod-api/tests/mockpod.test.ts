import { podSpec } from "../spec";
import { MockPod, MockPolyOut } from "../mock-pod";
import { PolyPodUriError } from "../uri";
import { Volume } from "memfs";

describe("Mock polyOut", () => {
    let mockPolyOut: MockPolyOut;
    beforeAll(() => {
        mockPolyOut = new MockPolyOut();
    });
    it("should fail with bad URIs", async () => {
        await expect(
            mockPolyOut.importArchive("foo", "bar")
        ).rejects.toThrowError(PolyPodUriError);
    });
});

describe("Mock pod with default values", () => {
    podSpec(new MockPod(), "/");
});

describe("Mock pod with existing fs", () => {
    podSpec(new MockPod(new Volume().promises), "/");
});
