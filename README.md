# StudyBuddy Connect

StudyBuddy Connect is a hybrid learning platform that integrates AI-driven academic support with peer-to-peer tutoring. This initiative aims to bridge the educational gap for students from under-resourced backgrounds by providing both AI-powered assistance and human tutoring.

## Features

- **AI Study Buddy**: Get instant help from our AI tutor
- **Peer Tutor Matching**: Connect with volunteer tutors
- **Q&A Forum**: Ask questions and get help from the community
- **Progress Tracking**: Monitor your learning progress and streaks
- **Achievement System**: Earn rewards for consistent learning

## Tech Stack

- Frontend: React.js with Chakra UI
- Backend: Firebase Functions
- Database: Firebase Firestore
- AI: OpenAI API / Gemini
- Authentication: Firebase Auth

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/studybuddy-connect.git
cd studybuddy-connect
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and Firebase services
  ├── utils/         # Utility functions
  ├── App.js         # Main application component
  └── index.js       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chakra UI for the component library
- Firebase for backend services
- OpenAI for AI capabilities
