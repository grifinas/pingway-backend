import { Tracer } from "@aws-lambda-powertools/tracer";

const tracer = new Tracer({
  serviceName: "PingwayAPI",
});

export { tracer };
