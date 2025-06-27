# StyleAI Wardrobe Backend

A Spring Boot REST API for managing digital wardrobes with AI-powered features.

## Features

- **Closet Management**: CRUD operations for clothing items
- **Outfit Planning**: Create and manage outfit combinations
- **Calendar Integration**: Plan outfits for specific dates
- **User Profiles**: Manage user preferences and style information
- **AI Integration**: Image analysis and outfit suggestions (mock implementation)
- **PostgreSQL Database**: Persistent data storage
- **RESTful API**: Clean, documented endpoints

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE styleai_wardrobe;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE styleai_wardrobe TO postgres;
   ```

2. **Configuration**
   Update `src/main/resources/application.yml` with your database credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/styleai_wardrobe
       username: your_username
       password: your_password
   ```

3. **Run the Application**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Closet Items
- `GET /api/closet-items` - Get all items (with optional filters)
- `GET /api/closet-items/{id}` - Get item by ID
- `POST /api/closet-items` - Create new item
- `PUT /api/closet-items/{id}` - Update item
- `DELETE /api/closet-items/{id}` - Delete item
- `GET /api/closet-items/stats` - Get wardrobe statistics

### Outfits
- `GET /api/outfits` - Get all outfits
- `GET /api/outfits/{id}` - Get outfit by ID
- `POST /api/outfits` - Create new outfit
- `PUT /api/outfits/{id}` - Update outfit
- `DELETE /api/outfits/{id}` - Delete outfit

### Planned Events
- `GET /api/planned-events` - Get all events (with optional date filters)
- `GET /api/planned-events/{id}` - Get event by ID
- `POST /api/planned-events` - Create new event
- `PUT /api/planned-events/{id}` - Update event
- `DELETE /api/planned-events/{id}` - Delete event

### User Profiles
- `GET /api/user-profiles/default` - Get or create default profile
- `GET /api/user-profiles/{id}` - Get profile by ID
- `POST /api/user-profiles` - Create new profile
- `PUT /api/user-profiles/{id}` - Update profile

### AI Services
- `POST /api/ai/analyze-image` - Analyze clothing image
- `POST /api/ai/generate-image` - Generate clothing image
- `POST /api/ai/outfit-suggestions` - Get outfit suggestions

## Database Schema

The application uses the following main entities:
- **ClosetItem**: Clothing items with categories, colors, seasons
- **Outfit**: Collections of clothing items
- **PlannedEvent**: Scheduled outfit plans for specific dates
- **UserProfile**: User information and style preferences

## AI Integration

Currently implements mock AI services. To integrate with real AI services:

1. **OpenAI Integration**: Update `AIService.java` with actual OpenAI API calls
2. **Image Storage**: Implement proper image upload and storage
3. **API Keys**: Configure your OpenAI API key in `application.yml`

## Development

- **Hot Reload**: Spring Boot DevTools is included for development
- **Database**: Uses H2 in-memory database for testing
- **Validation**: Bean validation with custom error handling
- **CORS**: Configured for frontend integration

## Production Deployment

1. Update database configuration for production
2. Configure proper image storage (AWS S3, etc.)
3. Set up environment variables for sensitive data
4. Configure logging and monitoring
5. Set up CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request