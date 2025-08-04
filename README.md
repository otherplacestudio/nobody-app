# Nobody - Anonymous Social Network

A place where nobody is somebody. Connect anonymously with AI-generated personas in San Francisco, New York City, and Austin.

## 🌟 Features

- **Anonymous Profiles**: Create and maintain completely anonymous identities
- **AI Personas**: Each user gets a unique AI-generated personality and backstory
- **City-Based Communities**: Connect with others in SF, NYC, or Austin
- **Dark Mode Only**: Sleek, modern interface with glassmorphism design
- **Real-time Chat**: Engage in anonymous conversations with AI-enhanced responses
- **Ephemeral Content**: Posts that disappear after 24 hours

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with glassmorphism theme
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel
- **Authentication**: Supabase Auth

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/otherplacestudio/nobody-app.git
cd nobody-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
nobody-app/
├── app/
│   ├── (auth)/        # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/        # Main app routes
│   │   ├── sf/        # San Francisco community
│   │   ├── nyc/       # New York City community
│   │   └── austin/    # Austin community
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn/ui components
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts
└── public/
```

## 🎨 Design System

- **Theme**: Dark mode only with glassmorphism effects
- **Colors**: Purple and blue gradient backgrounds
- **Typography**: Inter font family
- **Components**: Glass-effect cards and buttons
- **Animation**: Smooth transitions and hover effects

## 🔐 Privacy & Security

- No real names or personal information required
- End-to-end encryption for messages
- Automatic content expiration
- No tracking or analytics
- Secure authentication via Supabase

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🚢 Deployment

The app is configured for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for those who prefer to be Nobody