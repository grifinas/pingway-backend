import { Metrics } from "@aws-lambda-powertools/metrics";

const metrics = new Metrics({
  namespace: "Pingway",
  serviceName: "PingwayAPI",
});

export { metrics };
