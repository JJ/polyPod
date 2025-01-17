import { DefaultPod, DefaultPolyOut } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { isPolypodUri, PolyUri, PolyPodUriError } from "./uri";

export class MockPolyOut extends DefaultPolyOut {
    constructor(fs = new Volume().promises) {
        super(fs);
    }

    async importArchive(path: string, destUri?: string): Promise<string> {
        if (!destUri) {
            destUri = new PolyUri().toString();
        } else {
            if (!isPolypodUri(destUri)) {
                throw new PolyPodUriError(`${destUri} is not a polyPod URI`);
            }
        }
        return destUri;
    }
}

export class MockPod extends DefaultPod {
    constructor(fs = new Volume().promises) {
        super(dataset(), fs, new MockPolyOut(fs));
    }
}
