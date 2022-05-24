import sucrase from "@rollup/plugin-sucrase";

export default {
    input: ["src/index.ts"],
    output: [
        {
            dir: "dist",
            format: "cjs",
        },
    ],
    plugins: [
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),
    ],
    external: ["chai", "fast-check", "chai-as-promised"],
};
