import {Page} from "puppeteer";
import {rawPromise} from "./util";

interface TestResult {
    failures: number;
    message?: string;
}

declare global {
    interface Window {
        testCompleted(result: TestResult): void;
    }
}

export async function preparePage(page: Page): Promise<() => Promise<TestResult>> {
    const {resolve, promise} = rawPromise<TestResult>();

    await page.exposeFunction("testCompleted", (result: TestResult) => resolve(result));

    return () => promise;
}

export function raiseOnFailure(result: TestResult): void {
    if (result.failures > 0) {
        let msg = `${result.failures} test(s) failed`;
        if (result.message)
            msg += `; message: ${result.message}`;
        throw new Error(msg);
    }

    if (result.message)
        console.log(result.message);
}
