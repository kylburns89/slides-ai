# SlidesAI - AI-Powered Presentation Generator

Generate beautiful presentations automatically from text or audio input using AI. This application allows users to either type their content or upload audio files to create professional presentations with various themes and styles.

## Features

- Text-to-presentation conversion
- Audio-to-presentation conversion
- Multiple presentation themes (12+ built-in themes)
- Theme customization options
- OpenAI integration for content generation
- Audio file upload with drag-and-drop support
- Presentation history tracking
- Real-time progress updates
- Responsive design
- Dark/Light mode support

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Environment variables configuration

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

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your_generated_secret
     ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Choose between text or audio input mode
2. Enter your content or upload an audio file
3. Configure API settings if needed
4. Select a presentation theme
5. Add a title for your presentation
6. Click "Generate Presentation"
7. View your generated presentation in the built-in viewer
8. Access your presentation history anytime

## Technical Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Prisma
- OpenAI API
- Reveal.js
- React Dropzone
- Lucide Icons
- Geist Font

## Project Structure

```
slides-ai/
├── app/
│   ├── api/
│   │   ├── audio/
│   │   ├── config/
│   │   ├── generate/
│   │   └── presentations/
│   ├── components/
│   │   ├── APISettings.tsx
│   │   ├── AudioInput.tsx
│   │   ├── TextInput.tsx
│   │   ├── ThemeSelection.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── constants/
│   ├── fonts/
│   ├── presentation/
│   ├── templates/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── hooks/
│   ├── useAPIKeys.ts
│   ├── useFileUpload.ts
│   └── useTheme.tsx
├── prisma/
│   └── schema.prisma
├── public/
│   └── themes/
├── types/
│   └── index.ts
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
