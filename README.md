# StyleAI - Virtual Wardrobe Assistant

A modern web application that helps you digitize your closet, discover new looks, and plan your outfits with the power of artificial intelligence.

## ✨ Features

- **Authentication System**: Secure sign-in and sign-up with JWT-based authentication
- **Enhanced User Profiles**: Profile pictures, location-based preferences
- **Digital Closet Management**: Add, edit, and organize your clothing items
- **AI-Powered Item Detection**: Upload photos and let AI automatically detect clothing details
- **Smart Outfit Suggestions**: Get personalized outfit recommendations based on weather, time of day, and occasion
- **Advanced Calendar Planning**: Plan outfits with time-of-day selection and weather considerations
- **Wear History Tracking**: Track when items were worn for better suggestions
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
- **Spring Data JPA** with PostgreSQL/H2
- **Maven** for dependency management
- **Gemini AI** integration for image analysis
- **OpenWeatherMap API** for weather data

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java 17+**
- **PostgreSQL** 12+ (for production) or H2 (for development)
- **Maven** 3.6+
- **Gemini API Key** (for AI features)
- **OpenWeatherMap API Key** (for weather-based suggestions)

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
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
   JWT_EXPIRATION=86400000
   
   # Gemini AI Configuration
   GEMINI_API_KEY=your-gemini-api-key-here
   
   # Weather API Configuration
   WEATHER_API_KEY=your-openweathermap-api-key-here
   
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
   
   # Weather API Key (for frontend weather display)
   VITE_WEATHER_API_KEY=your-openweathermap-api-key-here
   
   # Other configuration
   VITE_APP_NAME=StyleAI
   ```

### Development Setup (Quick Start)

For quick development setup, you can use the provided development configuration:

1. **Start the Backend (Development Mode)**
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   
   This uses H2 in-memory database and mock services, so no external dependencies are required.

2. **Start the Frontend**
   ```bash
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:9002` with:
- Mock weather data
- H2 in-memory database (data resets on restart)
- Mock AI services
- Development JWT tokens

### Production Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE styleai_wardrobe;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE styleai_wardrobe TO postgres;
   ```

2. **Database tables will be created automatically** when you start the Spring Boot application.

### Running the Application (Production Mode)

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

- **Sign Up**: Create a new account with email, password, profile picture, and location
- **Sign In**: Authenticate with existing credentials
- **Protected Routes**: All main features require authentication
- **Token Management**: JWT tokens are stored securely in localStorage

## 🌤️ Weather Integration

The application integrates with OpenWeatherMap API to provide weather-based outfit suggestions:

- **Real-time Weather**: Fetches current weather for user's location
- **Smart Suggestions**: AI considers temperature, conditions, and time of day
- **Fallback**: Mock weather data when API is unavailable

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

### Weather-Based Outfit Suggestions

- Get AI-powered outfit recommendations based on:
  - Your closet items
  - Current weather conditions
  - Time of day (Morning, Afternoon, Evening, Night)
  - Occasion and personal style preferences
- Each suggestion includes reasoning for the outfit choice

## 📅 Enhanced Calendar Planning

- **Time-of-Day Selection**: Choose specific times (Morning, Afternoon, Evening, Night)
- **Continuous Time Validation**: Only allows logical time combinations
- **Weather Integration**: Suggestions consider current weather
- **Wear History**: Tracks when items are worn for better future suggestions
- **Past Event Protection**: Cannot edit or delete past events

## 📱 Key Pages

- **Home/Onboarding**: Landing page with enhanced sign-in/sign-up
- **My Closet**: View and manage your clothing items with filtering
- **Add Item**: Smart item addition with AI assistance
- **Outfit Suggestions**: Weather-aware AI-powered outfit recommendations
- **Calendar Planner**: Advanced outfit planning with time-of-day selection
- **Profile**: Enhanced profile management with location and preferences

## 🔧 Development

### Project Structure

```
styleai-wardrobe/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   │   ├── application.yml # Main configuration
│   │   └── application-dev.properties # Development configuration
│   └── pom.xml            # Maven dependencies
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   └── ui/           # UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and contexts
│   └── hooks/            # Custom React hooks
├── .env.example          # Frontend environment template
└── backend/.env.example  # Backend environment template
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account (with profile picture and location)
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
- `POST /api/ai/weather-based-suggestions` - Get weather-aware outfit suggestions

#### Planned Events
- `GET /api/planned-events` - Get planned events
- `POST /api/planned-events` - Create planned event (with time-of-day)
- `PUT /api/planned-events/{id}` - Update event (if not in past)
- `DELETE /api/planned-events/{id}` - Delete event (if not in past)

## 🔒 Security

- JWT tokens for stateless authentication
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Input validation on both frontend and backend
- Protected API endpoints requiring authentication
- Time-based restrictions for event modifications

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use secure, production-ready values
2. **Database**: Configure production PostgreSQL instance
3. **JWT Secret**: Use a strong, randomly generated secret key (minimum 32 characters)
4. **HTTPS**: Enable SSL/TLS in production
5. **API Keys**: Secure your Gemini and Weather API keys
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
- **OpenWeatherMap** for weather data
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Spring Boot** for robust backend framework
- **React** ecosystem for modern frontend development

## 🆘 Troubleshooting

### Development Issues

1. **H2 Console Access**: Visit `http://localhost:8080/api/h2-console` (dev mode only)
2. **Database Connection**: Check your PostgreSQL connection settings
3. **API Keys**: Ensure your Gemini and Weather API keys are valid
4. **CORS Issues**: Verify your CORS configuration matches your frontend URL

### Common Solutions

- **Port Conflicts**: Change ports in configuration files if needed
- **Database Issues**: Use development mode with H2 for quick testing
- **API Failures**: Check network connectivity and API key validity
- **Authentication Issues**: Clear localStorage and try signing in again