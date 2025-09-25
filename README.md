# Borse Web API

A modern Node.js web API built with TypeScript, Express, Prisma, and PostgreSQL. This project includes complete CI/CD pipeline with Jenkins, Docker, and Kubernetes deployment.

## 🚀 Features

- **TypeScript**: Fully typed Node.js application
- **Express.js**: Fast and minimalist web framework
- **Prisma ORM**: Modern database toolkit with PostgreSQL
- **JWT Authentication**: Secure user authentication
- **Email Service**: Email notifications with Nodemailer
- **Redis Integration**: Caching and session management
- **Twilio SMS**: SMS notifications
- **Swagger Documentation**: API documentation with OpenAPI
- **Docker**: Containerized application
- **Kubernetes**: Scalable deployment
- **Jenkins CI/CD**: Automated build and deployment pipeline

## 📋 Prerequisites

- Node.js 20+
- Docker
- Kubernetes cluster
- Jenkins
- PostgreSQL database (Neon)
- Redis instance

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd borse_web_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://..."
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

4. **Database setup**
   ```bash
   npm run prisma:generate
   npx prisma migrate dev
   ```

5. **Start development server**
   ```bash
   npm run develop
   ```

### Production Build

```bash
npm run build
npm run start
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t dmrkrn/borse-web-api:latest .
```

### Run Container

```bash
docker run --env-file .env -p 4000:4000 dmrkrn/borse-web-api:latest
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster running
- kubectl configured
- Docker image pushed to registry

### Deploy to Kubernetes

1. **Create environment secret**
   ```bash
   kubectl create secret generic borse-web-api-env --from-env-file=.env
   ```

2. **Apply Kubernetes manifests**
   ```bash
   kubectl apply -f kubernetes.yaml
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## 🔄 CI/CD Pipeline

### Jenkins Setup

1. **Jenkins Credentials**
   - `dockerhub-credentials`: Docker Hub username and password
   - `borse-web-api-env`: Environment variables as Secret File

2. **Pipeline Stages**
   - **Checkout**: Pull source code from GitHub
   - **Docker Build**: Build Docker image
   - **Docker Push**: Push image to Docker Hub
   - **K8s Secret Update**: Update Kubernetes secrets
   - **Deploy**: Deploy to Kubernetes cluster

### Automated Deployment

The Jenkins pipeline automatically:
- Builds Docker image from source code
- Pushes image to Docker Hub
- Updates Kubernetes secrets with environment variables
- Deploys the application to Kubernetes cluster
- Scales the application with 2 replicas for high availability

## 📝 API Documentation

API documentation is available via Swagger UI at:
```
http://localhost:4000/api-docs
```

## 🗂️ Project Structure

```
borse_web_api/
├── src/
│   ├── controllers/      # API controllers
│   ├── routes/          # Express routes
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
├── prisma/              # Database schema and migrations
├── dist/                # Compiled JavaScript files
├── Dockerfile           # Docker configuration
├── Jenkinsfile          # CI/CD pipeline
├── kubernetes.yaml      # Kubernetes deployment
└── openapi.yaml         # API documentation
```

## 📚 Available Scripts

- `npm run develop` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run seed` - Seed database with initial data

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | JWT token secret | Yes |
| EMAIL_HOST | SMTP server host | Yes |
| EMAIL_USER | Email username | Yes |
| EMAIL_PASS | Email password | Yes |
| REDIS_HOST | Redis server host | Yes |
| REDIS_PASSWORD | Redis password | Yes |
| TWILIO_ACCOUNT_SID | Twilio account SID | Yes |
| TWILIO_AUTH_TOKEN | Twilio auth token | Yes |
| TWILIO_PHONE_NUMBER | Twilio phone number | Yes |

## 🚀 Deployment Architecture

```
GitHub Repository
       ↓
Jenkins Pipeline
       ↓
Docker Hub Registry
       ↓
Kubernetes Cluster
       ↓
Running Application
```

### Infrastructure Components

- **GitHub**: Source code repository
- **Jenkins**: CI/CD automation server
- **Docker Hub**: Container image registry
- **Kubernetes**: Container orchestration platform
- **Neon**: Managed PostgreSQL database
- **Redis Cloud**: Managed Redis cache

## 🔒 Security

- Environment variables stored as Kubernetes secrets
- JWT-based authentication
- Docker image scanning
- Secure database connections with SSL
- Credentials managed through Jenkins

## 📊 Monitoring & Scaling

- **High Availability**: 2 replica pods for redundancy
- **Load Balancing**: Kubernetes service with LoadBalancer
- **Auto-restart**: Kubernetes automatically restarts failed pods
- **Scalability**: Easy horizontal scaling by adjusting replica count

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

For questions and support, please contact the development team.