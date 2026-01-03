import * as pm from "picomatch";
console.log("keys:", Object.keys(pm));
console.log("has test:", "test" in pm);
console.log("pm.default keys:", Object.keys(pm.default || {}));
