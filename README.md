# StyleAI - Virtual Wardrobe Assistant

A modern web application that helps you digitize your closet, discover new looks, and plan your outfits with the power of artificial intelligence.

## ✨ Features

- **Authentication System**: Secure sign-in and sign-up with JWT-based authentication
- **Digital Closet Management**: Add, edit, and organize your clothing items
- **AI-Powered Item Detection**: Upload photos and let AI automatically detect clothing details
- **Smart Outfit Suggestions**: Get personalized outfit recommendations for any occasion
- **Calendar Planning**: Plan your outfits for specific dates and events
- **User Profiles**: Manage your style preferences and wardrobe statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Recharts** for data visualization

### Backend
- **Spring Boot 3.2.0** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Maven** for dependency management
- **Gemini AI** integration for image analysis

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java 17+**
- **PostgreSQL** 12+
- **Maven** 3.6+
- **Gemini API Key** (for AI features)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd styleai-wardrobe
   ```

2. **Backend Environment Variables**
   
   Create `backend/.env` file:
   ```env
   # Database Configuration
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/styleai_wardrobe
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRATION=86400000
   
   # Gemini AI Configuration
   GEMINI_API_KEY=your-gemini-api-key-here
   
   # CORS Configuration
   CORS_ALLOWED_ORIGINS=http://localhost:9002,http://localhost:3000
   CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
   CORS_ALLOWED_HEADERS=*
   ```

3. **Frontend Environment Variables**
   
   Create `.env` file in the root:
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:8080/api
   
   # Other configuration
   VITE_APP_NAME=StyleAI
   ```

### Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE styleai_wardrobe;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE styleai_wardrobe TO postgres;
   ```

2. **Database tables will be created automatically** when you start the Spring Boot application.

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080/api`

2. **Start the Frontend**
   ```bash
   npm install
   npm run dev
   ```
   The application will be available at `http://localhost:9002`

## 🔐 Authentication

The application uses JWT-based authentication:

- **Sign Up**: Create a new account with email and password
- **Sign In**: Authenticate with existing credentials
- **Protected Routes**: All main features require authentication
- **Token Management**: JWT tokens are stored securely in localStorage

## 🤖 AI Features

### Smart Add Item Functionality

When adding new items to your closet, you have two options:

1. **Upload Photo**: 
   - Take or upload a photo of your clothing item
   - AI automatically detects clothing type, category, color, and season
   - Form fields are auto-filled with detected information
   - You can edit any auto-filled details before saving

2. **Manual Entry**:
   - Enter the item name manually
   - AI analyzes the text to suggest category, color, and season
   - AI generates a representative image for the item
   - You can adjust all suggestions as needed

### Outfit Suggestions

- Get AI-powered outfit recommendations based on your closet items
- Suggestions consider occasion, weather, and your style preferences
- Each suggestion includes reasoning for the outfit choice

## 📱 Key Pages

- **Home/Onboarding**: Landing page with sign-in/sign-up
- **My Closet**: View and manage your clothing items with filtering
- **Add Item**: Smart item addition with AI assistance
- **Outfit Suggestions**: AI-powered outfit recommendations
- **Calendar Planner**: Plan outfits for specific dates
- **Profile**: Manage your account and view wardrobe statistics

## 🔧 Development

### Project Structure

```
styleai-wardrobe/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and contexts
│   └── hooks/            # Custom React hooks
├── .env.example          # Frontend environment template
└── backend/.env.example  # Backend environment template
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in user

#### Closet Items
- `GET /api/closet-items` - Get all items (with filters)
- `POST /api/closet-items` - Create new item
- `PUT /api/closet-items/{id}` - Update item
- `DELETE /api/closet-items/{id}` - Delete item

#### AI Features
- `POST /api/ai-enhanced/analyze-clothing-image` - Analyze uploaded image
- `POST /api/ai-enhanced/generate-clothing-image` - Generate image from text
- `POST /api/ai-enhanced/analyze-text` - Analyze text for clothing details

#### Outfits & Events
- `GET /api/outfits` - Get all outfits
- `POST /api/outfits` - Create outfit
- `GET /api/planned-events` - Get planned events
- `POST /api/planned-events` - Create planned event

## 🔒 Security

- JWT tokens for stateless authentication
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Input validation on both frontend and backend
- Protected API endpoints requiring authentication

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use secure, production-ready values
2. **Database**: Configure production PostgreSQL instance
3. **JWT Secret**: Use a strong, randomly generated secret key
4. **HTTPS**: Enable SSL/TLS in production
5. **API Keys**: Secure your Gemini API key
6. **CORS**: Configure appropriate origins for production

### Build Commands

```bash
# Frontend build
npm run build

# Backend build
cd backend
mvn clean package
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Gemini AI** for image analysis and generation capabilities
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Spring Boot** for robust backend framework
- **React** ecosystem for modern frontend development