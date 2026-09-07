import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'

export default function Settings() {
  const navigate = useNavigate()
  const [isInstalled, setIsInstalled] = useState(false)
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString())
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // Detect standalone / installed mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setIsInstalled(standalone)
  }, [])

  const handleSyncNow = () => {
    setSyncing(true)
    // Placeholder: this is where queued IndexedDB actions
    // (new memories, completed reminders) would be pushed to the backend.
    setTimeout(() => {
      setLastSync(new Date().toLocaleTimeString())
      setSyncing(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Settings</h1>
      </div>

      <Card className="rounded-3xl bg-white dark:bg-surface-dark">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-3">Appearance</p>
        <div className="flex items-center justify-between">
          <span className="text-charcoal dark:text-text-dark">Theme</span>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="rounded-3xl bg-white dark:bg-surface-dark">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-3">Language & Display</p>
        <div className="flex flex-col gap-3">
          <select className="border border-charcoal/20 dark:border-white/10 bg-white dark:bg-surface-dark text-charcoal dark:text-text-dark rounded-xl p-3 text-lg">
            <option>English</option>
            <option>Assamese</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
          <div className="flex items-center justify-between">
            <span className="text-charcoal dark:text-text-dark">Text Size</span>
            <div className="flex gap-2">
              <Button variant="ghost">A-</Button>
              <Button variant="ghost">A+</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl bg-white dark:bg-surface-dark">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-3">Offline & Sync</p>
        <div className="flex flex-col gap-2 text-charcoal dark:text-text-dark">
          <div className="flex justify-between">
            <span>App Installed</span>
            <span className={isInstalled ? 'text-sage dark:text-sage-dark font-bold' : 'text-alertamber dark:text-amber-dark font-bold'}>
              {isInstalled ? 'Installed' : 'Not Installed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Notifications</span>
            <span
              className={
                notifStatus === 'granted'
                  ? 'text-sage dark:text-sage-dark font-bold'
                  : notifStatus === 'denied'
                  ? 'text-rose font-bold'
                  : 'text-alertamber dark:text-amber-dark font-bold'
              }
            >
              {notifStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Sync</span>
            <span>{lastSync}</span>
          </div>
        </div>
        <Button fullWidth className="mt-4" onClick={handleSyncNow} disabled={syncing}>
          {syncing ? 'Syncing…' : 'Sync Now'}
        </Button>
      </Card>
    </div>
  )
}
