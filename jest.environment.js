import { TestEnvironment as JsdomEnvironment } from "jest-environment-jsdom";
import { TestEnvironment as NodeEnvironment } from "jest-environment-node";

export default class CustomEnvironment {
  constructor(config, context) {
    const isTsx = context.testPath.endsWith(".tsx");
    return isTsx
      ? new JsdomEnvironment(config, context)
      : new NodeEnvironment(config, context);
  }
}
