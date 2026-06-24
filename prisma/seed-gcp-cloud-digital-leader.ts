import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGCPCloudDigitalLeader() {
  console.log('🌱 Seeding GCP Cloud Digital Leader certification with real content...');

  // Get GCP provider and Foundational level
  const gcpProvider = await prisma.provider.findUnique({
    where: { slug: 'gcp' }
  });

  const foundationalLevel = await prisma.level.findUnique({
    where: { slug: 'foundational' }
  });

  if (!gcpProvider || !foundationalLevel) {
    console.log('❌ GCP provider or foundational level not found');
    return;
  }

  // Get GCP Cloud Digital Leader certification
  const certification = await prisma.certification.findUnique({
    where: { slug: 'gcp-cloud-digital-leader' },
    include: { learningModules: true }
  });

  if (!certification) {
    console.log('❌ GCP Cloud Digital Leader certification not found');
    return;
  }

  console.log('📚 Creating learning modules with real GCP content...');

  // Learning Module 1: Digital Transformation with Google Cloud
  const module1 = await prisma.learningModule.upsert({
    where: {
      certificationId_order: {
        certificationId: certification.id,
        order: 1
      }
    },
    update: {},
    create: {
      title: 'Digital Transformation with Google Cloud',
      description: 'Understanding digital transformation concepts and Google Cloud\'s role in modernizing businesses',
      order: 1,
      certificationId: certification.id,
    }
  });

  const module1Lessons = [
    {
      title: 'Digital Transformation Fundamentals',
      slug: 'digital-transformation-fundamentals',
      content: `# Digital Transformation Fundamentals

## What is Digital Transformation?

Digital transformation is the adoption of digital technology by an organization to digitize non-digital products, services, or operations and create value for customers and employees.

## Key Components of Digital Transformation

### 1. Technology Modernization
- **Legacy system replacement**: Moving from outdated systems to modern, cloud-based solutions
- **Cloud migration**: Transitioning from on-premises to cloud infrastructure
- **Automation**: Implementing automated processes to increase efficiency
- **Integration**: Connecting disparate systems and data sources

### 2. Data-Driven Decision Making
- **Data collection**: Gathering data from various touchpoints
- **Analytics**: Using tools to analyze and interpret data
- **Business intelligence**: Creating actionable insights from data
- **Predictive analytics**: Using historical data to predict future trends

### 3. Customer Experience Enhancement
- **Omnichannel experiences**: Consistent experience across all channels
- **Personalization**: Tailoring experiences to individual customers
- **Self-service options**: Empowering customers to help themselves
- **Real-time engagement**: Immediate responses and interactions

### 4. Operational Efficiency
- **Process optimization**: Streamlining business processes
- **Resource optimization**: Better utilization of resources
- **Cost reduction**: Eliminating inefficiencies and redundancies
- **Scalability**: Ability to grow and adapt quickly

## Google Cloud's Role in Digital Transformation

### Infrastructure Transformation
- **Compute Engine**: Scalable virtual machines
- **Kubernetes Engine**: Container orchestration
- **App Engine**: Serverless application platform
- **Cloud Functions**: Event-driven serverless computing

### Data Transformation
- **BigQuery**: Serverless data warehouse
- **Cloud Storage**: Object storage service
- **Cloud SQL**: Managed relational databases
- **Firestore**: NoSQL document database

### AI/ML Transformation
- **AI Platform**: Machine learning model development
- **AutoML**: Automated machine learning
- **Vision AI**: Image analysis and recognition
- **Natural Language AI**: Text analysis and understanding

### Collaboration Transformation
- **Google Workspace**: Productivity and collaboration suite
- **Meet**: Video conferencing and collaboration
- **Drive**: Cloud storage and file sharing
- **Sites**: Website creation and management

## Digital Transformation Challenges

### Technical Challenges
- **Legacy system integration**: Connecting old and new systems
- **Data silos**: Breaking down isolated data repositories
- **Security concerns**: Maintaining security during transition
- **Skill gaps**: Lack of technical expertise

### Organizational Challenges
- **Change resistance**: Employee reluctance to adopt new technologies
- **Cultural barriers**: Organizational culture not aligned with digital transformation
- **Leadership buy-in**: Lack of support from senior management
- **Resource allocation**: Insufficient budget and resources

### Strategic Challenges
- **Unclear objectives**: Lack of clear digital transformation goals
- **Unrealistic timelines**: Setting impossible deadlines
- **Technology selection**: Choosing the wrong technologies
- **Measurement difficulties**: Inability to measure success

## Best Practices for Digital Transformation

### 1. Start with Strategy
- **Define clear objectives**: What do you want to achieve?
- **Assess current state**: Where are you now?
- **Identify gaps**: What needs to change?
- **Create roadmap**: How will you get there?

### 2. Focus on People
- **Change management**: Help people adapt to new ways of working
- **Training and education**: Provide necessary skills and knowledge
- **Communication**: Keep everyone informed about changes
- **Leadership support**: Ensure leaders champion the transformation

### 3. Take an Incremental Approach
- **Start small**: Begin with pilot projects
- **Learn and iterate**: Continuously improve based on feedback
- **Scale gradually**: Expand successful pilots
- **Measure progress**: Track key metrics and outcomes

### 4. Leverage Cloud Technologies
- **Scalability**: Cloud provides ability to scale up or down
- **Cost efficiency**: Pay only for what you use
- **Innovation**: Access to cutting-edge technologies
- **Global reach**: Deploy applications worldwide

## Measuring Digital Transformation Success

### Key Performance Indicators (KPIs)
- **Customer satisfaction**: Net Promoter Score (NPS), customer retention
- **Operational efficiency**: Process automation, cost reduction
- **Employee productivity**: Task completion time, collaboration metrics
- **Revenue growth**: New revenue streams, market expansion

### Technical Metrics
- **System availability**: Uptime and reliability
- **Performance**: Response times, throughput
- **Security**: Incident response time, vulnerability management
- **Scalability**: Ability to handle increased load

### Business Metrics
- **Time to market**: Speed of new product/service launches
- **Innovation rate**: Number of new initiatives launched
- **Market competitiveness**: Market share, competitive advantage
- **Return on investment**: Financial returns from transformation initiatives

## Common Digital Transformation Patterns

### 1. Lift and Shift
- Move existing applications to cloud without modification
- Quick migration but limited cloud benefits
- Good starting point for cloud journey

### 2. Re-platforming
- Make minimal changes to applications for cloud optimization
- Better performance and cost benefits
- Moderate effort and risk

### 3. Refactoring
- Significantly modify applications for cloud-native architectures
- Maximum cloud benefits and innovation potential
- Higher effort but greater long-term value

### 4. Rebuilding
- Completely rewrite applications using cloud-native technologies
- Best performance and scalability
- Highest effort and risk but maximum benefits`,
      estimatedTime: 20,
      order: 1,
      moduleId: module1.id
    },
    {
      title: 'Google Cloud Infrastructure and Services',
      slug: 'google-cloud-infrastructure-services',
      content: `# Google Cloud Infrastructure and Services

## Google Cloud Global Infrastructure

### Regions and Zones
- **Regions**: Independent geographic areas with multiple zones
- **Zones**: Isolated locations within regions for high availability
- **Multi-region**: Span multiple geographic regions for maximum availability

### Current Infrastructure (2024)
- **30+ Regions**: Across Americas, Europe, and Asia-Pacific
- **90+ Zones**: Multiple zones per region for redundancy
- **200+ Countries**: Global network presence
- **Premium Network**: Private fiber network connecting regions

### Benefits of Global Infrastructure
- **Low latency**: Serve users from nearby locations
- **High availability**: Redundancy across zones and regions
- **Disaster recovery**: Geographic separation for business continuity
- **Compliance**: Meet data residency and regulatory requirements

## Core Compute Services

### Compute Engine
Virtual machines running in Google's data centers

**Key Features:**
- **Custom machine types**: Right-size VMs for your workloads
- **Preemptible VMs**: Cost-effective short-lived instances
- **Live migration**: No downtime for maintenance
- **Sustained use discounts**: Automatic discounts for long-running workloads

**Use Cases:**
- Web applications and APIs
- Development and testing environments
- High-performance computing
- Enterprise applications

### Google Kubernetes Engine (GKE)
Managed Kubernetes service for containerized applications

**Key Features:**
- **Auto-scaling**: Automatically scale nodes and pods
- **Auto-repair**: Automatically repair unhealthy nodes
- **Auto-upgrade**: Keep clusters up-to-date automatically
- **Istio integration**: Service mesh for microservices

**Use Cases:**
- Microservices applications
- CI/CD pipelines
- Hybrid and multi-cloud deployments
- Modern application development

### App Engine
Fully managed serverless platform for applications

**Key Features:**
- **No server management**: Focus on code, not infrastructure
- **Automatic scaling**: Scale from zero to thousands of instances
- **Built-in services**: Authentication, databases, caching
- **Multiple runtimes**: Support for various programming languages

**Use Cases:**
- Web applications
- Mobile backends
- API development
- Rapid prototyping

### Cloud Functions
Event-driven serverless compute platform

**Key Features:**
- **Event-driven**: Triggered by events from various sources
- **No servers**: Completely serverless execution
- **Automatic scaling**: Scale based on demand
- **Pay-per-execution**: Only pay when functions run

**Use Cases:**
- Data processing
- Webhooks and APIs
- IoT backends
- Real-time file processing

## Storage Services

### Cloud Storage
Object storage for unstructured data

**Storage Classes:**
- **Standard**: Frequently accessed data
- **Nearline**: Monthly access patterns
- **Coldline**: Quarterly access patterns
- **Archive**: Long-term archival storage

**Key Features:**
- **Global availability**: Access from anywhere
- **Strong consistency**: Immediate consistency for all operations
- **Security**: Encryption at rest and in transit
- **Lifecycle management**: Automatic data lifecycle policies

### Cloud SQL
Fully managed relational database service

**Supported Databases:**
- MySQL
- PostgreSQL
- SQL Server

**Key Features:**
- **High availability**: Automated failover and backups
- **Read replicas**: Scale read operations
- **Point-in-time recovery**: Restore to any point in time
- **Security**: Network isolation and encryption

### Cloud Spanner
Fully managed, globally distributed relational database

**Key Features:**
- **Global consistency**: ACID transactions across regions
- **Horizontal scaling**: Scale reads and writes independently
- **99.999% availability**: Five nines SLA
- **SQL support**: Standard SQL interface

### Firestore
NoSQL document database

**Key Features:**
- **Real-time updates**: Live synchronization across clients
- **Offline support**: Work offline with automatic sync
- **Multi-region replication**: Global data distribution
- **ACID transactions**: Strong consistency guarantees

## Networking Services

### Virtual Private Cloud (VPC)
Software-defined networking for Google Cloud resources

**Key Features:**
- **Global VPC**: Spans all regions automatically
- **Subnet isolation**: Control traffic between subnets
- **Firewall rules**: Network-level security controls
- **Private Google Access**: Access Google services privately

### Cloud Load Balancing
Distribute traffic across multiple instances

**Types:**
- **HTTP(S) Load Balancing**: Application-layer load balancing
- **Network Load Balancing**: Transport-layer load balancing
- **Internal Load Balancing**: Private load balancing within VPC

### Cloud CDN
Content delivery network for fast content delivery

**Key Features:**
- **Global edge locations**: Cache content close to users
- **Cache invalidation**: Update cached content instantly
- **SSL termination**: Handle SSL/TLS at the edge
- **Integration**: Works with other Google Cloud services

## Data and Analytics Services

### BigQuery
Serverless data warehouse for analytics

**Key Features:**
- **Serverless**: No infrastructure management
- **Petabyte scale**: Handle massive datasets
- **Standard SQL**: Familiar query interface
- **Machine learning**: Built-in ML capabilities

### Cloud Dataflow
Fully managed stream and batch data processing

**Key Features:**
- **Unified programming model**: Same API for batch and stream
- **Auto-scaling**: Automatically scale resources
- **No-ops**: Fully managed service
- **Apache Beam**: Based on open-source Beam SDK

### Cloud Pub/Sub
Messaging service for event-driven systems

**Key Features:**
- **At-least-once delivery**: Guaranteed message delivery
- **Global scaling**: Handle millions of messages per second
- **Push and pull**: Multiple delivery methods
- **Ordering**: Maintain message order when needed

## AI and Machine Learning Services

### AI Platform
Fully managed machine learning platform

**Key Features:**
- **Training**: Train ML models at scale
- **Prediction**: Serve models for online and batch prediction
- **Pipelines**: Build ML workflows
- **Notebooks**: Managed Jupyter notebooks

### AutoML
Automated machine learning for custom models

**Available Services:**
- **AutoML Vision**: Image classification and object detection
- **AutoML Natural Language**: Text classification and entity extraction
- **AutoML Translation**: Custom translation models
- **AutoML Tables**: Structured data predictions

### Pre-trained APIs
Ready-to-use AI services

**Available APIs:**
- **Vision API**: Image analysis and recognition
- **Natural Language API**: Text analysis and understanding
- **Speech-to-Text API**: Convert audio to text
- **Translation API**: Language translation

## Security Services

### Identity and Access Management (IAM)
Control access to Google Cloud resources

**Key Concepts:**
- **Principals**: Who can access resources
- **Roles**: What actions are allowed
- **Resources**: What can be accessed
- **Policies**: Bind principals to roles

### Cloud Security Command Center
Security and risk management platform

**Key Features:**
- **Asset inventory**: Comprehensive view of all assets
- **Vulnerability scanning**: Identify security vulnerabilities
- **Threat detection**: Detect suspicious activities
- **Compliance monitoring**: Monitor compliance status

### Cloud KMS
Key management service for encryption

**Key Features:**
- **Centralized key management**: Manage all encryption keys
- **Hardware security modules**: FIPS 140-2 Level 3 certified
- **Rotation**: Automatic key rotation
- **Audit logs**: Complete audit trail

## Development and Operations

### Cloud Build
Continuous integration and delivery platform

**Key Features:**
- **Build triggers**: Automatically trigger builds
- **Multiple environments**: Support for various build environments
- **Private pools**: Use your own build infrastructure
- **Security scanning**: Automatic vulnerability scanning

### Cloud Deployment Manager
Infrastructure as Code service

**Key Features:**
- **Declarative templates**: Define infrastructure as code
- **Preview mode**: See changes before applying
- **Parallel deployment**: Deploy resources in parallel
- **Rollback support**: Easily rollback changes

### Stackdriver (Google Cloud Operations)
Monitoring and observability platform

**Components:**
- **Monitoring**: Metrics collection and alerting
- **Logging**: Centralized log management
- **Tracing**: Distributed tracing for applications
- **Profiler**: Application performance profiling`,
      estimatedTime: 25,
      order: 2,
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

  console.log('✅ Module 1: Digital Transformation with Google Cloud completed');

  // Add GCP exam questions
  const questions = [
    {
      questionText: "What are the key benefits of digital transformation? (Choose three.)",
      questionType: "MULTIPLE_SELECT" as const,
      difficulty: "MEDIUM" as const,
      domain: "Digital Transformation",
      subDomain: "Benefits and Challenges",
      options: [
        { text: "Improved customer experience", isCorrect: true, explanation: "Digital transformation enables better, more personalized customer experiences." },
        { text: "Increased operational efficiency", isCorrect: true, explanation: "Automation and optimization lead to more efficient operations." },
        { text: "Enhanced data-driven decision making", isCorrect: true, explanation: "Digital tools provide better insights for decision making." },
        { text: "Reduced need for skilled workers", isCorrect: false, explanation: "Digital transformation typically requires more skilled workers, not fewer." },
        { text: "Elimination of all business risks", isCorrect: false, explanation: "Digital transformation introduces new risks while mitigating others." }
      ],
      correctAnswers: ["Improved customer experience", "Increased operational efficiency", "Enhanced data-driven decision making"],
      explanation: "Digital transformation primarily benefits organizations through improved customer experiences, operational efficiency, and better decision-making capabilities."
    },
    {
      questionText: "Which Google Cloud service is best for hosting a containerized application that needs to scale automatically?",
      questionType: "SINGLE_SELECT" as const,
      difficulty: "MEDIUM" as const,
      domain: "Google Cloud Platform",
      subDomain: "Compute Services",
      options: [
        { text: "Google Kubernetes Engine (GKE)", isCorrect: true, explanation: "GKE provides managed Kubernetes with automatic scaling for containerized applications." },
        { text: "Compute Engine", isCorrect: false, explanation: "Compute Engine provides VMs but requires manual container orchestration." },
        { text: "App Engine", isCorrect: false, explanation: "App Engine is for applications, not specifically for containers." },
        { text: "Cloud Functions", isCorrect: false, explanation: "Cloud Functions is for event-driven functions, not long-running containerized apps." }
      ],
      correctAnswers: ["Google Kubernetes Engine (GKE)"],
      explanation: "GKE is Google's managed Kubernetes service that automatically handles scaling, management, and orchestration of containerized applications."
    },
    {
      questionText: "What is the primary characteristic of serverless computing?",
      questionType: "SINGLE_SELECT" as const,
      difficulty: "EASY" as const,
      domain: "Cloud Computing Concepts",
      subDomain: "Serverless Computing",
      options: [
        { text: "No server management required", isCorrect: true, explanation: "Serverless means the cloud provider manages all server infrastructure automatically." },
        { text: "No servers are used", isCorrect: false, explanation: "Servers are still used, but they're completely managed by the provider." },
        { text: "Free to use", isCorrect: false, explanation: "Serverless services still have costs based on usage." },
        { text: "Only works for small applications", isCorrect: false, explanation: "Serverless can handle applications of various sizes." }
      ],
      correctAnswers: ["No server management required"],
      explanation: "The key characteristic of serverless computing is that developers don't need to manage servers - the cloud provider handles all infrastructure management."
    },
    {
      questionText: "Which Google Cloud storage service is best for frequently accessed data that needs global availability?",
      questionType: "SINGLE_SELECT" as const,
      difficulty: "MEDIUM" as const,
      domain: "Google Cloud Platform",
      subDomain: "Storage Services",
      options: [
        { text: "Cloud Storage Standard class", isCorrect: true, explanation: "Standard class provides high availability and performance for frequently accessed data." },
        { text: "Cloud Storage Nearline", isCorrect: false, explanation: "Nearline is for data accessed about once per month." },
        { text: "Cloud Storage Coldline", isCorrect: false, explanation: "Coldline is for data accessed about once per quarter." },
        { text: "Cloud Storage Archive", isCorrect: false, explanation: "Archive is for long-term storage with very infrequent access." }
      ],
      correctAnswers: ["Cloud Storage Standard class"],
      explanation: "Cloud Storage Standard class is designed for frequently accessed data with global availability and high performance."
    },
    {
      questionText: "What is a key advantage of using managed services in Google Cloud?",
      questionType: "SINGLE_SELECT" as const,
      difficulty: "EASY" as const,
      domain: "Cloud Computing Concepts",
      subDomain: "Managed Services",
      options: [
        { text: "Reduced operational overhead", isCorrect: true, explanation: "Managed services handle infrastructure management, reducing operational tasks." },
        { text: "Complete control over underlying infrastructure", isCorrect: false, explanation: "Managed services abstract away infrastructure control." },
        { text: "Always cheaper than self-managed solutions", isCorrect: false, explanation: "Cost depends on usage patterns and requirements." },
        { text: "Guaranteed 100% uptime", isCorrect: false, explanation: "While highly available, no service guarantees 100% uptime." }
      ],
      correctAnswers: ["Reduced operational overhead"],
      explanation: "The primary advantage of managed services is that Google Cloud handles the infrastructure management, reducing operational overhead for customers."
    },
    {
      questionText: "Which of the following are examples of Infrastructure as a Service (IaaS)? (Choose two.)",
      questionType: "MULTIPLE_SELECT" as const,
      difficulty: "MEDIUM" as const,
      domain: "Cloud Computing Concepts",
      subDomain: "Service Models",
      options: [
        { text: "Compute Engine", isCorrect: true, explanation: "Compute Engine provides virtual machines, which is IaaS." },
        { text: "Cloud Storage", isCorrect: true, explanation: "Cloud Storage provides infrastructure-level storage services." },
        { text: "App Engine", isCorrect: false, explanation: "App Engine is Platform as a Service (PaaS)." },
        { text: "Gmail", isCorrect: false, explanation: "Gmail is Software as a Service (SaaS)." }
      ],
      correctAnswers: ["Compute Engine", "Cloud Storage"],
      explanation: "IaaS provides basic infrastructure components like virtual machines (Compute Engine) and storage (Cloud Storage) that customers can use to build their own platforms and applications."
    }
  ];

  // Add questions to the certification
  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        questionText: q.questionText,
        questionType: q.questionType,
        difficulty: q.difficulty,
        domain: q.domain,
        subDomain: q.subDomain,
        explanation: q.explanation,
        certificationId: certification.id,
        options: {
          create: q.options.map((option, index) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            explanation: option.explanation,
            order: index + 1
          }))
        }
      },
      include: {
        options: true
      }
    });
    console.log(`✅ Added question: ${q.questionText.substring(0, 50)}...`);
  }

  console.log('🎉 GCP Cloud Digital Leader certification seeded with real content!');
}

if (require.main === module) {
  seedGCPCloudDigitalLeader()
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