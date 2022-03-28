import React, { createContext, useContext, useEffect } from "react";
import { ImporterContext } from "./importer-context.jsx";

const FileLoaderContext = createContext();

const FileLoaderProvider = ({ children }) => {
    const { files } = useContext(ImporterContext);

    useEffect(() => {
        console.log(files);
    });

    return <FileLoaderContext.Provider>{children}</FileLoaderContext.Provider>;
};

export default FileLoaderProvider;
