'use client'
import { useEffect } from 'react'
import { applyReadingSettings, loadReadingSettings } from '@/lib/readingSettings'

/** Applica all'avvio le impostazioni di lettura salvate sul dispositivo */
export default function ReadingPrefs() {
  useEffect(() => { applyReadingSettings(loadReadingSettings()) }, [])
  return null
}
