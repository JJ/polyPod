import { podSpec } from "../spec";
import { DefaultPod } from "../default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";

describe("Mock pod", () => {
    podSpec(new DefaultPod(dataset(), new Volume().promises), "/");
});
