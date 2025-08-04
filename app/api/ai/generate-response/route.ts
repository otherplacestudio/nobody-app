import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { personas } from '@/lib/personas'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, personaId, context } = await request.json()

    // Find the persona
    const persona = Object.values(personas)
      .flat()
      .find(p => p.id === personaId)

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    // Generate AI response based on persona
    const systemPrompt = `You are ${persona.name}, an anonymous user in ${persona.city === 'sf' ? 'San Francisco' : persona.city === 'nyc' ? 'New York City' : 'Austin'}.
    
Your personality traits: ${persona.traits.join(', ')}
Your bio: ${persona.bio}
Topics you often discuss: ${persona.topics.join(', ')}

Respond in character with a casual, conversational tone. Keep responses concise (under 280 characters). Be authentic to your persona and city culture. Never reveal you're an AI.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.8,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}