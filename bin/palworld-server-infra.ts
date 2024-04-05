#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PalworldServerInfraStack } from "../lib/palworld-server-infra-stack";

// your AWS account number and region go here.
const env = { account: "", region: "" };

const app = new cdk.App();
new PalworldServerInfraStack(app, "PalworldServerInfraStack", {
  env,
});
