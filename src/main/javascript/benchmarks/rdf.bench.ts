import {Event, Suite} from "benchmark";
import {Parser} from "n3";
import {join} from "path";
import {Quad} from "rdf-js";
import {promises as fs} from "fs";
import {Bubblewrap, Classes} from "../index";
import * as RDF from "@polypoly-eu/rdf";
import {convert} from "@polypoly-eu/rdf-spec";
import * as assert from "assert";

const suite = new Suite();

const classes: Classes = {
    "@polypoly-eu/rdf.NamedNode": RDF.NamedNode,
    "@polypoly-eu/rdf.BlankNode": RDF.BlankNode,
    "@polypoly-eu/rdf.Literal": RDF.Literal,
    "@polypoly-eu/rdf.Variable": RDF.Variable,
    "@polypoly-eu/rdf.DefaultGraph": RDF.DefaultGraph,
    "@polypoly-eu/rdf.Quad": RDF.Quad
}

const bubblewrap = Bubblewrap.create(classes);
const bubblewrapStrict = Bubblewrap.create(classes, true);
const bubblewrapRaw = Bubblewrap.create();

async function loadDataset(): Promise<Quad[]> {
    const path = join(__dirname, "..", "..", "resources", "dataset.nt");
    const content = await fs.readFile(path, { encoding: "utf-8" });
    const parser = new Parser();
    return parser.parse(content);
}

async function runBench(): Promise<void> {
    const dataset = (await loadDataset()).map(quad => convert(quad, RDF.dataFactory));
    const encoded = bubblewrap.encode(dataset);
    const encodedStrict = bubblewrapStrict.encode(dataset);
    assert.deepStrictEqual(encoded, encodedStrict);
    const encodedRaw = bubblewrapRaw.encode(dataset);
    assert.notDeepStrictEqual(encoded, encodedRaw);

    console.log(`Measuring ${dataset.length} quads`);

    suite
        .add("encoding", () => {
            bubblewrap.encode(dataset);
        })
        .add("encoding (strict)", () => {
            bubblewrapStrict.encode(dataset);
        })
        .add("encoding (raw)", () => {
            bubblewrapRaw.encode(dataset);
        })
        .add("decoding", () => {
            bubblewrap.decode(encoded);
        })
        .add("decoding (strict)", () => {
            bubblewrapStrict.decode(encodedStrict);
        })
        .add("decoding (raw)", () => {
            bubblewrapRaw.decode(encodedRaw);
        })
        .on("cycle", (event: Event) => {
            console.log(event.target.toString())
        })
        .run();
}

runBench();
