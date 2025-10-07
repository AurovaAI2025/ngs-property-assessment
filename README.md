# NGS Property Readiness Assessment Platform

A comprehensive **Property Readiness Assessment Platform** built for NGS Security, designed to evaluate security and cleaning standards across PBSA (Purpose Built Student Accommodation) and BTR (Build-to-Rent) properties.

![NGS Security](https://images.squarespace-cdn.com/content/v1/63a061087c044706137df0b8/b08f0a7c-3dca-4e5c-ab8c-d9a4e4819a1e/NGS+Logo__White.png?format=1500w)

## 🎯 Overview

This platform enables property managers, accommodation providers, and decision-makers to:
- **Evaluate property security** through a comprehensive 24-question assessment
- **Assess cleaning & facilities standards** with structured scoring
- **Receive dual readiness scores** (Security & Cleaning) with detailed analysis
- **Get tailored recommendations** for improvement across all categories
- **Book consultations** directly with NGS Security specialists

## ✨ Features

### 🔒 **Dual Scoring System**
- **Security Readiness Score** (0-100%) - Comprehensive security evaluation
- **Cleaning Standards Score** (0-100%) - Facilities and maintenance assessment
- **Risk Level Classification** - Low, Medium, High ratings with specific guidance

### 📊 **Category-Based Analysis**
- **Security Staffing & Response** - SIA-licensed staff, coverage, procedures
- **Access Control** - Permission management, systems, visitor handling  
- **Technology & Monitoring** - CCTV, detection systems, blind spot management
- **Resident Experience** - Communication, confidence, reporting channels
- **Cleaning & Facilities** - Standards, rotas, monitoring, feedback

### 🎨 **Professional UI/UX**
- **NGS Security Branding** - Consistent colors, fonts, and styling
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Interactive Assessment Flow** - Progress tracking and navigation
- **Dynamic Results Display** - Real-time analysis and recommendations

### 🔧 **Admin Dashboard**
- **Real-time Metrics** - Completion rates, user statistics, trends
- **Assessment Analytics** - Score distributions, risk level analysis
- **Response Management** - Detailed view of all user responses
- **Consultation Tracking** - Booking management and status updates

## 🚀 Tech Stack

### **Frontend**
- **React 18** with **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Recharts** for data visualization

### **Backend & Database**
- **Supabase** (PostgreSQL) for database and real-time features
- **Row Level Security** for data protection
- **UUID-based** primary keys for security
- **Automated scoring** and risk level calculation

### **Infrastructure**
- **Environment-based** configuration
- **HTTPS/SSL** ready
- **Database migrations** included
- **Production-ready** deployment setup

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── base/            # Core components (Charts, Modals)
│   └── TestConnection/  # Database connectivity testing
├── data/                # Assessment questions and configuration
├── lib/                 # Core business logic
│   ├── database.ts      # Supabase operations
│   ├── riskAnalysis.ts  # Scoring and analysis algorithms
│   └── supabase.ts      # Database client setup
├── pages/               # Page components
│   ├── home/            # Landing page with assessment start
│   ├── assessment/      # 24-question assessment flow
│   ├── results/         # Dynamic results with dual scores
│   └── admin/           # Administrative dashboard
└── styles/              # Global styles and Tailwind config

database/
├── schema.sql           # Complete database schema
└── migrations/          # Database update scripts
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account and project
- Git for version control

### **1. Clone & Install**
```bash
git clone https://github.com/AurovaAI2025/ngs-property-assessment.git
cd ngs-property-assessment
npm install
```

### **2. Environment Configuration**
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **3. Database Setup**
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Configure Row Level Security policies
4. Test the connection

### **4. Development**
```bash
npm run dev
```
Access at `http://localhost:3000`

### **5. Production Build**
```bash
npm run build
npm run preview
```

## 📊 Assessment Scoring System

### **Question Categories & Weights**
- **Security Staffing & Response** (30%) - Q1-5
- **Access Control** (25%) - Q6-8  
- **Technology & Monitoring** (25%) - Q9-12
- **Resident Experience & Safety Culture** (20%) - Q13-17
- **Cleaning & Facilities Standards** (100% of cleaning score) - Q18-21

### **Scoring Algorithm**
- **0-3 points** per question based on answer quality
- **Weighted scoring** within categories
- **Category-level** risk assessment
- **Overall dual scores** (Security + Cleaning)
- **Risk thresholds**: Low (71-100%), Medium (41-70%), High (0-40%)

### **Smart Features**
- **Critical factor questions** that can override category scores
- **Reverse scoring** for negative indicators (complaints)
- **Zero-weight categories** for planning/feedback questions
- **Detailed recommendations** based on specific answers

## 🔐 Admin Access

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**Admin Features:**
- View all assessment completions
- Analyze response patterns and trends
- Export consultation bookings
- Monitor platform usage metrics
- Access detailed user response data

## 🎯 Usage Examples

### **Property Manager Workflow**
1. **Start Assessment** - Enter property details
2. **Complete Questions** - 24 comprehensive questions (3-5 minutes)
3. **Receive Analysis** - Dual scores with category breakdown
4. **Review Recommendations** - Tailored improvement suggestions
5. **Book Consultation** - Direct scheduling with NGS Security

### **Admin Monitoring**
1. **Dashboard Overview** - Key metrics and trends
2. **Response Analysis** - Detailed assessment breakdowns
3. **Risk Identification** - Properties flagged for attention
4. **Consultation Management** - Track booking pipeline

## 🤝 Contributing

This is a proprietary project for NGS Security. For development questions or feature requests, contact the development team.

## 📄 License

© 2024 NGS Security. All rights reserved.

## 🆘 Support

For technical support or questions about the assessment platform:
- **Email**: admin@ngssecurity.co.uk
- **Platform Issues**: Check admin dashboard or contact development team

---

**Built with ❤️ for NGS Security - Protecting Properties, Empowering Residents**