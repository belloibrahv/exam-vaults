import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AWS Solutions Architect Associate learning content seed...');

  // Get AWS SAA certification
  const awsSAA = await prisma.certification.findUnique({
    where: { code: 'SAA-C03' },
  });

  if (!awsSAA) {
    console.error('❌ AWS Solutions Architect Associate certification not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Seeding AWS SAA Learning Modules...');

  const saaModulesData = [
    {
      title: 'Module 1: Design Secure Architectures',
      description: 'Learn to design secure access to AWS resources, secure application tiers, and select appropriate data security options.',
      order: 1,
      lessons: [
        {
          title: 'AWS Identity and Access Management (IAM) Deep Dive',
          slug: 'iam-deep-dive',
          order: 1,
          estimatedTime: 25,
          content: `
# AWS Identity and Access Management (IAM) Deep Dive

## IAM Core Components

### Users
Individual people or entities that need access to your AWS account.
- **Root User**: Complete access to all AWS services and resources
- **IAM Users**: Individual entities you create in AWS
- **Best Practice**: Use IAM users instead of root user for daily activities

### Groups
Collections of IAM users. Groups let you specify permissions for multiple users.
- **Simplified Management**: Attach policies to groups instead of individual users
- **Dynamic Membership**: Users inherit permissions when added to groups
- **Example**: Developers group, Administrators group, ReadOnly group

### Roles
AWS identities that you can create that have specific permissions.
- **Temporary Credentials**: Roles provide temporary security credentials
- **Cross-Account Access**: Allow access between AWS accounts
- **Service Roles**: Allow AWS services to act on your behalf
- **Federated Access**: Enable external identity providers to access AWS

### Policies
Documents that define permissions. Written in JSON format.
- **Identity-based Policies**: Attached to users, groups, or roles
- **Resource-based Policies**: Attached to resources (S3 buckets, KMS keys)
- **AWS Managed Policies**: Pre-built policies maintained by AWS
- **Customer Managed Policies**: Custom policies you create and maintain

---

## IAM Policy Structure

### Policy Document Format
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
\`\`\`

### Policy Elements
- **Version**: Policy language version (always use "2012-10-17")
- **Statement**: Main policy element containing permissions
- **Effect**: Allow or Deny
- **Action**: List of actions the policy allows or denies
- **Resource**: ARN of resources the actions apply to
- **Condition**: Optional conditions for when policy applies

---

## Security Best Practices

### Multi-Factor Authentication (MFA)
- **Additional Security Layer**: Something you know + something you have
- **Virtual MFA**: Smartphone apps (Google Authenticator, Authy)
- **Hardware MFA**: Physical devices (YubiKey, RSA SecurID)
- **Root Account**: Always enable MFA on root account

### Access Keys Management
- **Programmatic Access**: Access keys for CLI, SDK, API calls
- **Rotation**: Regularly rotate access keys
- **Principle of Least Privilege**: Grant minimum permissions needed
- **Avoid Hard-coding**: Never hard-code credentials in applications

### IAM Roles for Applications
- **EC2 Instance Profiles**: Attach roles to EC2 instances
- **Lambda Execution Roles**: Roles for Lambda functions
- **Cross-Service Access**: Secure access between AWS services
- **Temporary Credentials**: Automatically rotated by AWS

---

## Advanced IAM Concepts

### Federated Access
Connect external identity providers to AWS:
- **SAML 2.0**: Enterprise identity providers (Active Directory)
- **OpenID Connect**: Web identity providers (Google, Facebook, Amazon)
- **AWS SSO**: Centralized access management for multiple AWS accounts
- **Active Directory Integration**: Direct integration with on-premises AD

### Cross-Account Access
- **Resource Sharing**: Share resources between AWS accounts
- **Assume Role**: Switch roles across account boundaries
- **External ID**: Additional security for third-party access
- **Account Isolation**: Maintain security boundaries between accounts

### Permission Boundaries
- **Maximum Permissions**: Define maximum permissions for entities
- **Delegated Administration**: Safely delegate user/role creation
- **Compliance**: Ensure users can't exceed defined permissions
- **Use Cases**: Developer environments, contractors, compliance requirements

### Access Analyzer
- **External Access**: Identify resources shared with external entities
- **Policy Validation**: Validate policies for security best practices
- **Unused Access**: Find unused permissions to improve security posture
- **Compliance**: Meet security and compliance requirements
          `,
        },
        {
          title: 'VPC Security and Network Access Control',
          slug: 'vpc-security-nacl',
          order: 2,
          estimatedTime: 22,
          content: `
# VPC Security and Network Access Control

## Virtual Private Cloud (VPC) Overview

### VPC Fundamentals
A VPC is a virtual network dedicated to your AWS account, logically isolated from other virtual networks.

**Key Components:**
- **CIDR Block**: IP address range for your VPC (e.g., 10.0.0.0/16)
- **Subnets**: Subdivisions of VPC CIDR block within Availability Zones
- **Route Tables**: Control traffic routing between subnets
- **Internet Gateway**: Connection to the internet
- **NAT Gateway/Instance**: Allow outbound internet access from private subnets

---

## Subnets and Availability Zones

### Public Subnets
- **Internet Access**: Direct route to Internet Gateway
- **Public IP**: Instances can have public IP addresses
- **Use Cases**: Web servers, load balancers, bastion hosts
- **Route Table**: 0.0.0.0/0 → Internet Gateway

### Private Subnets
- **No Direct Internet**: No route to Internet Gateway
- **NAT Access**: Outbound internet via NAT Gateway/Instance
- **Use Cases**: Application servers, databases, internal services
- **Enhanced Security**: Protected from direct internet access

### Availability Zone Distribution
- **High Availability**: Distribute subnets across multiple AZs
- **Fault Tolerance**: Continue operating if one AZ fails
- **Best Practice**: Use at least 2 AZs in production

---

## Security Groups

### Stateful Firewall
Security groups act as virtual firewalls for your EC2 instances.

**Characteristics:**
- **Stateful**: Return traffic automatically allowed
- **Instance Level**: Applied to individual instances
- **Allow Rules Only**: Cannot create deny rules (implicit deny)
- **Default Behavior**: All inbound traffic denied, all outbound allowed

### Security Group Rules

**Inbound Rules Example:**
| Protocol | Port Range | Source | Description |
|----------|------------|--------|-------------|
| HTTP | 80 | 0.0.0.0/0 | Web traffic from anywhere |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |
| SSH | 22 | 203.0.113.0/24 | SSH from office network |
| MySQL | 3306 | sg-12345678 | Database access from app servers |

**Outbound Rules Example:**
| Protocol | Port Range | Destination | Description |
|----------|------------|-------------|-------------|
| All Traffic | All | 0.0.0.0/0 | All outbound traffic allowed |
| HTTPS | 443 | 0.0.0.0/0 | API calls and updates |

### Security Group Best Practices
- **Principle of Least Privilege**: Only open necessary ports
- **Source Restrictions**: Use specific IP ranges or security groups
- **Descriptive Names**: Use meaningful names and descriptions
- **Regular Reviews**: Audit rules periodically
- **Reference Other Groups**: Use security group IDs as sources

---

## Network Access Control Lists (NACLs)

### Stateless Firewall
NACLs provide subnet-level security as a stateless firewall.

**Characteristics:**
- **Stateless**: Must explicitly allow return traffic
- **Subnet Level**: Applied to entire subnets
- **Allow and Deny Rules**: Can create both allow and deny rules
- **Rule Numbers**: Processed in numerical order (lower numbers first)
- **Default NACL**: Allows all inbound and outbound traffic

### NACL vs Security Groups

| Feature | Security Groups | NACLs |
|---------|----------------|-------|
| Level | Instance | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow and Deny |
| Rule Processing | All rules evaluated | First match wins |
| Default | Deny all inbound | Allow all traffic |

### NACL Rule Configuration

**Example Inbound Rules:**
| Rule # | Protocol | Port Range | Source | Allow/Deny |
|--------|----------|------------|--------|------------|
| 100 | TCP | 80 | 0.0.0.0/0 | Allow |
| 110 | TCP | 443 | 0.0.0.0/0 | Allow |
| 120 | TCP | 22 | 203.0.113.0/24 | Allow |
| 130 | TCP | 1024-65535 | 0.0.0.0/0 | Allow |
| * | All | All | 0.0.0.0/0 | Deny |

---

## VPC Flow Logs

### Network Traffic Monitoring
VPC Flow Logs capture information about IP traffic flowing through your VPC.

**Captured Information:**
- Source and destination IP addresses
- Source and destination ports
- Protocol number
- Number of packets and bytes
- Time window for the capture
- Action taken (ACCEPT or REJECT)

**Use Cases:**
- **Security Analysis**: Identify suspicious traffic patterns
- **Network Troubleshooting**: Diagnose connectivity issues
- **Compliance**: Meet audit and compliance requirements
- **Cost Optimization**: Understand data transfer patterns

### Flow Log Destinations
- **CloudWatch Logs**: Real-time analysis and alerting
- **S3 Buckets**: Long-term storage and batch analysis
- **Kinesis Data Firehose**: Stream processing and transformation

---

## Advanced VPC Security

### VPC Endpoints
Secure connections to AWS services without internet gateway.

**Gateway Endpoints:**
- **Services**: S3, DynamoDB
- **Route Table**: Added as routes in route tables
- **No Bandwidth Limitations**: No additional charges for data transfer

**Interface Endpoints:**
- **Services**: Most AWS services (EC2, Lambda, SNS, etc.)
- **ENI**: Elastic Network Interface in your subnet
- **Private DNS**: Optionally enable private DNS names
- **Security Groups**: Apply security groups to endpoint

### PrivateLink
- **Private Connectivity**: Connect to services without internet exposure
- **Service Provider/Consumer**: Create your own services accessible via PrivateLink
- **Cross-Account**: Share services across AWS accounts
- **On-Premises**: Access via Direct Connect or VPN

### AWS Network Firewall
- **Managed Firewall**: Stateful firewall service for VPCs
- **Rule Groups**: Create custom rules for traffic filtering
- **Intrusion Detection**: Built-in intrusion detection and prevention
- **Integration**: Works with existing security services
          `,
        },
      ],
    },
  ];

  // Create SAA modules and lessons
  for (const modData of saaModulesData) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `saa-mod-${modData.order}-${awsSAA.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `saa-mod-${modData.order}-${awsSAA.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: awsSAA.id,
      },
    });

    for (const lesData of modData.lessons) {
      await prisma.learningLesson.upsert({
        where: {
          moduleId_slug: {
            moduleId: mod.id,
            slug: lesData.slug,
          },
        },
        update: {
          title: lesData.title,
          content: lesData.content,
          order: lesData.order,
          estimatedTime: lesData.estimatedTime,
        },
        create: {
          title: lesData.title,
          slug: lesData.slug,
          content: lesData.content,
          order: lesData.order,
          estimatedTime: lesData.estimatedTime,
          moduleId: mod.id,
        },
      });
    }
  }

  console.log('✅ AWS SAA learning content seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding SAA content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });