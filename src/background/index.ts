import { parseHeader } from "../shared/tiny-header-parser";
import testScript from "./test.user.js?raw";

console.log("Hello world!", parseHeader(testScript).unwrap());
