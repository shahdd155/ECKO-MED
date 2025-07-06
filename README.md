# Eckomed - Healthcare Management System

A comprehensive healthcare management system built with Angular 19, featuring multi-role user management, patient data tracking, pharmacy integration, and modern UI/UX design.

## 🏥 Overview

Eckomed is a full-featured healthcare management platform that serves multiple user types including patients, data entry personnel, and pharmacy staff. The application provides a complete ecosystem for managing patient records, medical interactions, prescriptions, lab tests, and pharmacy requests.

## ✨ Features

### 🔐 Multi-Role Authentication System
- **Patient Portal**: Access medical records, prescriptions, lab tests, and visit history
- **Data Entry Portal**: Manage patient data, medical interactions, and department operations
- **Pharmacy Portal**: Handle prescription requests and medication management

### 👥 Patient Features
- **Dashboard**: Overview of medical activities and quick access to services
- **Medical Records**: View prescriptions, lab tests, and medical scans
- **Visit History**: Track all medical visits and interactions
- **Search Functionality**: Find clinics and pharmacies
- **Help Center**: Support system with ticket management
- **Profile Management**: Update personal information and preferences

### 📊 Data Entry Features
- **Patient Management**: Add and manage patient records
- **Medical Interactions**: Record lab tests, prescriptions, scans, and medical notes
- **Department Operations**: Manage department-specific workflows
- **Dashboard Analytics**: Overview of data entry activities
- **Patient Lookup**: Search and retrieve patient information

### 💊 Pharmacy Features
- **Request Management**: View and manage prescription requests
- **Medication Tracking**: Monitor prescription status and fulfillment
- **Help Center**: Pharmacy-specific support system

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tailwind CSS**: Modern styling with utility-first approach
- **Flowbite Components**: Professional UI components
- **FontAwesome Icons**: Rich iconography throughout the application
- **Loading States**: Smooth user experience with spinners and transitions

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 19
- **Styling**: Tailwind CSS + SCSS
- **UI Components**: Flowbite
- **Icons**: FontAwesome
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Authentication**: JWT with role-based access
- **Notifications**: ngx-toastr
- **Loading**: ngx-spinner
- **Charts**: ngx-charts
- **Server-Side Rendering**: Angular SSR

## 📁 Project Structure

```
eckomed/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── environment/          # Environment configuration
│   │   │   ├── guards/              # Route guards for authentication
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── services/            # Core services
│   │   │       ├── auth/            # Authentication service
│   │   │       ├── DataEntry/       # Data entry operations
│   │   │       ├── patient/         # Patient management
│   │   │       └── Pharmacy/        # Pharmacy operations
│   │   ├── layouts/                 # Layout components
│   │   │   ├── auth-layout/         # Authentication pages layout
│   │   │   ├── data-entry-layout/   # Data entry portal layout
│   │   │   ├── patient-layout/      # Patient portal layout
│   │   │   ├── pharmacy-layout/     # Pharmacy portal layout
│   │   │   ├── navbar/              # Navigation component
│   │   │   └── footer/              # Footer component
│   │   ├── models/                  # TypeScript interfaces
│   │   └── pages/                   # Application pages
│   │       ├── dataEntry/           # Data entry portal pages
│   │       ├── Patient/             # Patient portal pages
│   │       ├── Pharmacy/            # Pharmacy portal pages
│   │       ├── login/               # Authentication pages
│   │       └── shared/              # Shared components
│   ├── styles.scss                  # Global styles
│   └── main.ts                      # Application entry point
├── public/                          # Static assets
├── angular.json                     # Angular configuration
├── package.json                     # Dependencies and scripts
└── tailwind.config.js              # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Angular CLI (v19)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eckomed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `src/app/core/environment/environment.ts` with your API endpoints
   ```typescript
   export const environment = {
     baseUrl: 'http://localhost:5096',
     apiUrl: 'http://localhost:5096/api'
   };
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
# Build the application
npm run build

# Build with SSR
npm run build:ssr
```

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run serve:ssr:eckomed` - Serve SSR build

## 👤 User Roles & Access

### Patient Portal (`/login`)
- Access medical records and history
- View prescriptions and lab results
- Search for clinics and pharmacies
- Submit help tickets
- Manage profile information

### Data Entry Portal (`/dentrylogin`)
- Add new patients to the system
- Record medical interactions (lab tests, prescriptions, scans)
- Manage patient data and records
- Department-specific operations
- Dashboard analytics

### Pharmacy Portal (`/phlogin`)
- View prescription requests
- Manage medication fulfillment
- Track prescription status
- Pharmacy-specific help center

## 🔒 Authentication & Security

- JWT-based authentication
- Role-based access control (RBAC)
- Route guards for protected pages
- Secure HTTP interceptors
- Session management with localStorage

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional healthcare interface
- **Accessibility**: WCAG compliant design patterns
- **Loading States**: Smooth transitions and loading indicators
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Real-time validation with error messages
- **Mobile Navigation**: Collapsible sidebar for mobile devices

## 🔧 Configuration

### Environment Variables
Update the environment configuration in `src/app/core/environment/environment.ts`:

```typescript
export const environment = {
  baseUrl: 'your-api-base-url',
  apiUrl: 'your-api-endpoint'
};
```

### API Integration
The application expects a RESTful API with the following endpoints:
- Authentication endpoints
- Patient data management
- Medical records (lab tests, prescriptions, scans)
- Pharmacy request management
- Help center ticket system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the help center within the application
- Review the documentation
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with multi-role authentication and core features
- Patient portal with medical record management
- Data entry portal with patient interaction tools
- Pharmacy portal with request management
- Modern UI with Tailwind CSS and Flowbite

---

**Built with ❤️ for better healthcare management**