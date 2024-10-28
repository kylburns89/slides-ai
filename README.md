# SlidesAI - AI-Powered Presentation Generator

Generate Google Slides presentations automatically from text or audio input using AI. This application allows users to either type their content or upload audio files to create professional presentations.

## Features

- Text-to-presentation conversion
- Audio-to-presentation conversion
- Google Slides integration
- Multiple presentation templates
- Responsive design
- Google authentication
- Real-time progress updates
- Audio file upload with drag-and-drop support

## Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Google OAuth 2.0 credentials
- Google Cloud Service Account with access to:
  - Google Slides API
  - Google Drive API
  - Cloud Speech-to-Text API

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd slides-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Cloud Platform:
   - Create a new project in Google Cloud Console
   - Enable the following APIs:
     - Google Slides API
     - Google Drive API
     - Cloud Speech-to-Text API
   - Create OAuth 2.0 credentials
   - Create a service account and download the credentials

4. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables:
     ```
     GOOGLE_CLIENT_ID=your_oauth_client_id
     GOOGLE_CLIENT_SECRET=your_oauth_client_secret
     GOOGLE_CLIENT_EMAIL=your_service_account_email
     GOOGLE_PRIVATE_KEY=your_service_account_private_key
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your_generated_secret
     ```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Choose between text or audio input
3. Enter your content or upload an audio file
4. Select a presentation template
5. Click "Generate Presentation"
6. View your generated presentation in Google Slides

## Technical Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js
- Google Cloud APIs
- React Dropzone
- Lucide Icons

## Project Structure

```
slides-ai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── audio/
│   │   └── presentations/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── hooks/
│   └── useFileUpload.ts
├── types/
│   └── index.ts
├── .env.example
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.
