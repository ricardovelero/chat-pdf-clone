"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import axios from "axios"

type SubscriptionButtonProps = {
  isPro: boolean
}

export default function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)
  const handleSubscription = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button disabled={loading} onClick={handleSubscription} variant="outline">
      {isPro ? "Manage Subscriptions" : "Get Pro"}
    </Button>
  )
}
