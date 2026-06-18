import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AWS and Azure learning content seed...');

  // Get AWS Cloud Practitioner certification
  const awsCloudPractitioner = await prisma.certification.findUnique({
    where: { code: 'CLF-C02' },
  });

  if (!awsCloudPractitioner) {
    console.error('❌ AWS Cloud Practitioner certification not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Seeding AWS Cloud Practitioner Learning Modules...');

  // AWS Cloud Practitioner Learning Modules
  const awsModulesData = [
    {
      title: 'Module 1: Cloud Computing Fundamentals & AWS Overview',
      description: 'Understand cloud computing basics, AWS global infrastructure, and core services overview.',
      order: 1,
      lessons: [
        {
          title: 'Introduction to Cloud Computing and AWS',
          slug: 'intro-to-aws-cloud',
          order: 1,
          estimatedTime: 15,
          content: `
# Introduction to Cloud Computing and AWS

## What is Cloud Computing?

Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services, such as computing power, storage, and databases, on an as-needed basis from a cloud provider like Amazon Web Services (AWS).

### Six Advantages of Cloud Computing

1. **Trade upfront expense for variable expense** - Instead of having to invest heavily in data centers and servers before you know how you're going to use them, you can pay only when you consume computing resources.

2. **Benefit from massive economies of scale** - By using cloud computing, you can achieve a lower variable cost than you can get on your own.

3. **Stop guessing capacity** - Eliminate guessing on your infrastructure capacity needs. When you make a capacity decision prior to deploying an application, you often end up either sitting on expensive idle resources or dealing with limited capacity.

4. **Increase speed and agility** - In a cloud computing environment, new IT resources are only a click away, which means that you reduce the time to make those resources available to your developers from weeks to just minutes.

5. **Stop spending money running and maintaining data centers** - Focus on projects that differentiate your business, not the infrastructure.

6. **Go global in minutes** - Easily deploy your application in multiple regions around the world with just a few clicks.

---

## AWS Global Infrastructure

AWS operates in multiple geographic regions around the world. Understanding this infrastructure is crucial for designing reliable and efficient cloud solutions.

### Regions
A Region is a separate geographic area that AWS uses to house its infrastructure. Each Region consists of multiple Availability Zones.

**Current AWS Regions:** 33+ regions worldwide
**Examples:** us-east-1 (N. Virginia), eu-west-1 (Ireland), ap-southeast-1 (Singapore)

### Availability Zones (AZs)
An Availability Zone is one or more data centers in a Region. Each AZ is isolated, but AZs in a Region are connected through low-latency links.

**Key Points:**
- Each Region has multiple AZs (typically 3-6)
- AZs are physically separated within a region
- Designed for fault isolation and high availability

### Edge Locations
Edge locations are sites that CloudFront (AWS's CDN) uses to cache copies of your content for faster delivery to users.

**Global Network:** 400+ edge locations worldwide

---

## Types of Cloud Computing

### Deployment Models

**Public Cloud**
- Resources owned and operated by third-party cloud service provider
- Delivered over the internet
- Example: AWS, Microsoft Azure, Google Cloud

**Private Cloud**
- Resources used exclusively by one business or organization
- Can be physically located at organization's on-site datacenter
- Higher security and control

**Hybrid Cloud**
- Combines public and private clouds
- Data and applications can be shared between them
- Greater flexibility and deployment options

### Service Models

**Infrastructure as a Service (IaaS)**
- Provides virtualized computing resources over the internet
- Examples: Amazon EC2, Amazon VPC
- Most control, most management responsibility

**Platform as a Service (PaaS)**
- Provides a platform allowing customers to develop, run, and manage applications
- Examples: AWS Elastic Beanstalk, AWS Lambda
- Less control, less management responsibility

**Software as a Service (SaaS)**
- Delivers software applications over the internet
- Examples: Amazon WorkSpaces, Amazon Chime
- Least control, least management responsibility
          `,
        },
      ],
    },
  ];

  // Create AWS modules and lessons
  for (const modData of awsModulesData) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `aws-mod-${modData.order}-${awsCloudPractitioner.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `aws-mod-${modData.order}-${awsCloudPractitioner.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: awsCloudPractitioner.id,
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

  // Now let's add more comprehensive AWS modules
  const additionalAWSModules = [
    {
      title: 'Module 2: AWS Core Services - Compute',
      description: 'Deep dive into AWS compute services including EC2, Lambda, and Elastic Beanstalk.',
      order: 2,
      lessons: [
        {
          title: 'Amazon EC2 - Elastic Compute Cloud',
          slug: 'amazon-ec2-fundamentals',
          order: 1,
          estimatedTime: 18,
          content: `
# Amazon EC2 - Elastic Compute Cloud

## What is Amazon EC2?

Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers.

### Key Benefits of EC2

- **Elastic** - Increase or decrease capacity within minutes
- **Completely controlled** - You have complete control of your instances
- **Flexible** - Choice of multiple instance types, operating systems, and software packages
- **Reliable** - Amazon EC2 offers 99.95% availability for each Amazon EC2 region
- **Secure** - Works in conjunction with Amazon VPC to provide security and robust networking
- **Inexpensive** - Pay only for what you use

---

## EC2 Instance Types

EC2 provides different instance types optimized for different use cases:

### General Purpose (A, T, M series)
- **Use cases**: Web servers, small databases, development environments
- **Examples**: t3.micro, m5.large, a1.medium
- **Balanced**: CPU, memory, and networking resources

### Compute Optimized (C series)
- **Use cases**: High-performance web servers, scientific computing, gaming servers
- **Examples**: c5.large, c5n.xlarge
- **High-performance**: Processors for compute-intensive applications

### Memory Optimized (R, X, z1d series)
- **Use cases**: In-memory databases, real-time analytics, caching
- **Examples**: r5.large, x1e.xlarge, z1d.large
- **Fast performance**: For workloads that process large datasets in memory

### Storage Optimized (I, D, H series)
- **Use cases**: Data warehouses, file systems, analytics workloads
- **Examples**: i3.large, d2.xlarge, h1.2xlarge
- **High sequential**: Read and write access to large datasets

### Accelerated Computing (P, G, F series)
- **Use cases**: Machine learning, graphics rendering, video processing
- **Examples**: p3.2xlarge, g4dn.xlarge, f1.2xlarge
- **Hardware accelerators**: GPUs, FPGAs for specialized workloads

---

## EC2 Pricing Models

### On-Demand Instances
- **Pay by the hour or second** (minimum 60 seconds)
- **No upfront payment** or long-term commitment
- **Use cases**: Unpredictable workloads, short-term projects, development/testing

### Reserved Instances (RIs)
- **Up to 75% discount** compared to On-Demand
- **1 or 3-year terms** with upfront payment options
- **Use cases**: Steady-state applications, predictable usage patterns

### Spot Instances
- **Up to 90% discount** compared to On-Demand
- **Instances can be terminated** by AWS with 2-minute warning
- **Use cases**: Flexible applications, fault-tolerant workloads, big data analytics

### Dedicated Hosts
- **Physical EC2 server** dedicated for your use
- **Compliance requirements** that don't support multi-tenant virtualization
- **Use cases**: Regulatory requirements, licensing restrictions

---

## EC2 Security

### Security Groups
- Acts as a **virtual firewall** for your EC2 instances
- **Stateful** - if you allow inbound traffic, outbound is automatically allowed
- **Default**: All inbound traffic blocked, all outbound traffic allowed
- **Rules**: Based on protocols, ports, and source/destination

### Key Pairs
- **Public-key cryptography** to encrypt and decrypt login information
- **Public key**: Stored by AWS
- **Private key**: Downloaded and stored by you
- **Required** for SSH access to Linux instances

### IAM Roles
- **Secure way** to grant permissions to applications running on EC2
- **No credentials** stored on the instance
- **Automatically rotated** by AWS
- **Best practice** for accessing other AWS services from EC2
          `,
        },
        {
          title: 'AWS Lambda - Serverless Computing',
          slug: 'aws-lambda-serverless',
          order: 2,
          estimatedTime: 12,
          content: `
# AWS Lambda - Serverless Computing

## What is AWS Lambda?

AWS Lambda is a compute service that runs your code in response to events and automatically manages the compute resources for you. You can use AWS Lambda to extend other AWS services with custom logic, or create your own back-end services.

### Key Features

- **No servers to manage** - AWS handles all infrastructure management
- **Automatic scaling** - Scales automatically to handle requests
- **Pay only for compute time** - Charged only when your code is running
- **Event-driven** - Triggered by events from other AWS services
- **Multiple languages** - Supports Java, Go, PowerShell, Node.js, C#, Python, and Ruby

---

## How Lambda Works

1. **Upload your code** to Lambda in one of the supported languages
2. **Set up triggers** - events that cause Lambda to run your function
3. **Lambda runs your code** only when triggered
4. **Pay only for compute time** - measured in milliseconds

### Lambda Function Components

**Function Code**
- The code you want to run
- Can be uploaded as a ZIP file or container image

**Runtime**
- The language-specific environment that runs your function
- Examples: Python 3.9, Node.js 16.x, Java 11

**Handler**
- The method in your function code that Lambda calls to start execution

**Event Object**
- Data that's passed to your function when it's invoked
- Contains information about the triggering event

---

## Common Lambda Use Cases

### Real-time File Processing
- **Trigger**: File uploaded to Amazon S3
- **Action**: Process image, validate data, generate thumbnail

### Real-time Stream Processing
- **Trigger**: Records added to Amazon Kinesis stream
- **Action**: Analyze data, filter records, transform data

### Web Applications
- **Trigger**: HTTP request via Amazon API Gateway
- **Action**: Process API requests, return responses

### IoT Backends
- **Trigger**: IoT device sends data
- **Action**: Process sensor data, store in database, send alerts

### Chatbots
- **Trigger**: User message via Amazon Lex
- **Action**: Process natural language, return appropriate response

---

## Lambda Pricing

### Request Pricing
- **Free Tier**: 1 million free requests per month
- **After Free Tier**: $0.20 per 1 million requests

### Duration Pricing
- **Free Tier**: 400,000 GB-seconds per month
- **After Free Tier**: $0.0000166667 per GB-second
- **Calculation**: Memory allocated × execution time

### Additional Charges
- **Data transfer** charges may apply
- **Other AWS services** used by your function

---

## Lambda Limits

### Execution Limits
- **Maximum execution time**: 15 minutes
- **Memory allocation**: 128 MB to 10,008 MB
- **Temporary disk space**: 512 MB to 10,240 MB (/tmp)
- **Environment variables**: 4 KB total

### Deployment Limits
- **Function deployment package**: 50 MB (zipped), 250 MB (unzipped)
- **Container image**: 10 GB
- **Function layers**: Up to 5 layers per function
          `,
        },
      ],
    },
    {
      title: 'Module 3: AWS Core Services - Storage',
      description: 'Comprehensive coverage of AWS storage services including S3, EBS, and EFS.',
      order: 3,
      lessons: [
        {
          title: 'Amazon S3 - Simple Storage Service',
          slug: 'amazon-s3-fundamentals',
          order: 1,
          estimatedTime: 20,
          content: `
# Amazon S3 - Simple Storage Service

## What is Amazon S3?

Amazon Simple Storage Service (S3) is object storage built to store and retrieve any amount of data from anywhere on the Internet. It's designed to deliver 99.999999999% (11 9's) of durability and 99.99% availability of objects over a given year.

### Key Concepts

**Buckets**
- Containers for objects stored in Amazon S3
- Must have a globally unique name
- Created in a specific AWS Region

**Objects**
- Files stored in Amazon S3
- Can be 0 bytes to 5 TB in size
- Consist of data and metadata

**Keys**
- Unique identifier for an object within a bucket
- Combination of bucket name + key + version ID uniquely identifies each object

---

## S3 Storage Classes

### Standard Storage Classes

**S3 Standard**
- **Use case**: Frequently accessed data
- **Durability**: 99.999999999% (11 9's)
- **Availability**: 99.99%
- **Min storage duration**: None
- **Cost**: Highest storage cost, lowest access cost

**S3 Standard-Infrequent Access (IA)**
- **Use case**: Less frequently accessed but requires rapid access
- **Durability**: 99.999999999% (11 9's)
- **Availability**: 99.9%
- **Min storage duration**: 30 days
- **Cost**: Lower storage cost, higher access cost than Standard

### Archive Storage Classes

**S3 Glacier Instant Retrieval**
- **Use case**: Archive data with milliseconds retrieval
- **Retrieval**: Milliseconds
- **Min storage duration**: 90 days
- **Cost**: Lower storage cost than Standard-IA

**S3 Glacier Flexible Retrieval**
- **Use case**: Archive data with retrieval in minutes to hours
- **Retrieval**: 1-5 minutes (expedited), 3-5 hours (standard), 5-12 hours (bulk)
- **Min storage duration**: 90 days
- **Cost**: Very low storage cost

**S3 Glacier Deep Archive**
- **Use case**: Long-term archive with retrieval in hours
- **Retrieval**: 12 hours (standard), 48 hours (bulk)
- **Min storage duration**: 180 days
- **Cost**: Lowest storage cost

### Intelligent Storage Classes

**S3 Intelligent-Tiering**
- **Automatically moves objects** between access tiers based on changing access patterns
- **No retrieval fees** when accessing objects
- **Small monthly monitoring fee** per object
- **Use case**: Unknown or changing access patterns

---

## S3 Features

### Versioning
- Keep multiple variants of an object in the same bucket
- Protects against accidental deletion or modification
- Can be suspended but not disabled once enabled

### Encryption
- **Encryption in Transit**: SSL/TLS
- **Encryption at Rest**:
  - Server-Side Encryption with S3-Managed Keys (SSE-S3)
  - Server-Side Encryption with KMS Keys (SSE-KMS)
  - Server-Side Encryption with Customer-Provided Keys (SSE-C)

### Access Management
- **Bucket Policies**: JSON-based access policy language
- **IAM Policies**: Control access at the user/role level
- **Access Control Lists (ACLs)**: Legacy access control mechanism
- **S3 Block Public Access**: Account and bucket-level public access controls

### Static Website Hosting
- Host static websites directly from S3
- Supports HTML, CSS, JavaScript, and client-side scripts
- Cannot host dynamic websites with server-side scripting

---

## S3 Pricing

### Storage Costs
- Pay for the storage class you choose
- Different rates for different storage classes
- Based on amount of data stored per month

### Request Costs
- PUT, COPY, POST, LIST requests
- GET, SELECT requests
- DELETE and CANCEL requests (no charge)

### Data Transfer Costs
- Data transferred out of S3 to the internet
- Data transferred between S3 buckets in different regions
- CloudFront data transfer may reduce costs

### Management Costs
- S3 Inventory
- S3 Analytics
- S3 Object Tagging
- S3 Transfer Acceleration
          `,
        },
      ],
    },
  ];

  // Create additional AWS modules
  for (const modData of additionalAWSModules) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `aws-mod-${modData.order}-${awsCloudPractitioner.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `aws-mod-${modData.order}-${awsCloudPractitioner.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: awsCloudPractitioner.id,
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

  console.log('✅ AWS Cloud Practitioner learning content seeded successfully');
  // Now let's add Azure Fundamentals content
  const azureFundamentals = await prisma.certification.findUnique({
    where: { code: 'AZ-900' },
  });

  if (!azureFundamentals) {
    console.error('❌ Azure Fundamentals certification not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Seeding Azure Fundamentals Learning Modules...');

  const azureModulesData = [
    {
      title: 'Module 1: Cloud Computing and Azure Fundamentals',
      description: 'Introduction to cloud computing concepts and Azure services overview.',
      order: 1,
      lessons: [
        {
          title: 'Introduction to Cloud Computing and Microsoft Azure',
          slug: 'intro-to-azure-cloud',
          order: 1,
          estimatedTime: 18,
          content: `
# Introduction to Cloud Computing and Microsoft Azure

## What is Microsoft Azure?

Microsoft Azure is a cloud computing platform and service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers worldwide.

### Azure Services Categories

Azure provides services across multiple categories:
- **Compute**: Virtual machines, containers, serverless computing
- **Storage**: Blob storage, file storage, database storage
- **Networking**: Virtual networks, load balancers, VPN gateways
- **Databases**: SQL databases, NoSQL databases, data warehouses
- **Analytics**: Big data analytics, machine learning, IoT analytics
- **AI and Machine Learning**: Cognitive services, bot framework, machine learning studio

---

## Cloud Computing Service Types

### Infrastructure as a Service (IaaS)
**Definition**: Provides virtualized computing resources over the internet

**Azure Examples**:
- **Azure Virtual Machines**: On-demand, scalable computing resources
- **Azure Virtual Networks**: Isolated network environments
- **Azure Storage**: Scalable cloud storage solutions

**Characteristics**:
- Most control over computing resources
- You manage: Operating systems, applications, data
- Azure manages: Physical hardware, network, data center facilities

### Platform as a Service (PaaS)
**Definition**: Provides a platform allowing customers to develop, run, and manage applications

**Azure Examples**:
- **Azure App Service**: Web app hosting platform
- **Azure SQL Database**: Managed relational database
- **Azure Functions**: Serverless compute platform

**Characteristics**:
- Focus on application development
- You manage: Applications, data
- Azure manages: Operating systems, middleware, runtime, infrastructure

### Software as a Service (SaaS)
**Definition**: Delivers software applications over the internet on a subscription basis

**Azure Examples**:
- **Microsoft 365**: Productivity applications (Word, Excel, PowerPoint)
- **Dynamics 365**: Business applications (CRM, ERP)
- **Azure DevOps**: Development collaboration tools

**Characteristics**:
- Ready-to-use applications
- You manage: User data, access management
- Azure manages: Everything else

---

## Cloud Deployment Models

### Public Cloud
- **Owned by**: Third-party cloud provider (Microsoft)
- **Access**: Available to general public over internet
- **Benefits**: No CapEx, high scalability, pay-as-you-go
- **Use cases**: Most cost-effective for typical workloads

### Private Cloud
- **Owned by**: Single organization
- **Location**: On-premises or hosted by third party
- **Benefits**: Complete control, enhanced security
- **Use cases**: Strict security/compliance requirements

### Hybrid Cloud
- **Combination**: Public and private clouds connected
- **Benefits**: Flexibility, gradual cloud migration, regulatory compliance
- **Use cases**: Sensitive data on-premises, burst capacity to public cloud

---

## Benefits of Cloud Computing

### High Availability
- **Definition**: Ability to keep services running for extended periods
- **Azure SLA**: Up to 99.99% uptime guarantee
- **Implementation**: Multiple data centers, redundancy, failover mechanisms

### Scalability
- **Vertical Scaling (Scale Up)**: Add more power to existing machines
- **Horizontal Scaling (Scale Out)**: Add more machines to your pool of resources
- **Auto-scaling**: Automatically adjust resources based on demand

### Elasticity
- **Definition**: Ability to scale resources up or down quickly
- **Benefits**: Handle traffic spikes, optimize costs during low usage
- **Azure Auto-scaling**: Automatically scales based on metrics

### Agility
- **Rapid Deployment**: Deploy resources in minutes, not weeks
- **Global Reach**: Deploy applications worldwide quickly
- **Innovation**: Focus on business value, not infrastructure management

### Fault Tolerance
- **Definition**: Ability to remain operational even if components fail
- **Implementation**: Redundant systems, backup procedures, disaster recovery
- **Azure Availability Zones**: Physically separate locations within a region

### Disaster Recovery
- **Business Continuity**: Maintain operations during and after disasters
- **Azure Site Recovery**: Automated disaster recovery solutions
- **Backup Solutions**: Azure Backup for data protection

### Global Reach
- **Azure Regions**: 60+ regions worldwide
- **Benefits**: Deploy closer to users, comply with data residency requirements
- **Content Delivery**: Azure CDN for global content distribution
          `,
        },
      ],
    },
    {
      title: 'Module 2: Azure Architecture and Services',
      description: 'Deep dive into Azure core services including compute, networking, and storage.',
      order: 2,
      lessons: [
        {
          title: 'Azure Compute Services',
          slug: 'azure-compute-services',
          order: 1,
          estimatedTime: 16,
          content: `
# Azure Compute Services

## Azure Virtual Machines

### Overview
Azure Virtual Machines (VMs) provide Infrastructure as a Service (IaaS) in the form of virtualized servers. VMs include virtual processors, memory, storage, and networking resources.

### VM Categories

**General Purpose**
- **B-series**: Burstable performance, cost-effective for variable workloads
- **D-series**: Balanced CPU-to-memory ratio, suitable for most workloads
- **Use cases**: Web servers, small databases, development environments

**Compute Optimized**
- **F-series**: High CPU-to-memory ratio
- **Use cases**: Web servers, network appliances, batch processes, application servers

**Memory Optimized**
- **E-series**: High memory-to-CPU ratio
- **M-series**: Largest memory offerings
- **Use cases**: In-memory databases, real-time analytics, SAP HANA

**Storage Optimized**
- **L-series**: High disk throughput and IO
- **Use cases**: Big data, SQL databases, NoSQL databases, data warehousing

**GPU Enabled**
- **N-series**: GPU-enabled VMs for compute-intensive workloads
- **Use cases**: Machine learning, rendering, video editing, gaming

### VM Pricing Options

**Pay-as-you-go**
- No upfront costs or long-term commitments
- Pay by the minute for compute capacity
- Most expensive per hour but most flexible

**Reserved Instances**
- 1-year or 3-year commitments
- Up to 72% cost savings compared to pay-as-you-go
- Best for steady-state workloads

**Spot Instances**
- Use unused Azure capacity at significant cost savings
- Can be evicted when Azure needs the capacity back
- Best for fault-tolerant, flexible workloads

---

## Azure App Service

### Overview
Azure App Service is a fully managed platform for building, deploying, and scaling web apps. It supports multiple programming languages and frameworks.

### Key Features
- **Auto-scaling**: Automatically scale based on demand
- **Continuous deployment**: Integrate with GitHub, Azure DevOps, Bitbucket
- **Custom domains**: Use your own domain names
- **SSL certificates**: Built-in SSL certificate management
- **Staging slots**: Deploy to staging environment before production

### Supported Platforms
- **.NET**: .NET Core and .NET Framework applications
- **Java**: Java SE, Tomcat, JBoss EAP applications
- **Node.js**: JavaScript applications
- **PHP**: PHP applications
- **Python**: Python applications
- **Ruby**: Ruby applications

### App Service Plans
- **Free**: Limited features, shared infrastructure
- **Shared**: Shared infrastructure with custom domains
- **Basic**: Dedicated infrastructure, manual scaling
- **Standard**: Auto-scaling, staging slots, daily backups
- **Premium**: Enhanced performance, VNet integration
- **Isolated**: Maximum scale and isolation

---

## Azure Functions

### Overview
Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure.

### Key Features
- **Event-driven**: Triggered by events from various Azure services
- **Serverless**: No infrastructure management required
- **Pay per execution**: Pay only when functions run
- **Multiple languages**: C#, Java, JavaScript, Python, PowerShell
- **Flexible scaling**: Automatically scales based on demand

### Trigger Types
- **HTTP Trigger**: Respond to HTTP requests
- **Timer Trigger**: Run on a schedule
- **Blob Trigger**: Respond to blob storage events
- **Queue Trigger**: Process messages from storage queues
- **Event Hub Trigger**: Process streaming data
- **Service Bus Trigger**: Process messages from Service Bus

### Hosting Options

**Consumption Plan**
- Pay per execution
- Automatic scaling
- 5-minute timeout (default)
- Best for event-driven workloads

**Premium Plan**
- Pre-warmed instances
- VNet connectivity
- No timeout limits
- Predictable pricing

**Dedicated Plan**
- Run on existing App Service plan
- Predictable costs
- Best for long-running functions

---

## Container Services

### Azure Container Instances (ACI)
- **Serverless containers**: Run containers without managing VMs
- **Fast startup**: Containers start in seconds
- **Per-second billing**: Pay only for runtime
- **Use cases**: Burst scaling, batch jobs, build agents

### Azure Kubernetes Service (AKS)
- **Managed Kubernetes**: Fully managed Kubernetes orchestration service
- **Simplified deployment**: Easy cluster deployment and management
- **Integrated monitoring**: Built-in monitoring and logging
- **Auto-scaling**: Horizontal pod autoscaler and cluster autoscaler
- **Use cases**: Microservices, CI/CD, machine learning workloads

### Azure Container Registry (ACR)
- **Private registry**: Store and manage container images
- **Geo-replication**: Replicate images across regions
- **Integrated security**: Vulnerability scanning, access controls
- **Use cases**: Store images for AKS, ACI, and other container services
          `,
        },
      ],
    },
  ];

  // Create Azure modules and lessons
  for (const modData of azureModulesData) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `azure-mod-${modData.order}-${azureFundamentals.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `azure-mod-${modData.order}-${azureFundamentals.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: azureFundamentals.id,
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

  console.log('✅ Azure Fundamentals learning content seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding AWS and Azure content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });