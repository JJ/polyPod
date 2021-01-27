module.exports = {
    js: [{
        source: "./src/test.ts",
        target: "./dist/test.js",
        exports: "testFeature",
        typescript: true,
    }],
    static: [{
        source: "./src/index.html",
        target: "./dist/index.html",
    }],
}
