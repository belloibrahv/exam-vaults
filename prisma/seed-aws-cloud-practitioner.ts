import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAWSCloudPractitioner() {
  console.log('🌱 Seeding AWS Cloud Practitioner certification with real content...');

  // Get AWS provider and Foundational level
  const awsProvider = await prisma.provider.findUnique({
    where: { slug: 'aws' }
  });

  const foundationalLevel = await prisma.certificationLevel.findUnique({
    where: { slug: 'foundational' }
  });

  if (!awsProvider || !foundationalLevel) {
    console.log('❌ AWS provider or foundational level not found');
    return;
  }

  // Get AWS Cloud Practitioner certification
  const certification = await prisma.certification.findUnique({
    where: { slug: 'aws-cloud-practitioner' },
    include: { learningModules: true }
  });

  if (!certification) {
    console.log('❌ AWS Cloud Practitioner certification not found');
    return;
  }

  console.log('📚 Creating learning modules with real content...');

  // Learning Module 1: Cloud Concepts (26% of exam)
  const module1 = await prisma.learningModule.upsert({
    where: {
      id: `aws-mod-1-${certification.id}`,
    },
    update: {},
    create: {
      id: `aws-mod-1-${certification.id}`,
      title: 'Cloud Concepts',
      description: 'Fundamental cloud computing concepts, benefits, and deployment models',
      order: 1,
      certificationId: certification.id,
    }
  });

  // Create detailed lessons for Module 1
  const module1Lessons = [
    {
      title: 'What is Cloud Computing?',
      slug: 'what-is-cloud-computing',
      content: `# What is Cloud Computing?

## Definition
Cloud computing is the on-demand delivery of IT resources (compute power, storage, databases, networking, software, analytics, and intelligence) over the internet with pay-as-you-use pricing.

## Key Characteristics

### 1. On-demand self-service
Users can provision computing resources automatically without requiring human interaction with cloud providers.

### 2. Broad network access
Services are available over the network and can be accessed through standard mechanisms that promote use by heterogeneous client platforms (mobile phones, tablets, laptops, workstations).

### 3. Resource pooling
Computing resources are pooled to serve multiple consumers using a multi-tenant model, with different physical and virtual resources dynamically assigned and reassigned according to demand.

### 4. Rapid elasticity
Capabilities can be elastically provisioned and released to scale rapidly outward and inward commensurate with demand.

### 5. Measured service
Cloud systems automatically control and optimize resource use by leveraging a metering capability at some level of abstraction appropriate to the type of service.

## Traditional IT vs Cloud Computing

| Traditional IT | Cloud Computing |
|---|---|
| Large upfront investments | Pay-as-you-go model |
| Capacity guessing | Scale up/down as needed |
| Slow deployment | Deploy in minutes |
| Maintenance overhead | Focus on business value |
| Limited global reach | Global infrastructure |

## Benefits of Cloud Computing

### Cost Benefits
- **No upfront costs**: Eliminate capital expenses
- **Lower operating costs**: Pay only for what you use
- **Economies of scale**: Benefit from AWS's massive scale

### Speed & Agility
- **Increase speed**: Go from idea to deployment in minutes
- **Stop guessing capacity**: Scale up or down based on actual demand
- **Improve agility**: Focus on projects that differentiate your business

### Global Reach
- **Go global**: Deploy applications in multiple AWS Regions worldwide
- **Reduce latency**: Serve customers from locations closest to them

## Common Use Cases
1. **Backup and storage**
2. **Big data analytics**
3. **Website hosting**
4. **Mobile and web applications**
5. **Disaster recovery**
6. **Development and testing**`,
      estimatedTime: 15,
      order: 1,
      moduleId: module1.id
    },
    {
      title: 'Cloud Service Models (IaaS, PaaS, SaaS)',
      slug: 'cloud-service-models',
      content: `# Cloud Service Models

Cloud computing offers different service models to meet various business needs. Understanding these models is crucial for the AWS Cloud Practitioner exam.

## Infrastructure as a Service (IaaS)

### Definition
IaaS provides virtualized computing resources over the internet. You rent IT infrastructure (servers, VMs, storage, networks, operating systems) from a cloud provider on a pay-as-you-go basis.

### Characteristics
- **Most control**: Full control over the infrastructure
- **Most responsibility**: You manage the OS, middleware, runtime, data, and applications
- **Most flexible**: Configure infrastructure as needed

### AWS Examples
- **Amazon EC2**: Virtual servers in the cloud
- **Amazon VPC**: Virtual private cloud networking
- **Amazon EBS**: Block storage for EC2 instances

### Use Cases
- Website hosting
- Web applications
- Storage and backup
- High-performance computing

## Platform as a Service (PaaS)

### Definition
PaaS provides a platform allowing customers to develop, run, and manage applications without dealing with the underlying infrastructure.

### Characteristics
- **Medium control**: Control over applications and data
- **Medium responsibility**: Platform manages OS, middleware, and runtime
- **Focus on development**: Concentrate on building applications

### AWS Examples
- **AWS Elastic Beanstalk**: Deploy and manage web applications
- **AWS Lambda**: Serverless computing platform
- **Amazon RDS**: Managed database service

### Use Cases
- Application development
- API development and management
- Business analytics
- Database management

## Software as a Service (SaaS)

### Definition
SaaS delivers software applications over the internet, on-demand and typically on a subscription basis.

### Characteristics
- **Least control**: Use the software as provided
- **Least responsibility**: Provider manages everything
- **Ready to use**: Access applications immediately

### AWS Examples
- **Amazon WorkSpaces**: Virtual desktop infrastructure
- **Amazon Chime**: Communication service
- **AWS Organizations**: Account management service

### Use Cases
- Email and messaging
- Customer relationship management
- Enterprise resource planning
- Collaboration tools

## Shared Responsibility Model

Understanding who is responsible for what in each service model:

### IaaS Responsibilities
| Customer Responsibility | AWS Responsibility |
|---|---|
| Operating system | Physical infrastructure |
| Network & firewall configuration | Hypervisor |
| Server-side encryption | Network infrastructure |
| Network traffic protection | Hardware |

### PaaS Responsibilities
| Customer Responsibility | AWS Responsibility |
|---|---|
| Application code | Operating system |
| Data | Runtime |
| Access management | Middleware |
| | Platform infrastructure |

### SaaS Responsibilities
| Customer Responsibility | AWS Responsibility |
|---|---|
| Data access policies | Application |
| User access management | Platform |
| | Infrastructure |
| | Everything else |

## Choosing the Right Model

### Choose IaaS when:
- You need maximum control over infrastructure
- You have existing applications to migrate
- You need custom configurations

### Choose PaaS when:
- You want to focus on application development
- You need faster time-to-market
- You want automatic scaling and management

### Choose SaaS when:
- You need ready-to-use applications
- You want minimal IT overhead
- You need standard business applications`,
      estimatedTime: 20,
      order: 2,
      moduleId: module1.id
    },
    {
      title: 'Cloud Deployment Models',
      slug: 'cloud-deployment-models',
      content: `# Cloud Deployment Models

Cloud deployment models define where your cloud infrastructure resides and who has access to it. Each model offers different benefits and trade-offs.

## Public Cloud

### Definition
Cloud services offered over the public internet and available to anyone who wants to purchase them. Resources are owned and operated by a third-party cloud service provider.

### Characteristics
- **Shared infrastructure**: Resources shared among multiple customers
- **Internet access**: Services accessed via public internet
- **No upfront costs**: Pay-as-you-use model
- **High scalability**: Virtually unlimited resources

### AWS Public Cloud Services
- Amazon EC2
- Amazon S3
- Amazon RDS
- Lambda functions

### Benefits
- ✅ **Cost-effective**: No capital expenditure
- ✅ **Scalable**: Scale resources up/down as needed
- ✅ **Reliable**: Built-in redundancy and availability
- ✅ **Secure**: Enterprise-grade security

### Use Cases
- Web applications
- Development and testing
- Storage and backup
- Big data analytics

## Private Cloud

### Definition
Cloud computing resources used exclusively by a single business or organization. Can be physically located at your organization's on-site datacenter or hosted by a third-party service provider.

### Characteristics
- **Dedicated resources**: Not shared with other organizations
- **Enhanced control**: Greater control over resources and security
- **Customization**: Can be tailored to specific business needs
- **Higher costs**: More expensive than public cloud

### AWS Private Cloud Options
- **AWS Outposts**: Bring AWS services to on-premises
- **VMware Cloud on AWS**: VMware-based private cloud
- **AWS Local Zones**: AWS infrastructure closer to end-users

### Benefits
- ✅ **Security**: Enhanced security and privacy
- ✅ **Compliance**: Meet strict regulatory requirements
- ✅ **Control**: Full control over resources
- ✅ **Customization**: Tailored to specific needs

### Use Cases
- Highly regulated industries
- Sensitive data processing
- Legacy application requirements
- Specific compliance needs

## Hybrid Cloud

### Definition
Combines public and private clouds, allowing data and applications to be shared between them. Provides greater flexibility and optimization of existing infrastructure, security, and compliance.

### Characteristics
- **Best of both worlds**: Combines benefits of public and private
- **Flexibility**: Workloads can move between cloud types
- **Gradual migration**: Allows phased cloud adoption
- **Complex management**: Requires orchestration between environments

### AWS Hybrid Solutions
- **AWS Direct Connect**: Dedicated network connection to AWS
- **AWS Storage Gateway**: Hybrid cloud storage
- **AWS DataSync**: Data transfer between on-premises and AWS
- **AWS Systems Manager**: Manage hybrid infrastructure

### Benefits
- ✅ **Flexibility**: Keep some workloads on-premises
- ✅ **Compliance**: Meet regulatory requirements
- ✅ **Cost optimization**: Use most cost-effective platform
- ✅ **Scalability**: Burst to cloud when needed

### Use Cases
- Data sovereignty requirements
- Variable workloads
- Disaster recovery
- Legacy system integration

## Multi-Cloud

### Definition
Using cloud services from multiple cloud providers (AWS, Microsoft Azure, Google Cloud) to avoid vendor lock-in and optimize for specific capabilities.

### Characteristics
- **Multiple providers**: Services from different vendors
- **Best-of-breed**: Choose best service from each provider
- **Vendor independence**: Avoid lock-in to single provider
- **Complex management**: Increased operational complexity

### AWS Multi-Cloud Support
- **AWS Marketplace**: Third-party solutions
- **Partner solutions**: Integration with other clouds
- **Open standards**: Support for open-source technologies

### Benefits
- ✅ **Flexibility**: Choose best services from each provider
- ✅ **Risk mitigation**: Reduce dependency on single vendor
- ✅ **Negotiation power**: Better pricing through competition
- ✅ **Innovation**: Access to latest features from all providers

### Challenges
- ❌ **Complexity**: More complex to manage
- ❌ **Skills gap**: Need expertise in multiple platforms
- ❌ **Data transfer costs**: Moving data between clouds
- ❌ **Security complexity**: Consistent security across platforms

## Choosing the Right Deployment Model

### Factors to Consider

1. **Security Requirements**
   - Public: Standard security controls
   - Private: Enhanced security and control
   - Hybrid: Mix of security levels

2. **Compliance Needs**
   - Public: Standard compliance certifications
   - Private: Custom compliance controls
   - Hybrid: Flexible compliance approach

3. **Cost Considerations**
   - Public: Lowest cost, pay-as-you-go
   - Private: Higher costs but predictable
   - Hybrid: Balanced cost approach

4. **Performance Requirements**
   - Public: Good performance, shared resources
   - Private: Dedicated performance
   - Hybrid: Optimized performance placement

5. **Scalability Needs**
   - Public: Unlimited scalability
   - Private: Limited by infrastructure
   - Hybrid: Flexible scalability options`,
      estimatedTime: 18,
      order: 3,
      moduleId: module1.id
    }
  ];

  // Create lessons for module 1
  for (const lesson of module1Lessons) {
    await prisma.learningLesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module1.id,
          slug: lesson.slug
        }
      },
      update: lesson,
      create: lesson
    });
  }

  console.log('✅ Module 1: Cloud Concepts completed');

  // Learning Module 2: Security and Compliance (25% of exam)
  const module2 = await prisma.learningModule.upsert({
    where: {
      id: `aws-mod-2-${certification.id}`,
    },
    update: {},
    create: {
      id: `aws-mod-2-${certification.id}`,
      title: 'Security and Compliance',
      description: 'AWS security services, shared responsibility model, and compliance frameworks',
      order: 2,
      certificationId: certification.id,
    }
  });

  const module2Lessons = [
    {
      title: 'AWS Shared Responsibility Model',
      slug: 'aws-shared-responsibility-model',
      content: `# AWS Shared Responsibility Model

## Overview
The AWS Shared Responsibility Model describes the division of responsibilities between AWS and the customer for security and compliance in the cloud.

## Core Concept
- **AWS**: Responsible for "Security OF the Cloud"
- **Customer**: Responsible for "Security IN the Cloud"

## AWS Responsibilities (Security OF the Cloud)

### Physical Infrastructure
- **Data centers**: Physical security of AWS facilities
- **Hardware**: Server hardware, storage devices, networking equipment
- **Network infrastructure**: Routers, switches, load balancers
- **Hypervisor**: Virtualization layer management

### Software Infrastructure
- **Host operating system**: OS patches and maintenance
- **Service software**: AWS service software and patches
- **Network controls**: Network ACLs, security groups (infrastructure level)

### Global Infrastructure Security
- **Regions and Availability Zones**: Physical separation and security
- **Edge locations**: CloudFront and content delivery security
- **Network backbone**: AWS global network security

## Customer Responsibilities (Security IN the Cloud)

### Data Protection
- **Data encryption**: At rest and in transit
- **Data classification**: Sensitive data identification
- **Data backup**: Backup and recovery strategies
- **Data retention**: Compliance with data retention policies

### Identity and Access Management
- **User management**: Creating and managing user accounts
- **Access controls**: Permissions and role assignments
- **Multi-factor authentication**: Enabling MFA
- **Key management**: Encryption key management

### Operating System and Applications
- **OS patches**: Guest operating system updates
- **Application security**: Secure coding practices
- **Antivirus software**: Endpoint protection
- **Host-based firewalls**: Local firewall configuration

### Network Security
- **Security groups**: EC2 instance-level firewalls
- **Network ACLs**: Subnet-level access controls
- **VPC configuration**: Virtual private cloud setup
- **SSL/TLS certificates**: Web traffic encryption

## Service-Specific Responsibilities

### Infrastructure Services (IaaS) - Example: EC2
| AWS Responsibility | Customer Responsibility |
|---|---|
| Physical host | Guest OS (including updates and security patches) |
| Hypervisor | Applications |
| Network infrastructure | Security groups and firewall configuration |
| Physical facilities | Data encryption |

### Container Services - Example: ECS
| AWS Responsibility | Customer Responsibility |
|---|---|
| Host OS/Kernel | Container images |
| Docker daemon | Application code |
| ECS agent | Data encryption |
| Network controls | IAM settings |

### Abstracted Services - Example: S3
| AWS Responsibility | Customer Responsibility |
|---|---|
| Infrastructure | Bucket policies |
| Global infrastructure | IAM user and roles |
| Service software | Data encryption (optional) |
| Patch management | Access logging |

### Fully Managed Services - Example: RDS
| AWS Responsibility | Customer Responsibility |
|---|---|
| OS patching | Database user accounts |
| Database software installation | Database-level permissions |
| Backup service configuration | Parameter group configuration |
| High availability | Data encryption |

## Common Misconceptions

### ❌ "AWS secures everything"
- AWS secures the infrastructure, not your configurations
- Customer must properly configure security settings

### ❌ "Customer has no security responsibilities with managed services"
- Even with managed services, customers must configure access controls
- Data encryption and backup strategies remain customer responsibility

### ❌ "AWS can access customer data"
- AWS has no access to customer data without explicit permission
- Customer owns and controls their data

## Best Practices for Shared Responsibility

### 1. Understand Service Models
- **Know what you're responsible for**: Different services have different responsibility divisions
- **Read service documentation**: Understand security features and configurations
- **Use AWS Security Center**: Access security best practices and guidance

### 2. Implement Defense in Depth
- **Multiple security layers**: Don't rely on a single security control
- **Regular security assessments**: Audit and test security controls
- **Security automation**: Use AWS services for automated security

### 3. Stay Informed
- **AWS Security Blog**: Keep up with security announcements
- **AWS Trusted Advisor**: Get security recommendations
- **AWS Config**: Monitor configuration compliance

## AWS Tools for Customer Responsibilities

### Security Management
- **AWS IAM**: Identity and Access Management
- **AWS Organizations**: Account management and governance
- **AWS SSO**: Single sign-on service

### Monitoring and Compliance
- **AWS CloudTrail**: API call logging
- **AWS CloudWatch**: Monitoring and alerting
- **AWS Config**: Configuration compliance

### Data Protection
- **AWS KMS**: Key Management Service
- **AWS Certificate Manager**: SSL/TLS certificate management
- **AWS Secrets Manager**: Secrets storage

### Network Security
- **Amazon VPC**: Virtual private cloud
- **AWS WAF**: Web application firewall
- **AWS Shield**: DDoS protection`,
      estimatedTime: 25,
      order: 1,
      moduleId: module2.id
    }
  ];

  // Create lessons for module 2
  for (const lesson of module2Lessons) {
    await prisma.learningLesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module2.id,
          slug: lesson.slug
        }
      },
      update: lesson,
      create: lesson
    });
  }

  console.log('✅ Module 2: Security and Compliance started');

  // Now let's add some real exam questions
  console.log('📝 Adding AWS Cloud Practitioner exam questions...');

  // Cloud Concepts Questions
  const questions = [
    {
      questionText: "Which of the following are benefits of the AWS Cloud? (Choose two.)",
      questionType: "MULTIPLE_CHOICE" as const,
      difficulty: "MEDIUM" as const,
      domain: "Cloud Concepts",
      subDomain: "Benefits of AWS Cloud",
      options: [
        { id: "a", text: "Trade capital expense for variable expense", isCorrect: true, explanation: "AWS allows you to pay only for what you use, converting CapEx to OpEx." },
        { id: "b", text: "Maintain physical servers", isCorrect: false, explanation: "AWS manages physical servers, this is not a benefit but rather something AWS takes care of." },
        { id: "c", text: "Increase speed and agility", isCorrect: true, explanation: "AWS enables faster deployment and scaling of applications and infrastructure." },
        { id: "d", text: "Stop spending money on technology", isCorrect: false, explanation: "You still spend money on technology, but you optimize how you spend it." }
      ],
      correctAnswers: ["a", "c"],
      explanation: "AWS cloud provides the benefit of converting capital expenses to operational expenses and enables organizations to increase speed and agility in their operations."
    },
    {
      questionText: "What is the AWS shared responsibility model?",
      questionType: "SINGLE_CHOICE" as const,
      difficulty: "EASY" as const,
      domain: "Security and Compliance",
      subDomain: "Shared Responsibility Model",
      options: [
        { id: "a", text: "AWS is responsible for security of the cloud, customer is responsible for security in the cloud", isCorrect: true, explanation: "This correctly describes the shared responsibility model." },
        { id: "b", text: "Both AWS and customer share equal responsibility for all security aspects", isCorrect: false, explanation: "The responsibility is divided, not equally shared for all aspects." },
        { id: "c", text: "Customer is responsible for all security aspects", isCorrect: false, explanation: "AWS handles infrastructure security." },
        { id: "d", text: "AWS is responsible for all security aspects", isCorrect: false, explanation: "Customer has responsibilities for security in the cloud." }
      ],
      correctAnswers: ["a"],
      explanation: "The AWS shared responsibility model divides security responsibilities between AWS (infrastructure) and customer (data and applications)."
    },
    {
      questionText: "Which AWS service provides a virtual network environment that you control?",
      questionType: "SINGLE_CHOICE" as const,
      difficulty: "EASY" as const,
      domain: "Technology",
      subDomain: "Networking",
      options: [
        { id: "a", text: "Amazon VPC", isCorrect: true, explanation: "Amazon VPC (Virtual Private Cloud) provides an isolated virtual network environment." },
        { id: "b", text: "Amazon EC2", isCorrect: false, explanation: "EC2 provides compute instances, not networking." },
        { id: "c", text: "Amazon S3", isCorrect: false, explanation: "S3 is a storage service, not networking." },
        { id: "d", text: "Amazon RDS", isCorrect: false, explanation: "RDS is a database service, not networking." }
      ],
      correctAnswers: ["a"],
      explanation: "Amazon VPC allows you to create a virtual network environment in AWS where you can launch AWS resources."
    },
    {
      questionText: "Which of the following are characteristics of cloud computing? (Choose three.)",
      questionType: "MULTIPLE_CHOICE" as const,
      difficulty: "MEDIUM" as const,
      domain: "Cloud Concepts",
      subDomain: "Cloud Computing Concepts",
      options: [
        { id: "a", text: "On-demand self-service", isCorrect: true, explanation: "Users can provision resources automatically without human intervention." },
        { id: "b", text: "Broad network access", isCorrect: true, explanation: "Services are available over the network from various devices." },
        { id: "c", text: "Resource pooling", isCorrect: true, explanation: "Resources are pooled to serve multiple customers with multi-tenancy." },
        { id: "d", text: "Limited scalability", isCorrect: false, explanation: "Cloud computing provides elastic scalability, not limited scalability." },
        { id: "e", text: "High upfront costs", isCorrect: false, explanation: "Cloud computing typically has low or no upfront costs." }
      ],
      correctAnswers: ["a", "b", "c"],
      explanation: "The NIST definition of cloud computing includes five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service."
    },
    {
      questionText: "Which AWS service is used for object storage?",
      questionType: "SINGLE_CHOICE" as const,
      difficulty: "EASY" as const,
      domain: "Technology",
      subDomain: "Storage",
      options: [
        { id: "a", text: "Amazon S3", isCorrect: true, explanation: "Amazon S3 (Simple Storage Service) is AWS's object storage service." },
        { id: "b", text: "Amazon EBS", isCorrect: false, explanation: "EBS provides block storage for EC2 instances." },
        { id: "c", text: "Amazon EFS", isCorrect: false, explanation: "EFS is a file storage service." },
        { id: "d", text: "Amazon Glacier", isCorrect: false, explanation: "Glacier is for long-term archival (though it's part of S3 now)." }
      ],
      correctAnswers: ["a"],
      explanation: "Amazon S3 is a highly scalable object storage service designed for storing and retrieving any amount of data from anywhere."
    }
  ];

  // Add questions to the certification
  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        question: q.questionText,
        questionType: q.questionType,
        difficulty: q.difficulty,
        explanation: q.explanation,
        certificationId: certification.id,
        options: q.options,
        correctAnswers: q.correctAnswers,
        category: q.domain,
        tags: [q.subDomain]
      }
    });
    console.log(`✅ Added question: ${q.questionText.substring(0, 50)}...`);
  }

  console.log('🎉 AWS Cloud Practitioner certification seeded with real content!');
}

if (require.main === module) {
  seedAWSCloudPractitioner()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}