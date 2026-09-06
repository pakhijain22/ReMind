import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'

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
    <div className="min-h-screen bg-offwhite p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="text-2xl font-bold text-teal">Settings</h1>
      </div>

      <Card>
        <p className="text-lg font-bold text-charcoal mb-3">Language & Display</p>
        <div className="flex flex-col gap-3">
          <select className="border border-charcoal/20 rounded-xl p-3 text-lg">
            <option>English</option>
            <option>Assamese</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
          <div className="flex items-center justify-between">
            <span className="text-charcoal">Text Size</span>
            <div className="flex gap-2">
              <Button variant="ghost">A-</Button>
              <Button variant="ghost">A+</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-lg font-bold text-charcoal mb-3">Offline & Sync</p>
        <div className="flex flex-col gap-2 text-charcoal">
          <div className="flex justify-between">
            <span>App Installed</span>
            <span className={isInstalled ? 'text-sage font-bold' : 'text-alertamber font-bold'}>
              {isInstalled ? 'Installed' : 'Not Installed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Notifications</span>
            <span
              className={
                notifStatus === 'granted'
                  ? 'text-sage font-bold'
                  : notifStatus === 'denied'
                  ? 'text-rose font-bold'
                  : 'text-alertamber font-bold'
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
