import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Shirt, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '@/components/Logo'

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="text-center shadow-soft border-0 rounded-2xl">
      <CardHeader>
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
          {icon}
        </div>
        <CardTitle className="mt-4 font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-headline">
            Meet Your Personal Stylist
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            StyleAI helps you digitize your closet, discover new looks, and plan your outfits with the power of artificial intelligence.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full font-bold">
              <Link to="/closet">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline">Why You'll Love StyleAI</h2>
              <p className="mt-3 max-w-2xl mx-auto text-md text-muted-foreground">
                Rediscover your wardrobe and streamline your daily routine.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Shirt className="h-8 w-8 text-primary" />}
                title="Digitize Your Closet"
                description="Easily add items from your wardrobe by snapping a photo. We'll automatically tag and organize everything for you."
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="AI-Powered Suggestions"
                description="Get personalized outfit recommendations for any occasion. Our AI understands your style and what's in your closet."
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="Smart Outfit Planning"
                description="Plan your outfits for the week with our calendar. Get suggestions based on weather, occasion, and your personal taste."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StyleAI. All rights reserved.</p>
      </footer>
    </div>
  )
}