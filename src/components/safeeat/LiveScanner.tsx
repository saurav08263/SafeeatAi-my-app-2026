'use client'

import { useEffect, useRef } from 'react'

type Props = {
  onCapture: (image: string) => void
}

export default function LiveScanner({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    startCamera()

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment',
          },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error(err)
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    onCapture(canvas.toDataURL('image/jpeg', 0.95))
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-[500px] object-cover rounded-xl"
      />

      <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none" />

      <button
        onClick={capture}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-green-500 text-white text-lg"
      >
        Scan
      </button>
    </div>
  )
}
