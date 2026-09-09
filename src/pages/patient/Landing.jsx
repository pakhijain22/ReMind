import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import HillsIllustration from '../../components/HillsIllustration.jsx'


export default function Landing() {
  const navigate = useNavigate()
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const roleSectionRef = useRef(null)
  const [rolesVisible, setRolesVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstallBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (!roleSectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRolesVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(roleSectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setShowInstallBanner(false)
    setInstallPrompt(null)
  }

  const scrollToRoles = () => {
    roleSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 overflow-x-hidden">

      {/* HERO — full-width misty hills background */}
      <div className="relative w-full min-h-[560px] md:min-h-[620px] overflow-hidden flex items-center">
        {/* Illustration fills the entire hero, edge to edge */}
        <HillsIllustration
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Readability scrim — fades from solid bg on the left (text side)
            to transparent on the right, so hills stay visible but text
            always meets contrast requirements, in both themes. */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-offwhite via-offwhite/80 to-transparent dark:from-bg-dark dark:via-bg-dark/80"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <div
            className={`absolute top-4 right-4 md:top-6 md:right-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <ThemeToggle />
          </div>

          <div
            className={`font-display text-2xl font-semibold text-teal dark:text-teal-dark mb-10 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            ReMind
          </div>

          {showInstallBanner && (
            <div className="mb-8 max-w-md bg-amber/15 dark:bg-amber-dark/10 border border-amber dark:border-amber-dark rounded-2xl p-4 flex items-center justify-between gap-4 animate-[fadeIn_0.5s_ease] backdrop-blur-sm">
              <p className="text-sm text-charcoal dark:text-text-dark">
                Install ReMind on your device for quick, offline access.
              </p>
              <button
                onClick={handleInstall}
                className="min-h-touch bg-amber dark:bg-amber-dark text-charcoal px-5 py-2 rounded-xl font-bold whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
              >
                Install
              </button>
            </div>
          )}

          <h1
            className={`font-display text-4xl md:text-6xl font-medium leading-tight text-charcoal dark:text-text-dark mb-5 max-w-lg transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Every memory, held a little closer.
          </h1>
          <p
            className={`text-lg text-charcoal/70 dark:text-text-dark/70 max-w-md mb-9 leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            ReMind helps elderly patients stay engaged through gentle games
            and voice reminders, while giving families a clear, caring
            window into their day.
          </p>
          <button
            onClick={scrollToRoles}
            className={`min-h-touch bg-teal dark:bg-teal-dark text-offwhite dark:text-bg-dark px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-700 delay-300 hover:scale-105 hover:shadow-lg active:scale-95 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Get started ↓
          </button>
        </div>
      </div>

      

      {/* ROLE SELECTION — normal background, below the hero */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div ref={roleSectionRef} className="scroll-mt-10">
          <h2
            className={`font-display text-2xl font-medium text-charcoal dark:text-text-dark mb-8 text-center transition-all duration-700 ${
              rolesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Who's using ReMind today?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/patient/home')}
              className={`bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                rolesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: rolesVisible ? '100ms' : '0ms' }}
            >
              <div className="text-4xl mb-4">👵</div>
              <h3 className="font-display text-2xl font-medium text-teal dark:text-teal-dark mb-2">
                I am a patient
              </h3>
              <p className="text-charcoal/70 dark:text-text-dark/70">
                Play gentle games, see today's reminders, and look through your memories.
              </p>
            </div>

            <div
              onClick={() => navigate('/caregiver/dashboard')}
              className={`bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                rolesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: rolesVisible ? '250ms' : '0ms' }}
            >
              <div className="text-4xl mb-4">👨‍👩‍👧</div>
              <h3 className="font-display text-2xl font-medium text-teal dark:text-teal-dark mb-2">
                I am a caregiver
              </h3>
              <p className="text-charcoal/70 dark:text-text-dark/70">
                Track progress, manage reminders, and stay close from anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
