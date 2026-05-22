'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import type { ChatMessage } from '@/lib/store'
import { fetchWithRetry } from '@/lib/fetch-ai'
import { Send, Bot, User, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const quickSuggestions = [
  'Can I eat mango at night?',
  'Is milk after chicken safe?',
  'Best food for gym?',
]

export function ChatScreen() {
  const { chatMessages, addChatMessage, clearChatMessages, setCurrentScreen, navigateBack, profile } = useAppStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    addChatMessage(userMessage)
    setInput('')
    setIsTyping(true)

    try {
      const data = await fetchWithRetry<{ success: boolean; message?: string; error?: string; isPending?: boolean }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-10),
        }),
      })

      // Handle remaining errors (after retries exhausted)
      if (!data.success) {
        addChatMessage({
          role: 'assistant',
          content: data.isPending
            ? '🧠 AI is still warming up. Please try again in a moment — I\'ll be ready soon!'
            : (data.error || 'Sorry, I couldn\'t process your question. Please try again.'),
          createdAt: new Date().toISOString(),
        })
        return
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.message || 'Sorry, I couldn\'t process your question. Please try again.',
        createdAt: new Date().toISOString(),
      }
      addChatMessage(aiMessage)
    } catch {
      addChatMessage({
        role: 'assistant',
        content: 'I\'m here to help with food safety questions! Please try asking again.',
        createdAt: new Date().toISOString(),
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col h-[calc(100vh-80px)]"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-tight">AI Food Doctor</h1>
          <p className="text-xs text-muted-foreground">Ask any food safety question</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      </motion.div>

      {/* Messages Area */}
      <motion.div variants={item} className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Ask me anything about food safety</p>
              <p className="text-xs text-muted-foreground mt-1">I can check combinations, allergens, and more</p>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {quickSuggestions.map((suggestion) => (
                <Card
                  key={suggestion}
                  className="p-3 cursor-pointer hover:bg-primary/5 transition-colors active:scale-[0.98]"
                  onClick={() => handleSend(suggestion)}
                >
                  <p className="text-xs font-medium">{suggestion}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-2',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center shrink-0',
                  msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'
                )}>
                  {msg.role === 'user' ? (
                    <User className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <Card className={cn(
                  'p-3 max-w-[80%]',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50'
                )}>
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                </Card>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <Card className="p-3 bg-muted/50">
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </motion.div>

      {/* Quick suggestion chips when chat has messages */}
      {chatMessages.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="shrink-0 text-[10px] h-7 rounded-full"
              onClick={() => handleSend(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <motion.div variants={item} className="px-4 py-3 border-t border-white/5 glass-card" style={{ borderRadius: 0 }}>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about food safety..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-10 rounded-xl mobile-input"
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground p-0 shadow-md shadow-primary/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
