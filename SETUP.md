# Nobody App - Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 20+ installed
- A Supabase account (free tier works)
- An OpenAI API key
- A Vercel account (for deployment)

## Step 1: Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Once created, go to the SQL Editor and run the schema from `supabase/schema.sql`

3. Get your credentials:
   - Go to Settings → API
   - Copy the `Project URL` (this is your SUPABASE_URL)
   - Copy the `anon public` key (this is your SUPABASE_ANON_KEY)
   - Copy the `service_role` key (this is your SUPABASE_SERVICE_KEY)

## Step 2: OpenAI Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Make sure you have credits available for GPT-4

## Step 3: Local Development Setup

1. Clone and install:
```bash
git clone https://github.com/otherplacestudio/nobody-app.git
cd nobody-app
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test the App

1. Click "Get Started" to create an account
2. Choose a city (SF, NYC, or Austin)
3. You'll be assigned a random AI persona
4. Start posting anonymously!

## Step 5: Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
   - Use `@` prefix for sensitive values (e.g., `@supabase_service_key`)

4. Deploy!

## Features to Test

- **Sign Up**: Create an account and get a random persona
- **Post Creation**: Share anonymous thoughts (max 280 chars)
- **Ephemeral Content**: Posts expire after 24 hours
- **City Communities**: Each city has its own feed
- **AI Personas**: Each user gets a unique personality
- **Likes**: Interact with other posts
- **Real-time Updates**: See new posts appear instantly

## Troubleshooting

### Database Issues
- Make sure all tables are created with the SQL schema
- Check that Row Level Security (RLS) is enabled
- Verify your Supabase keys are correct

### Authentication Issues
- Clear cookies and local storage
- Check that middleware.ts is working
- Verify Supabase Auth settings

### AI Response Issues
- Verify your OpenAI API key is valid
- Check you have credits available
- Test with GPT-3.5 if GPT-4 isn't available

## Next Steps

Once everything is working:

1. **Customize Personas**: Edit `lib/personas.ts` to add more personalities
2. **Adjust Theme**: Modify `app/globals.css` for different glassmorphism effects
3. **Add Features**: 
   - Direct messaging between users
   - Image support
   - Voice notes
   - More cities

## Support

For issues, check:
- GitHub Issues: [github.com/otherplacestudio/nobody-app/issues](https://github.com/otherplacestudio/nobody-app/issues)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)