'use client'
import { useEffect } from 'react'

// Aggiorna automaticamente l'app quando è stata pubblicata una nuova versione.
// Il service worker (next-pwa) attiva subito la nuova versione: qui ce ne
// accorgiamo e ricarichiamo la pagina, invece di aspettare la riapertura.
// Non mostra nulla a schermo.
export default function UpdateBanner() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    const sw = navigator.serviceWorker

    // Se all'apertura non c'era un service worker è la prima installazione:
    // in quel caso non c'è nessuna versione "vecchia" da aggiornare.
    const hadController = !!sw.controller
    let reloading = false
    const onControllerChange = () => {
      if (!hadController || reloading) return
      reloading = true // evita ricariche ripetute
      window.location.reload()
    }
    sw.addEventListener('controllerchange', onControllerChange)

    // Controlla se ci sono aggiornamenti quando l'app torna in primo piano
    // e ogni ora se resta aperta a lungo.
    const checkForUpdate = () => {
      sw.getRegistration().then(reg => reg?.update()).catch(() => {})
    }
    const onVisible = () => { if (document.visibilityState === 'visible') checkForUpdate() }
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(checkForUpdate, 60 * 60 * 1000)

    return () => {
      sw.removeEventListener('controllerchange', onControllerChange)
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(timer)
    }
  }, [])

  return null
}
