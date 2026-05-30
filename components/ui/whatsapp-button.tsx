"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phoneNumber = "919876543210"
  const message = encodeURIComponent("Hi! I'm interested in your handmade products at Crystal Flora.")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 w-14 h-14 flex items-center justify-center bg-[#25D366] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-card text-foreground text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with us!
      </span>
    </a>
  )
}
