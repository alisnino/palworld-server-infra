import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_ec2, Tags } from "aws-cdk-lib";

export class PalworldServerInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // tags are useful for cost allocation and resource management but are optional.
    // Tags.of(this).add("ApplicationName", "Palworld");
    // Tags.of(this).add("Stack", "");

    const vpc = new aws_ec2.Vpc(this, "PalworldVPC", {
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // create a securityGroup with no inbound rules; your friends' IP addresses should be added in the console.
    // you can edit this code to redeploy the stack with the correct inbound rules too, but don't forget not to upload the changes to your repository.
    const securityGroup = new aws_ec2.SecurityGroup(
      this,
      "PalworldSecurityGroup",
      {
        vpc,
      }
    );
    securityGroup.addIngressRule(
      // Allow SSH access from the AWS EC2 Instance Connect service
      // Remember to check the correct range for your region!
      // https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html
      aws_ec2.Peer.ipv4("3.112.23.0/29"),
      aws_ec2.Port.tcp(22),
      "Allow SSH access from the AWS EC2 Instance Connect service"
    );

    //If you want to add your friends' IP addresses to the security group, the setting will look like this. Copy and paste this for as many friends as will play with you.
    // securityGroup.addIngressRule(
    //   aws_ec2.Peer.ipv4("YOUR_FRIENDS_IP")
    //   aws_ec2.Port.tcp(8211), //Palworld required UDP
    //   "Allow UDP access from specific IP address"
    // );

    // create an EC2 instance
    const ec2 = new aws_ec2.Instance(this, "PalworldServer", {
      vpc,
      instanceType: new aws_ec2.InstanceType("t2.2xlarge"),
      machineImage: aws_ec2.MachineImage.latestAmazonLinux2({}),
      securityGroup,
    });

    // create ElasticIP for the server
    const eip = new aws_ec2.CfnEIP(this, "PalworldEIP", {
      domain: "vpc",
      instanceId: ec2.instanceId,
    });
  }
}
