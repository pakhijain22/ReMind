import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle.jsx'

export default function Landing() {
  const navigate = useNavigate()
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const roleSectionRef = useRef(null)
  const [rolesVisible, setRolesVisible] = useState(false)

  // Hero entrance animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Install prompt handling
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstallBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Scroll-reveal for role cards — plain IntersectionObserver, no extra library,
  // so this adds zero new dependencies and cannot break the production build.
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
      <div className="max-w-5xl mx-auto px-6 py-10 relative">

        <div
          className={`absolute top-6 right-6 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <ThemeToggle />
        </div>

        <div
          className={`font-display text-2xl font-semibold text-teal dark:text-teal-dark mb-16 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          ReMind
        </div>

        {showInstallBanner && (
          <div className="mb-8 bg-amber/15 dark:bg-amber-dark/10 border border-amber dark:border-amber-dark rounded-2xl p-4 flex items-center justify-between gap-4 animate-[fadeIn_0.5s_ease]">
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

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1
              className={`font-display text-4xl md:text-5xl font-medium leading-tight text-charcoal dark:text-text-dark mb-5 max-w-md transition-all duration-700 delay-100 ${
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

          <div
            className={`flex items-center justify-center transition-all duration-1000 delay-150 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <svg viewBox="0 0 340 340" className="w-64 h-64 md:w-80 md:h-80">
              <circle
                cx="170" cy="170" r="150" fill="none" strokeWidth="2"
                className="stroke-amber dark:stroke-amber-dark opacity-30 animate-[ringPulse_5s_ease-in-out_infinite]"
              />
              <circle
                cx="170" cy="170" r="115" fill="none" strokeWidth="2"
                className="stroke-teal dark:stroke-teal-dark opacity-50 animate-[ringPulse_5s_ease-in-out_infinite_0.5s]"
              />
              <circle
                cx="170" cy="170" r="80" fill="none" strokeWidth="2"
                className="stroke-amber dark:stroke-amber-dark opacity-80 animate-[ringPulse_5s_ease-in-out_infinite_1s]"
              />
              <circle
                cx="170" cy="170" r="55"
                className="fill-amber/15 dark:fill-amber-dark/15 stroke-amber dark:stroke-amber-dark"
                strokeWidth="2"
              />
              <text x="170" y="185" textAnchor="middle" fontSize="44">🌼</text>
            </svg>
          </div>
        </div>

        {/* Role selection — the ONE place this choice is made */}
        <div ref={roleSectionRef} className="mt-24 scroll-mt-10">
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
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110">👵</div>
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
