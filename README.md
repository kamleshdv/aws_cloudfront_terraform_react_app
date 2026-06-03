# React App with AWS S3 and CloudFront Deployment

This is a React application template built with Vite that includes automated deployment to AWS S3 and CloudFront using GitHub Actions. Purpose is for fast deployment changes to live environment while being cheaper alternative to other hosts.

## Why Use This React Template

This template significantly reduces the time and effort required to set up a production-ready React application with automated cloud deployment.

### Time Savings Breakdown

Traditional Manual Setup (2-4 hours):
- React/Vite project setup: 15 mins
- TypeScript configuration: 15 mins
- AWS S3 bucket setup: 15 mins
- CloudFront configuration: 15 mins
- IAM roles and policies: 15 mins
- GitHub Actions setup: 30 mins
- Deployment pipeline testing: 15 mins
- Custom domain & SSL setup: 30 mins
- Documentation writing: 30 mins
- Issue troubleshooting: 30 mins

Using This Template (30-45 mins):
1. Initial setup: 5 mins
   - Template cloning
   - Dependencies installation
   - Initial testing
2. AWS Setup: 15-20 mins
   - S3 bucket creation
   - CloudFront setup
   - IAM user configuration
3. GitHub Setup: 5-10 mins
   - Repository secrets
   - Test deployment
4. Custom Domain (optional): 5-10 mins
   - SSL certificate
   - DNS configuration

**Total Time Saved: 1.5-3 hours per project**

## Getting Started

### Option 1: Use as Template (Recommended)
1. Click the "Use this template" button on GitHub
2. Create a new repository from this template
3. Clone your new repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Option 2: Manual Setup
1. Clone this repository:
```bash
git clone https://github.com/original-repo/aws-github-react-app.git
cd aws-github-react-app
```
2. Remove the existing Git history and initialize a new repository:
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```
3. Create a new repository on GitHub and add it as remote:
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### Next Steps
1. Follow the [AWS Setup](#aws-setup) instructions to create your infrastructure
2. Add the required [GitHub Secrets](#github-actions-setup) to your repository
3. Update this README with your project-specific information
4. Push your changes to trigger the automatic deployment

## Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn
- AWS Account
- GitHub Account

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

3. Build for production:
```bash
npm run build
```

## AWS Setup

### S3 Bucket Setup

1. Create a new S3 bucket:
   - Go to AWS S3 Console
   - Click "Create bucket"
   - Choose a globally unique name (e.g., `your-app-name`)
   - Select your preferred region
   - Uncheck "Block all public access" and acknowledge the warning
   - Enable "Static website hosting" in the bucket properties
   - Set the index document to `index.html`
   - Set the error document to `index.html` (for SPA routing)

2. Configure bucket policy:
   - Go to the bucket's "Permissions" tab
   - Add the following bucket policy (replace `your-bucket-name`):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

### CloudFront Setup

1. Create a CloudFront distribution:
   - Go to AWS CloudFront Console
   - Click "Create distribution"
   - Select your S3 bucket as the origin
   - Configure the following settings:
     - Origin access: "S3 bucket access"
     - Viewer protocol policy: "Redirect HTTP to HTTPS"
     - Cache policy: "CachingOptimized"
     - Default root object: `index.html`
   - Create the distribution

2. Configure error pages:
   - In your CloudFront distribution settings
   - Go to "Error pages" tab
   - Create custom error responses for:
     - 403: Forbidden
     - 404: Not Found
     - Redirect to `index.html` with 200 status code

3. Accessing your website:
   - After deployment, your site will be available at your CloudFront URL
   - Find the URL in the CloudFront Console under the "Distribution domain name" column
   - Format: `https://dxxxxxxxx.cloudfront.net`

### Custom Domain Setup

1. Prerequisites:
   - A registered domain name
   - Access to your domain's DNS settings
   - An SSL certificate (free with AWS Certificate Manager)

2. Create SSL Certificate:
   - Go to AWS Certificate Manager
   - Click "Request certificate"
   - Choose "Request a public certificate"
   - Enter your domain name (e.g., `example.com`)
   - Add a wildcard subdomain (e.g., `*.example.com`)
   - Choose DNS validation
   - Add the provided CNAME records to your DNS settings
   - Wait for validation (can take up to 30 minutes)

3. Update CloudFront Distribution:
   - Go to your CloudFront distribution
   - Click "Edit"
   - Under "Settings" > "Alternate domain names (CNAMEs)", add your domain
   - Under "Custom SSL certificate", select your validated certificate
   - Save changes

4. Configure DNS:
   - Go to your domain registrar or DNS provider
   - Add a CNAME record:
     ```
     Name: www (or @ for root domain)
     Value: Your CloudFront distribution domain (dxxxxxxxx.cloudfront.net)
     TTL: 300 (or recommended value)
     ```
   - For root domain (example.com), create an A record alias pointing to your CloudFront distribution

Your website should now be accessible at both your custom domain and the CloudFront URL.

### IAM User Setup

You can set up the IAM user in one of two ways:

#### Option 1: Using AWS Managed Policies (Simpler but broader permissions)
1. Create a new IAM user with programmatic access
2. Attach the following AWS managed policies:
   - `AmazonS3FullAccess` (For S3 bucket operations)
   - `CloudFrontFullAccess` (For CloudFront invalidation)

#### Option 2: Using Custom Policy (More secure, following principle of least privilege)
1. Create a new IAM user:
   - Go to AWS IAM Console
   - Create a new user with programmatic access
   - Attach the following policy (replace `your-bucket-name` and `your-distribution-id`):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation"
            ],
            "Resource": "arn:aws:cloudfront::your-account-id:distribution/your-distribution-id"
        }
    ]
}
```

Both options will work for deploying your application. Option 1 is simpler but gives broader permissions, while Option 2 follows security best practices by limiting permissions to only what's needed.

## GitHub Actions Setup

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your IAM user access key
   - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `AWS_S3_BUCKET`: Your S3 bucket name
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

## Deployment

The application is automatically deployed to AWS S3 and CloudFront when changes are pushed to the main branch. The deployment process:

1. Builds the React application using Vite
2. Uploads the build files to S3
3. Invalidates the CloudFront cache

## Project Structure

```
├── src/               # Source files
├── public/            # Static files
├── .github/           # GitHub Actions workflows
├── index.html         # Entry HTML file
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```
