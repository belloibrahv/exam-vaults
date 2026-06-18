import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting advanced GCDL learning content seed...');

  const gcdlCert = await prisma.certification.findUnique({
    where: { code: 'CLOUD-DIGITAL-LEADER' },
  });

  if (!gcdlCert) {
    console.error('❌ GCDL certification not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Seeding advanced GCDL Learning Modules...');

  const modulesData = [
    // ============================================================
    // Module 5: Cloud Economics, Billing & Cost Optimization Deep Dive
    // ============================================================
    {
      title: 'Module 5: Cloud Economics, Billing & Cost Optimization',
      description: 'Deep dive into cloud financial management, pricing models, cost optimization strategies, and the FinOps lifecycle.',
      order: 5,
      lessons: [
        {
          title: 'Cloud Pricing Models and Total Cost of Ownership',
          slug: 'pricing-models-tco',
          order: 1,
          estimatedTime: 15,
          content: `
# Cloud Pricing Models and Total Cost of Ownership

## Google Cloud Pricing Philosophy

Google Cloud's pricing is built on a **pay-as-you-go model** with no upfront fees and no termination charges. This model directly supports organizational agility by aligning costs with actual consumption.

### Key Pricing Principles

**No Upfront Costs:** You can start using services without any initial investment. This removes a major barrier to innovation and experimentation.

**Per-Second Billing:** For compute resources like Compute Engine and Cloud Run, billing is metered per second (with a 1-minute minimum). This granularity ensures you only pay for exactly what you use, especially important for short-lived workloads.

**Sustained Use Discounts (SUD):** Automatic discounts applied when you run Compute Engine instances for a significant portion of a billing month. No commitment or upfront payment required.
- More than 25% of a month: automatic discount kicks in
- More than 50% of a month: discount increases
- More than 75% of a month: maximum discount applied
- Discounts are calculated per instance family and region

**Committed Use Discounts (CUD):** Deeper discounts (up to 70% for compute, up to 57% for some databases) in exchange for committing to a specific resource consumption level for 1 or 3 years.
- **Resource-based CUD:** Commit to spend a minimum amount on a specific service (e.g., $100/month on Compute Engine)
- **Flexible CUD:** Applies to a pool of machine series across multiple families
- Best for predictable, stable workloads with known resource requirements

---

## Total Cost of Ownership (TCO) Analysis

When comparing cloud to on-premises, a comprehensive TCO analysis must account for:

### Direct Costs Comparison

| Cost Category | On-Premises | Google Cloud |
|:---|---:|:---:|
| Server Hardware | $100,000+ upfront | $0 (included in usage fee) |
| Storage Hardware | $50,000+ upfront | $0 per GB-month metered |
| Networking Equipment | $20,000+ upfront | $0 (included) |
| Software Licenses | Annual upfront | Pay-as-you-go or included |
| Facilities (space, power, cooling) | Ongoing monthly | $0 |
| IT Staff Salaries | Ongoing monthly | Reduced ops overhead |
| **Total 3-Year Cost** | **$500,000+** | **$200,000-$350,000** |

### Hidden Costs in TCO

**Operational Friction Costs:**
- **Provisioning time:** Weeks or months on-premises vs. minutes in cloud
- **Idle capacity:** Servers running at 10-15% utilization "just in case"
- **Opportunity cost:** Revenue lost while waiting for infrastructure
- **Compliance overhead:** Manual auditing vs. automated compliance reporting

---

## Resource Hierarchy and Billing

### How Billing Flows Through the Hierarchy

\`\`\`
Organization (Billing Account)
  └── Folder (Department - Engineering)
       └── Project (Product A) ← Billing tracked here
            └── Resources (VMs, Buckets, etc.)
\`\`\`

- **Billing Account:** The top-level billing entity linked to a payment method
- **Projects:** All resource costs are billed at the project level
- **Billing Subaccounts:** Can be used to segment billing for different departments or teams
- **Labels:** Key-value metadata tags attached to resources for granular cost allocation

### Cost Management Tools

**Google Cloud Pricing Calculator:**
- Web-based tool for estimating costs before deployment
- Supports most Google Cloud services
- Allows you to model different configurations and discount scenarios

**Billing Reports:**
- Built-in dashboards showing cost trends
- Filterable by project, service, region, or label
- Exportable to BigQuery for custom analysis

**Budgets and Alerts:**
- Set budget amounts at the billing account or project level
- Configure alert thresholds (e.g., 50%, 90%, 100% of budget)
- Receive email notifications when thresholds are exceeded
- Programmatically trigger actions (e.g., Cloud Functions) via Pub/Sub

**Quotas:**
- Rate quotas: Limit API request rates per project (e.g., 1000 requests/second)
- Allocation quotas: Limit resource counts per project (e.g., 5 VCPUs)
- Serve as cost control mechanisms and guardrails against runaway spending
          `,
        },
        {
          title: 'FinOps Lifecycle and Cloud Financial Governance',
          slug: 'finops-lifecycle',
          order: 2,
          estimatedTime: 15,
          content: `
# FinOps Lifecycle and Cloud Financial Governance

## What is FinOps?

FinOps is an operational framework and cultural practice that combines financial management with cloud operations to help organizations maximize the business value of cloud computing. It brings together technology, business, and finance teams to make data-driven spending decisions.

### The Three Phases of FinOps

### Phase 1: Inform
Visibility and benchmarking to understand current spending.

**Key Activities:**
- **Cost allocation:** Tag resources with department, project, environment, and cost center labels
- **Budgeting and forecasting:** Use historical data to predict future spending
- **Measurement and benchmarking:** Compare costs against industry benchmarks and internal KPIs
- **Anomaly detection:** Identify unexpected cost spikes using AI-powered tools

### Phase 2: Optimize
Rightsizing, discount utilization, and workload optimization.

**Key Activities:**
- **Rightsizing:** Match resource capacity to actual workload requirements
- **Choosing the right pricing model:** On-Demand vs. CUD vs. Spot/Preemptible
- **Storage optimization:** Select appropriate storage classes based on access patterns
- **Architecture optimization:** Use serverless and managed services to reduce operational overhead

### Phase 3: Operate
Continuous improvement, governance, and cultural adoption.

**Key Activities:**
- **Automated governance:** Policy-as-code with Organization Policies
- **Unit economics:** Track cost per customer, per transaction, or per feature
- **Shared accountability:** Engineers are responsible for cost, not just finance teams
- **Continuous improvement:** Regular cost reviews and optimization sprints

---

## Cloud Financial Governance

### Organization Policies for Cost Control

Google Cloud Organization Policies allow administrators to set guardrails:

**Resource Location Restriction:**
\`\`\`
Constraint: constraints/gcp.resourceLocations
Effect: Allow only europe-west1, europe-west2
Purpose: Ensure data sovereignty and predictable egress costs
\`\`\`

**Resource Creation Restrictions:**
\`\`\`
Constraint: constraints/compute.restrictNonCompliantResourceCreation
Effect: Deny creation of expensive machine types
Purpose: Prevent accidental cost overruns
\`\`\`

### Labels as a Cost Management Tool

Labels are key-value pairs attached to resources. They are essential for:
- **Cost allocation:** \`department:engineering\`, \`environment:production\`
- **Chargeback:** \`cost-center:cc-1234\`, \`project:project-alpha\`
- **Automation:** \`auto-shutdown:true\`, \`backup-schedule:daily\`

---

## Discount Strategies Comparison

| Strategy | Savings | Commitment | Best For |
|:---|---:|---:|:---|
| Sustained Use Discounts | Up to 30% | None (automatic) | Variable workloads |
| Committed Use Discounts (1-year) | Up to 57% | 1-year commitment | Stable, predictable workloads |
| Committed Use Discounts (3-year) | Up to 70% | 3-year commitment | Long-term stable workloads |
| Preemptible/Spot VMs | Up to 91% | None (can be terminated) | Fault-tolerant batch workloads |

---

## Cloud Carbon Footprint

Google Cloud provides a **Carbon Footprint** dashboard that shows the gross carbon emissions associated with your Google Cloud usage. This helps organizations:
- Track progress toward sustainability goals
- Report emissions in sustainability disclosures
- Identify opportunities to reduce environmental impact
- Choose lower-carbon regions for workload deployment
          `,
        },
      ],
    },

    // ============================================================
    // Module 6: Data-Driven Transformation with Google Cloud
    // ============================================================
    {
      title: 'Module 6: Data-Driven Transformation with Google Cloud',
      description: 'In-depth coverage of data lifecycle management, analytics pipelines, AI/ML integration, and data governance strategies.',
      order: 6,
      lessons: [
        {
          title: 'Data Lifecycle, Governance and Data Management',
          slug: 'data-lifecycle-governance',
          order: 1,
          estimatedTime: 15,
          content: `
# Data Lifecycle, Governance and Data Management

## The Data Value Chain

Modern organizations generate massive amounts of data. The key is to transform this raw data into actionable insights through a structured data value chain:

\`\`\`
Data Generation → Ingestion → Storage → Processing → Analysis → Visualization → Action
   (Sources)   (Pub/Sub)  (Storage)  (Dataflow) (BigQuery)  (Looker)   (Decision)
\`\`\`

### Data Types and Their Storage Solutions

**Structured Data (Relational):**
- Rows and columns with defined schemas
- Best stored in Cloud SQL (regional) or Cloud Spanner (global)
- Ideal for transactional applications (OLTP)

**Semi-Structured Data:**
- JSON, XML, Avro, Parquet files
- Best stored in BigQuery (native support for nested/repeated fields)
- Firestore for document-style NoSQL

**Unstructured Data:**
- Images, videos, audio files, documents
- Best stored in Cloud Storage (object storage)
- Processed using AI APIs (Vision, Video, Speech-to-Text)

**Time-Series Data:**
- IoT sensor readings, financial tick data, metrics
- Best stored in Bigtable or BigQuery
- Optimized for high write throughput and low-latency reads

---

## Data Governance Best Practices

### Data Classification

Organizations should classify data based on sensitivity:

| Classification | Examples | Controls Required |
|:---|---:|:---|
| Public | Marketing materials, public docs | Basic access controls |
| Internal | Email, internal policies | IAM, access logging |
| Confidential | Customer data, financial reports | Encryption, audit logging |
| Restricted | PII, PHI, trade secrets | CMEK, VPC-SC, DLP |

### Data Loss Prevention (DLP)

Cloud DLP helps discover, classify, and protect sensitive data:
- **Inspection:** Scan data for sensitive patterns (SSN, credit card, PII)
- **Redaction:** Automatically redact sensitive information
- **De-identification:** Mask, tokenize, or pseudonymize data
- **Integration:** Works with Cloud Storage, BigQuery, and Dataflow

### Data Retention and Lifecycle Management

**Cloud Storage Lifecycle Rules:**
\`\`\`
Day 0-30: Standard storage (frequent access)
Day 31-90: Nearline storage (monthly access)
Day 91-365: Coldline storage (quarterly access)
Day 366+: Archive storage (yearly access)
Day 730+: Delete (retention policy enforced)
\`\`\`

**BigQuery Time Travel and Snapshots:**
- **Time Travel:** Query data as it was up to 7 days ago
- **Snapshots:** Create permanent read-only copies of tables at specific points in time

---

## Data Integration Patterns

**Batch Processing:**
- Dataflow batch pipelines for large-scale scheduled processing
- Cloud Composer for workflow orchestration and scheduling
- BigQuery data transfer service for automated data loading

**Stream Processing:**
- Pub/Sub for real-time event ingestion
- Dataflow streaming for continuous processing
- BigQuery streaming inserts for real-time analytics

**Migration:**
- Storage Transfer Service for bulk data migration from other clouds or on-premises
- Database Migration Service for minimal-downtime database migrations
- Transfer Appliance for petabyte-scale physical data transfer
          `,
        },
        {
          title: 'AI/ML Strategy, Pre-trained APIs and Responsible AI',
          slug: 'ai-ml-strategy',
          order: 2,
          estimatedTime: 15,
          content: `
# AI/ML Strategy, Pre-trained APIs and Responsible AI

## The AI Hierarchy of Needs

Before implementing AI/ML, organizations must have a solid data foundation:

\`\`\`
Level 5: AI/ML (Predictions, Recommendations)
Level 4: Analytics (Dashboards, Insights)
Level 3: Data Warehouse (Clean, Structured Data)
Level 2: Data Pipeline (ETL/ELT)
Level 1: Data Collection (Raw Data)
\`\`\`

Each level depends on the one below. Jumping to AI/ML without proper data infrastructure will fail.

---

## Google Cloud AI/ML Product Portfolio

### Pre-trained AI APIs (No ML expertise needed)

These APIs provide immediate AI capabilities through simple API calls:

**Vision API:**
- Label detection, OCR, face detection, safe search
- Use cases: Document processing, product cataloging, content moderation

**Natural Language API:**
- Entity extraction, sentiment analysis, content classification
- Use cases: Customer feedback analysis, email routing

**Translation API:**
- Dynamic text translation across 100+ languages
- Use cases: Multilingual customer support, content localization

**Speech-to-Text API:**
- Converts audio to text in 125+ languages
- Use cases: Call center transcription, voice commands

**Text-to-Speech API:**
- Converts text to natural-sounding speech using WaveNet
- Use cases: Voice assistants, accessibility features

**Video Intelligence API:**
- Shot detection, object tracking, explicit content detection
- Use cases: Video cataloging, content moderation

### AutoML (Minimal ML expertise needed)

AutoML allows developers to train custom ML models by uploading labeled data:
- **AutoML Vision:** Custom image classification and object detection
- **AutoML Natural Language:** Custom entity extraction and sentiment
- **AutoML Translation:** Custom translation models for domain-specific language
- **AutoML Tables:** Tabular data predictions using neural networks

### Vertex AI (For ML Engineers and Data Scientists)

Vertex AI is a unified ML platform covering the entire ML lifecycle:
- **Vertex AI Workbench:** Notebook-based development environment
- **Vertex AI Training:** Distributed training for custom models
- **Vertex AI Prediction:** Model serving and deployment
- **Vertex AI Pipelines:** ML pipeline orchestration
- **Vertex AI Model Garden:** Access to foundation models including Gemini
- **Vertex AI Search and Conversation:** Enterprise search and conversational AI

---

## Generative AI and Gemini

### What is Generative AI?
Generative AI creates new content (text, images, code, audio) based on patterns learned from training data. Unlike traditional ML that classifies or predicts, generative AI produces novel outputs.

### Gemini Models
Gemini is Google's most capable AI model family:

**Gemini Ultra:** Largest model for highly complex tasks
- Use case: Advanced reasoning, multi-modal analysis

**Gemini Pro:** Best for scaling across a wide range of tasks
- Use case: Text generation, summarization, code generation

**Gemini Nano:** Efficient on-device model
- Use case: Mobile and edge device inference

### Vertex AI Agent Builder
- Build conversational AI agents using natural language
- Ground responses in enterprise data
- Deploy across websites, apps, and messaging platforms

---

## Responsible AI Principles

Google Cloud's AI is built on seven responsible AI principles:

**1. Be socially beneficial:**
AI should bring broad benefits to individuals, organizations, and society.

**2. Avoid creating or reinforcing unfair bias:**
AI systems should be tested for and protected against unfair bias based on race, gender, age, etc.

**3. Be built and tested for safety:**
AI systems should undergo rigorous safety testing before deployment.

**4. Be accountable to people:**
AI systems should be designed to provide appropriate opportunities for feedback, explanations, and appeal.

**5. Incorporate privacy design principles:**
AI systems should incorporate privacy by default and by design.

**6. Uphold high standards of scientific excellence:**
AI development should be grounded in rigorous scientific methodology.

**7. Be made available for uses that accord with these principles:**
AI technologies should not be used for purposes that violate these principles.

### Responsible AI Implementation in Google Cloud

- **Explainable AI:** Tools to understand and interpret model predictions
- **Model Monitoring:** Detect training-serving skew, concept drift
- **Bias Detection:** Fairness indicators and model evaluation
- **Data Governance:** Control data used for training and inference
          `,
        },
      ],
    },

    // ============================================================
    // Module 7: Infrastructure Modernization Deep Dive
    // ============================================================
    {
      title: 'Module 7: Infrastructure Modernization and Migration',
      description: 'Comprehensive coverage of migration strategies, compute optimization, serverless adoption, and network architecture.',
      order: 7,
      lessons: [
        {
          title: 'Cloud Migration Strategies and Pathways',
          slug: 'migration-strategies',
          order: 1,
          estimatedTime: 15,
          content: `
# Cloud Migration Strategies and Pathways

## The 6 R's of Cloud Migration

When migrating workloads to Google Cloud, organizations choose from six primary strategies:

### 1. Rehost (Lift and Shift)
Move applications to the cloud with minimal changes.
- **Speed:** Fastest migration approach
- **Effort:** Low (minimal application changes)
- **Cloud Benefit:** Limited (mainly infrastructure cost savings)
- **GCP Tool:** Migrate for Compute Engine, Google Cloud Migrate
- **Best for:** Quick wins, datacenter lease expiry, compliance deadlines

### 2. Replatform (Lift, Tinker, and Shift)
Make minor cloud-optimized changes without changing core architecture.
- **Speed:** Fast
- **Effort:** Moderate
- **Cloud Benefit:** Moderate
- **Examples:** Moving from self-managed MySQL to Cloud SQL, using managed load balancers
- **Best for:** Databases, middleware components

### 3. Refactor (Re-architect)
Rebuild applications using cloud-native features.
- **Speed:** Slow
- **Effort:** High
- **Cloud Benefit:** Maximum (scalability, resilience, cost)
- **Examples:** Monolith to microservices, serverless adoption
- **Best for:** Applications needing improved agility and scalability

### 4. Rearchitect
Significantly modify application architecture to maximize cloud benefits.
- **Speed:** Slowest
- **Effort:** Highest
- **Cloud Benefit:** Transformational
- **Examples:** Moving from monolithic to event-driven architecture
- **Best for:** Strategic applications driving competitive advantage

### 5. Repurchase (Drop and Shop)
Replace existing application with a SaaS alternative.
- **Speed:** Fast
- **Effort:** Low to moderate
- **Cloud Benefit:** Variable
- **Examples:** Moving from custom CRM to Salesforce, on-premises email to Google Workspace
- **Best for:** Commodity applications, non-core business functions

### 6. Retire
Decommission applications that are no longer needed.
- **Speed:** Immediate cost savings
- **Effort:** Low
- **Benefit:** Eliminates maintenance overhead
- **Best for:** Zombie servers, unused applications

---

## Migration Assessment Framework

### Application Assessment Criteria

Before migrating, assess each application:

| Criterion | Questions to Ask |
|:---|---:|
| Business Criticality | Can we tolerate downtime during migration? |
| Technical Complexity | Does it have hard-coded IPs, legacy protocols? |
| Data Volume | How much data needs to be transferred? |
| Compliance Requirements | Are there data residency or regulatory constraints? |
| Dependencies | What other systems does it depend on? |
| Team Readiness | Does the team have cloud skills? |

### Migration Phases

**Phase 1: Assess**
- Discover and inventory all workloads
- Map dependencies between applications
- Assess technical feasibility and business priority

**Phase 2: Plan**
- Select migration strategy for each workload
- Create migration waves (group related applications)
- Design target architecture on Google Cloud
- Build proof of concept for complex migrations

**Phase 3: Migrate**
- Set up network connectivity (Cloud VPN, Interconnect)
- Migrate data (Storage Transfer Service, Transfer Appliance)
- Migrate workloads (Migrate for Compute Engine)
- Test and validate

**Phase 4: Optimize**
- Rightsize resources based on actual usage
- Implement cost optimization (CUDs, preemptible VMs)
- Modernize architecture (containers, serverless)
- Implement monitoring and alerting

---

## Modernization Pathways

### Database Modernization

\`\`\`
On-Premises → Replatform → Cloud SQL → Refactor → Cloud Spanner
Oracle/SQL Server    Managed MySQL/PG    Global Scale
\`\`\`

### Application Modernization

\`\`\`
Monolith → Replatform → Containers (GKE) → Refactor → Serverless (Cloud Run)
                      ↓                             ↓
                  Moderate benefit           Maximum agility
\`\`\`

### Storage Modernization

\`\`\`
NAS/SAN → Replatform → Filestore → Refactor → Cloud Storage + Bigtable
                      ↓                         ↓
                  File storage              Object + NoSQL
\`\`\`
          `,
        },
        {
          title: 'Compute Optimization and Serverless Architecture',
          slug: 'compute-serverless-architecture',
          order: 2,
          estimatedTime: 15,
          content: `
# Compute Optimization and Serverless Architecture

## Choosing the Right Compute Service

The choice of compute service depends on your control requirements vs. operational overhead:

### Compute Decision Matrix

| Requirement | Compute Engine | GKE | Cloud Run | App Engine | Cloud Functions |
|:---|---:|---:|---:|---:|---:|
| Full OS control | ✅ | ✅ | ❌ | ❌ | ❌ |
| Container support | ✅ | ✅ | ✅ | ✅ | ❌ |
| Serverless (no server mgmt) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Scales to zero | ❌ | ❌ | ✅ | ✅ | ✅ |
| Long-running processes | ✅ | ✅ | ✅ | ✅ | ❌ (9min max) |
| Custom domain | ✅ | ✅ | ✅ | ✅ | ❌ (via API GW) |
| Cold start < 100ms | ✅ | ✅ | ✅ | ❌ | ✅ |
| Max request timeout | None | None | 60min | 60min | 9min |

### Optimization Patterns

**Static Workloads (Predictable Load):**
- Use Compute Engine with Committed Use Discounts
- Combine with managed instance groups for auto-healing

**Variable Workloads (Unpredictable Traffic):**
- Use Cloud Run or App Engine for automatic scaling
- Pay only for resources consumed during request processing
- No capacity planning required

**Batch Workloads (Finite Duration):**
- Use preemptible VMs for fault-tolerant batch processing
- Up to 91% cost savings vs. standard VMs
- Configure graceful shutdown handling

---

## Containerization and Kubernetes Strategy

### When to Use Containers

Containers are ideal when you need:
- **Consistency:** Same environment across dev, test, and production
- **Isolation:** Dependencies packaged with the application
- **Fast startup:** Containers start in seconds, not minutes
- **Resource efficiency:** Higher density than VMs
- **Microservices:** Each service packaged independently

### GKE Autopilot vs. Standard

| Feature | Autopilot | Standard |
|:---|---:|---:|
| Node management | Fully managed by Google | Customer managed |
| Infrastructure optimization | Automatic | Manual configuration |
| Cost | Pay-per-pod | Pay-per-node |
| Control | Limited (no node access) | Full (SSH to nodes) |
| Best for | Teams wanting managed Kubernetes | Teams needing cluster control |

### When NOT to Use Containers

- **Single monolithic application** with no plans to decompose
- **GUI-heavy applications** requiring full desktop OS
- **Applications with extreme latency requirements** (adds minimal overhead)
- **Simple CRUD applications** where App Engine would suffice

---

## Serverless Adoption Strategy

### Serverless Maturity Model

**Level 1: Tactical**
- Move simple cron jobs to Cloud Scheduler + Cloud Functions
- Replace batch scripts with serverless data pipelines
- Quick wins with minimal refactoring

**Level 2: Strategic**
- Build new features as serverless services
- Adopt event-driven architecture with Pub/Sub
- Use Cloud Run for containerized serverless workloads

**Level 3: Transformational**
- Decompose monoliths into serverless microservices
- Implement full event-driven architecture
- Adopt infrastructure-as-code for all resources

### Event-Driven Architecture with Serverless

\`\`\`
[User Event] → [Pub/Sub] → [Cloud Functions] → [Process Data]
                                     ↓
                              [Cloud Storage]
                                     ↓
                              [Eventarc] → [Cloud Run]
                                     ↓
                              [BigQuery] → [Analysis]
\`\`\`

This architecture provides:
- **Loosely coupled components:** Services communicate via events
- **Independent scaling:** Each service scales based on its own demand
- **Fault isolation:** Failure in one service doesn't cascade
- **Polyglot programming:** Each service can use the best language
          `,
        },
      ],
    },

    // ============================================================
    // Module 8: Security, Compliance and Operations Mastery
    // ============================================================
    {
      title: 'Module 8: Security, Compliance and Operations',
      description: 'Advanced security concepts, compliance frameworks, incident response, and operational excellence with Google Cloud Operations Suite.',
      order: 8,
      lessons: [
        {
          title: 'Identity Security, Network Security and Defense in Depth',
          slug: 'identity-network-security',
          order: 1,
          estimatedTime: 15,
          content: `
# Identity Security, Network Security and Defense in Depth

## Defense in Depth Strategy

Security should be implemented in multiple layers. If one layer is breached, additional layers provide protection.

### The Seven Layers of Defense

**Layer 1: Data Security**
- Encryption at rest and in transit
- Data Loss Prevention (DLP)
- Secret Manager for credentials
- CMEK and CSEK for key control

**Layer 2: Application Security**
- Identity-Aware Proxy (IAP)
- Cloud Armor WAF rules
- Web Security Scanner
- API security best practices

**Layer 3: Compute Security**
- Shielded VMs (secure boot, vTPM, integrity monitoring)
- Confidential VMs (encrypted in-use memory)
- OS patch management
- Container scanning (Artifact Analysis)

**Layer 4: Network Security**
- VPC firewall rules
- Cloud NAT for outbound-only internet
- VPC Service Controls for data exfiltration prevention
- Private Google Access for on-premises connectivity

**Layer 5: Perimeter Security**
- Cloud Armor DDoS protection
- Cloud CDN with origin protection
- Cloud Interconnect for private connectivity
- Cloud VPN for encrypted tunnels

**Layer 6: Identity and Access Security**
- IAM with least privilege
- Organization policies
- Workload Identity Federation
- Service Account key rotation

**Layer 7: Physical Security**
- Google-managed data centers
- Multi-factor physical access controls
- 24/7 monitoring and surveillance
- Environmental controls (fire, power, cooling)

---

## Identity and Access Management (IAM) Deep Dive

### IAM Policy Evaluation Logic

\`\`\`
User Request → Check Organization Policy → Check IAM Policy → Allow/Deny
                                                  ↓
                                    Explicit Deny → Deny (wins)
                                    Explicit Allow → Allow
                                    No policy → Deny (implicit)
\`\`\`

**Key Rule:** An explicit deny always overrides an allow. If a user has an allow role at the project level but a deny at the organization level, the deny wins.

### Service Accounts Best Practices

**DO:**
- Create a separate service account for each application component
- Grant the minimum roles needed (principle of least privilege)
- Use IAM conditions to restrict service account usage
- Rotate service account keys regularly
- Use workload identity federation when possible

**DON'T:**
- Use the same service account for multiple unrelated applications
- Embed service account keys in application code
- Grant primitive roles (Owner/Editor/Viewer) to service accounts
- Share service account keys through insecure channels

### Workload Identity Federation

Instead of creating and managing service account keys, use Workload Identity Federation to allow workloads running outside Google Cloud to access Google Cloud resources:
- AWS workloads: Use AWS IAM roles
- Azure workloads: Use Azure AD managed identities
- On-premises: Use OIDC-compatible identity providers

---

## Network Security Controls

### Cloud Armor WAF Rules

Cloud Armor provides web application firewall capabilities:

**Pre-configured WAF Rules (OWASP Top 10):**
- SQL Injection (SQLi) prevention
- Cross-Site Scripting (XSS) prevention
- Local File Inclusion (LFI) protection
- Remote File Inclusion (RFI) protection
- Remote Code Execution (RCE) protection

**Custom Rules:**
- IP allowlist/blocklist
- Geographic region restrictions
- Request header inspection
- Rate limiting per IP

### VPC Service Controls

VPC Service Controls create security perimeters around Google Cloud managed services:

\`\`\`
Without VPC-SC:
[Internet] → [Cloud Storage] → Data accessible from anywhere

With VPC-SC:
[VPC Perimeter] → [Cloud Storage] → [BigQuery] → Data accessible only from authorized VPCs
\`\`\`

**Key Benefits:**
- Prevent data exfiltration from managed services
- Mitigate the risk of unauthorized access
- Support for on-premises access via Private Google Access
- No impact on performance or availability
          `,
        },
        {
          title: 'Compliance Frameworks, Incident Response and Operations Suite',
          slug: 'compliance-incident-operations',
          order: 2,
          estimatedTime: 15,
          content: `
# Compliance Frameworks, Incident Response and Operations Suite

## Compliance and Regulatory Frameworks

Google Cloud maintains compliance certifications for global, regional, and industry-specific standards:

### Global Standards
- **ISO 27001:** Information security management
- **ISO 27017:** Cloud security controls
- **ISO 27018:** PII protection in public clouds
- **SOC 1/2/3:** Service organization controls
- **FedRAMP:** US federal government standards
- **PCI DSS:** Payment card industry data security

### Regional Standards
- **GDPR:** European Union data protection
- **HIPAA:** US healthcare data privacy
- **LGPD:** Brazil data protection law
- **CCPA:** California consumer privacy act
- **Singapore MTCS:** Multi-tier cloud security

### Compliance Reports Manager
Google Cloud provides a Compliance Reports Manager where customers can access:
- Current compliance certifications and attestations
- Audit reports and SOC reports
- Statement of Applicability
- Third-party assessment documentation

---

## Shared Responsibility Model

### Responsibility Breakdown

| Control Category | Google Cloud Responsibility | Customer Responsibility |
|:---|---:|---:|
| Physical Security | ✅ Data centers, facilities | ❌ |
| Network Infrastructure | ✅ Hardware, fiber, routers | ❌ |
| Hypervisor/Virtualization | ✅ VM isolation | ❌ |
| Operating System (IaaS) | ❌ | ✅ Patching, hardening |
| Application Code (IaaS/PaaS) | ❌ | ✅ Secure coding, testing |
| Customer Data | ❌ | ✅ Classification, encryption |
| IAM Configuration | ❌ | ✅ Least privilege, MFA |
| Network Security (IaaS) | ❌ | ✅ Firewalls, NACLs |
| Network Security (PaaS/SaaS) | ✅ Managed services | ❌ |

**Key Insight:** The responsibility split depends on the service model (IaaS gives you more control but more responsibility; SaaS gives you less control but less responsibility).

---

## Incident Response and Business Continuity

### Incident Response Framework

**Preparation:**
- Create incident response playbooks
- Define severity levels (SEV1-SEV5)
- Establish communication channels
- Conduct regular tabletop exercises

**Detection:**
- Security Command Center for threat detection
- Cloud Monitoring for alerting
- Cloud Audit Logs for activity monitoring
- Event Threat Detection for real-time threat detection

**Containment:**
- IAM policy changes to revoke access
- VPC firewall rule changes
- Cloud Armor rules to block malicious traffic
- Resource isolation

**Eradication:**
- Remove compromised resources
- Rotate all credentials and keys
- Patch vulnerabilities
- Restore from clean backups

**Recovery:**
- Restore services from backup
- Verify data integrity
- Monitor for signs of re-infection
- Communicate restoration to stakeholders

### Disaster Recovery Strategies

| Strategy | RPO | RTO | Cost |
|:---|---:|---:|---:|
| Backup and Restore | Hours | Hours | $ |
| Pilot Light | Minutes | Hours | $$ |
| Warm Standby | Seconds | Minutes | $$$ |
| Multi-Region Active-Active | Near-zero | Near-zero | $$$$ |

---

## Google Cloud Operations Suite (Formerly Stackdriver)

### Monitoring and Alerting

**Cloud Monitoring:**
- Collects metrics, events, and metadata from Google Cloud and on-premises
- Built-in dashboards for common services
- Custom dashboards for application-specific metrics
- Alerting policies with notifications (email, SMS, Pub/Sub)
- Uptime checks for external endpoint monitoring

### Logging

**Cloud Logging:**
- Real-time log collection and analysis
- Log-based metrics for custom alerting
- Log exports to BigQuery, Cloud Storage, Pub/Sub
- Log views for access control
- 30-day default retention (configurable)

### Tracing and Debugging

**Cloud Trace:**
- Distributed tracing for request latency analysis
- Automatic trace collection from supported frameworks
- Trace sampling to manage volume and cost
- Integration with Cloud Monitoring for dashboards

**Cloud Profiler:**
- Continuous, low-overhead CPU and memory profiling
- Identifies performance bottlenecks in production code
- No code changes required (agents collect data)

### Error Reporting

**Cloud Error Reporting:**
- Real-time error aggregation and analysis
- Automatic grouping of similar errors
- Notifications when new error types appear
- Integration with Cloud Logging and notification channels
          `,
        },
      ],
    },

    // ============================================================
    // Module 9: Google Cloud Adoption Framework and Transformation
    // ============================================================
    {
      title: 'Module 9: Google Cloud Adoption Framework and Organizational Transformation',
      description: 'Strategic framework for cloud adoption, organizational change management, and building a cloud-first culture.',
      order: 9,
      lessons: [
        {
          title: 'Google Cloud Adoption Framework (GCAF)',
          slug: 'cloud-adoption-framework',
          order: 1,
          estimatedTime: 12,
          content: `
# Google Cloud Adoption Framework (GCAF)

## Introduction to GCAF

The Google Cloud Adoption Framework (GCAF) is a structured approach to help organizations plan and execute their cloud adoption journey. It provides a clear path from initial experimentation to full organizational transformation.

### The Four Themes of Cloud Maturity

GCAF organizes cloud adoption into four themes, each with multiple phases:

**1. Learn:** Build cloud skills and awareness
**2. Lead:** Establish cloud strategy and governance
**3. Scale:** Migrate and modernize workloads
**4. Optimize:** Continuously improve operations

---

## The Four Phases of Cloud Maturity

### Phase 1: Tactical (Trial)
**Characteristics:**
- Individual teams experimenting with cloud
- No centralized strategy or governance
- Manual processes and ad-hoc deployments
- Limited cloud skills within the organization

**Key Activities:**
- Set up first Google Cloud projects
- Enable teams to experiment with cloud services
- Run proof-of-concept projects
- Start building cloud skills (training, certifications)

**Success Metrics:**
- Number of active projects
- Number of trained team members
- First workload running in cloud

### Phase 2: Strategic (Foundation)
**Characteristics:**
- Central cloud team established (Cloud Center of Excellence)
- Basic governance and security controls in place
- First production workloads migrated
- Cost tracking and optimization beginning

**Key Activities:**
- Implement organization hierarchy and IAM
- Set up billing and cost management
- Create network and security baseline
- Define migration strategy and priorities
- Establish CI/CD pipeline for deployments

**Success Metrics:**
- Production workloads running in cloud
- Cost visibility and tracking
- Security baseline implemented

### Phase 3: Transformational (Scale)
**Characteristics:**
- Significant workloads migrated or modernized
- Automated deployments and infrastructure as code
- Cloud-native architecture adoption
- Advanced security and compliance automation

**Key Activities:**
- Migrate complex workloads
- Refactor applications for cloud-native patterns
- Implement advanced monitoring and operations
- Automate security and compliance controls
- Scale FinOps practices across the organization

**Success Metrics:**
- Percentage of workloads in cloud
- Deployment frequency and lead time
- Cost optimization savings achieved

### Phase 4: Optimized (Innovation)
**Characteristics:**
- Full cloud maturity achieved
- Data-driven decision making with AI/ML
- Continuous innovation and experimentation
- Industry-leading operational excellence

**Key Activities:**
- AI/ML integration across business processes
- Advanced analytics and data monetization
- Continuous architecture optimization
- Industry-specific solution innovation

**Success Metrics:**
- Business outcomes from cloud investment
- Innovation velocity
- Competitive advantage from cloud capabilities

---

## Building a Cloud Center of Excellence (CCoE)

### CCoE Team Structure

**Core Team:**
- Cloud Architect (technical vision and architecture)
- Cloud Platform Engineer (infrastructure and operations)
- Cloud Security Engineer (security and compliance)
- Cloud FinOps Lead (cost management and optimization)
- Cloud Adoption Lead (change management and training)

### CCoE Responsibilities

**Enablement:**
- Create self-service platforms and templates
- Provide training and documentation
- Build CI/CD pipelines and tooling

**Governance:**
- Define policies and guardrails
- Implement cost controls and budgets
- Enforce security and compliance standards

**Migration:**
- Prioritize and plan migration waves
- Provide migration tools and expertise
- Build repeatable migration patterns

**Innovation:**
- Identify opportunities for modernization
- Pilot new cloud services
- Share best practices and patterns
          `,
        },
        {
          title: 'Organizational Change Management and Operating Model',
          slug: 'change-management-operating-model',
          order: 2,
          estimatedTime: 12,
          content: `
# Organizational Change Management and Operating Model

## Why Change Management Matters

Cloud adoption is 80% organizational change and 20% technology. Organizations that focus only on technology fail to realize the full value of cloud. Successful cloud adoption requires:

**Cultural Shift:**
- From "no" to "how" (enabling mindset)
- From annual release cycles to continuous delivery
- From siloed teams to cross-functional collaboration
- From fear of failure to learn-from-failure

**Process Change:**
- From ticket-based procurement to self-service
- From manual reviews to automated guardrails
- From waterfall planning to agile delivery
- From centralized IT to platform teams

---

## The Cloud Operating Model

### Traditional IT Operating Model

\`\`\`
[Business Unit] → Request → [Central IT] → Weeks → [Infrastructure]
                                              ↓
                                        Manual provisioning
                                        Fixed capacity
                                        Quarterly release
\`\`\`

### Cloud Operating Model

\`\`\`
[Business Unit] → Self-Service → [Platform Team] → Minutes → [Cloud Infrastructure]
                              ↓                                       ↓
                        Guardrails & Policies                    Automated, elastic
                        Pre-approved templates                    Continuous delivery
\`\`\`

### Key Operating Model Principles

**Platform Teams:**
Internal platform teams build and maintain shared infrastructure, tools, and services that product teams consume. This enables self-service while maintaining governance.

**Golden Paths:**
Define recommended architecture patterns and deployment approaches. Teams can deviate (create "snowflakes") but must understand and accept the operational burden.

**Paved Roads:**
Pre-configured, approved infrastructure templates that meet security, compliance, and cost standards. Teams can provision approved resources in minutes.

---

## Skills and Training Strategy

### Cloud Skills Maturity Path

| Role | Foundation | Practitioner | Builder | Architect |
|:---|---:|---:|---:|---:|
| Executive | Cloud basics, value drivers | Cloud strategy, TCO, governance | Business case, transformation roadmap | Cloud-first innovation |
| Engineer | Core services | Infrastructure automation, CI/CD | Advanced architecture patterns | Multi-cloud, specialized services |
| Finance | Cloud pricing basics | Cost tracking, budgets | FinOps, cost optimization | Unit economics, forecasting |
| Security | Shared responsibility, IAM basics | Security controls, compliance | Security automation, threat detection | Security architecture, zero trust |

### Training Approaches

- **Hands-on labs:** Qwiklabs, Google Cloud Skills Boost
- **Certification paths:** Digital Leader → Associate → Professional
- **Community of practice:** Internal cloud user groups and knowledge sharing
- **Hackathons:** Regular innovation challenges
- **External training:** Google Cloud training partners, online courses

---

## Measuring Cloud Adoption Success

### Key Performance Indicators (KPIs)

**Technical KPIs:**
- Infrastructure deployment time (weeks → minutes)
- Application release frequency (quarterly → daily)
- Mean Time to Recover (MTTR) in hours
- Infrastructure utilization percentage
- Automation coverage percentage

**Financial KPIs:**
- Cost per transaction/customer
- Cloud spend as percentage of revenue
- Cost optimization savings
- Unit economics improvement
- Budget accuracy (actual vs. forecast)

**Business KPIs:**
- Time to market for new features
- Customer satisfaction scores
- Revenue from cloud-enabled capabilities
- Employee productivity and satisfaction
- Security incident reduction

### Transformation Maturity Scorecard

| Capability | Initial | Repeatable | Defined | Managed | Optimized |
|:---|---:|---:|---:|---:|---:|
| Cloud Strategy | No strategy | Basic strategy | Aligned with business | Measured outcomes | Continuous improvement |
| Governance | None | Basic policies | Automated guardrails | Proactive controls | Self-optimizing |
| Security | Ad hoc | Baselines defined | Automated | Continuous monitoring | Predictive threat detection |
| Cost Management | No visibility | Basic tracking | Cost allocation | FinOps practice | Automated optimization |
| Operations | Manual | Scripted | Automated | Self-healing | Autonomous |
| Skills | No cloud skills | Individual training | Team certifications | Organizational capability | Cloud-first culture |
          `,
        },
      ],
    },
  ];

  // Create modules and lessons
  for (const modData of modulesData) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `gcdl-advanced-mod-${modData.order}-${gcdlCert.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `gcdl-advanced-mod-${modData.order}-${gcdlCert.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: gcdlCert.id,
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

  console.log('✅ Advanced GCDL learning content seeded successfully:');
  console.log('   - Module 5: Cloud Economics, Billing & Cost Optimization (2 lessons)');
  console.log('   - Module 6: Data-Driven Transformation with Google Cloud (2 lessons)');
  console.log('   - Module 7: Infrastructure Modernization and Migration (2 lessons)');
  console.log('   - Module 8: Security, Compliance and Operations Mastery (2 lessons)');
  console.log('   - Module 9: GCAF and Organizational Transformation (2 lessons)');
  console.log('   Total: 5 modules, 10 new lessons added');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding advanced GCDL content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
