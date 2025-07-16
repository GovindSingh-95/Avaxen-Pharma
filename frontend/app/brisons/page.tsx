"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  User,
  Heart,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Shield,
  Clock,
  Stethoscope,
  Activity,
  Apple,
  Moon,
  Dumbbell,
  Brain,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
  actions?: Array<{
    type: "consult" | "emergency" | "appointment" | "location" | "resource"
    label: string
    description: string
    url?: string
  }>
  category?: string
}

interface UserProfile {
  name?: string
  age?: string
  previousTopics: string[]
  conversationHistory: string[]
}

export default function BrisonsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: `Hello! I'm your **Brisons Health Assistant** 🤖, here to provide general health tips and wellness guidance.

I'm part of the Brisons pharmacy family, dedicated to supporting your health and wellness journey with reliable information and guidance.

**What I can help you with:**
• General wellness and lifestyle tips
• Nutritional guidance and healthy eating
• Exercise and fitness recommendations
• Sleep hygiene and stress management
• Basic first-aid information
• When to seek professional medical care

**⚠️ IMPORTANT MEDICAL DISCLAIMER:**
The information I provide is for general educational purposes only and should NOT be considered as medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for any health concerns, symptoms, or before making health-related decisions.

**How can I assist you with your wellness journey today?**`,
      timestamp: new Date(),
      suggestions: [
        "General wellness tips",
        "Healthy eating advice",
        "Exercise recommendations",
        "Stress management",
        "Sleep better tips",
        "First aid basics",
      ],
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    previousTopics: [],
    conversationHistory: [],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const updateUserProfile = (topic: string, message: string) => {
    setUserProfile((prev) => ({
      ...prev,
      previousTopics: [...new Set([...prev.previousTopics, topic])],
      conversationHistory: [...prev.conversationHistory, message].slice(-10), // Keep last 10 messages
    }))
  }

  const getPersonalizedResponse = (userMessage: string): Omit<Message, "id" | "timestamp"> => {
    const message = userMessage.toLowerCase()
    const hasDiscussedBefore = (topic: string) => userProfile.previousTopics.includes(topic)

    // Emergency Detection
    if (
      message.includes("chest pain") ||
      message.includes("heart attack") ||
      message.includes("can't breathe") ||
      message.includes("difficulty breathing") ||
      message.includes("severe pain") ||
      message.includes("emergency") ||
      message.includes("unconscious") ||
      message.includes("bleeding heavily") ||
      message.includes("poisoning")
    ) {
      return {
        type: "bot",
        content: `🚨 **MEDICAL EMERGENCY DETECTED**

This sounds like a serious medical emergency that requires immediate professional attention!

**TAKE ACTION NOW:**
• Call emergency services immediately: **102** or **108**
• Go to the nearest hospital emergency room
• Contact your doctor right away
• If someone is with you, have them help

**DO NOT DELAY** - Your safety is the absolute priority!

**Remember:** I cannot provide emergency medical care. Only trained medical professionals can properly assess and treat emergency situations.`,
        actions: [
          {
            type: "emergency",
            label: "🚨 Call Emergency (102)",
            description: "Immediate emergency medical services",
          },
          {
            type: "location",
            label: "🏥 Find Nearest Hospital",
            description: "Locate emergency medical facilities",
          },
        ],
        category: "emergency",
      }
    }

    // Personalized wellness tips
    if (message.includes("wellness") || message.includes("healthy living") || message.includes("general health")) {
      const personalizedTip = hasDiscussedBefore("wellness")
        ? "Since we've talked about wellness before, here are some advanced tips:"
        : "Let me share some fundamental wellness principles:"

      return {
        type: "bot",
        content: `🌟 **Comprehensive Wellness Guide**

${personalizedTip}

**🏃‍♂️ Physical Health:**
• Aim for 150 minutes of moderate exercise weekly
• Stay hydrated: 8-10 glasses of water daily
• Maintain good posture, especially if you work at a desk
• Take regular breaks from screens (20-20-20 rule)

**🧠 Mental Wellness:**
• Practice mindfulness or meditation (even 5 minutes daily)
• Maintain social connections with family and friends
• Engage in hobbies that bring you joy
• Limit negative news consumption

**😴 Sleep Hygiene:**
• Aim for 7-9 hours of quality sleep
• Keep a consistent sleep schedule
• Create a relaxing bedtime routine
• Keep your bedroom cool, dark, and quiet

**🍎 Nutrition Basics:**
• Eat a variety of colorful fruits and vegetables
• Choose whole grains over processed foods
• Include lean proteins in your meals
• Limit added sugars and excessive salt

**⚠️ Medical Disclaimer:** These are general wellness guidelines. For personalized health advice or if you have specific health conditions, please consult with a healthcare professional.`,
        suggestions: [
          "Exercise routines for beginners",
          "Stress management techniques",
          "Healthy meal planning",
          "Better sleep habits",
          "Mental health tips",
        ],
        category: "wellness",
      }
    }

    // Exercise and Fitness
    if (
      message.includes("exercise") ||
      message.includes("workout") ||
      message.includes("fitness") ||
      message.includes("gym")
    ) {
      updateUserProfile("exercise", userMessage)

      return {
        type: "bot",
        content: `💪 **Exercise & Fitness Guidance**

**🏃‍♀️ Getting Started (Beginners):**
• Start with 15-20 minutes of light activity
• Try walking, swimming, or cycling
• Focus on consistency over intensity
• Gradually increase duration and intensity

**🏋️‍♂️ Exercise Types:**
• **Cardio:** Walking, jogging, cycling, dancing
• **Strength:** Bodyweight exercises, resistance bands, weights
• **Flexibility:** Yoga, stretching, tai chi
• **Balance:** Standing on one foot, heel-to-toe walking

**📅 Weekly Exercise Plan:**
• 3-4 days of cardio (30 minutes each)
• 2-3 days of strength training
• Daily stretching or flexibility work
• 1-2 rest days for recovery

**⚠️ Safety Guidelines:**
• Always warm up before exercising
• Cool down and stretch after workouts
• Listen to your body - stop if you feel pain
• Stay hydrated throughout your workout
• Start slowly if you're new to exercise

**🩺 Important:** Consult with a healthcare provider before starting any new exercise program, especially if you have health conditions, are over 40, or haven't exercised in a while.`,
        actions: [
          {
            type: "consult",
            label: "Find Fitness Professional",
            description: "Connect with certified trainers",
          },
          {
            type: "resource",
            label: "Exercise Videos",
            description: "Access beginner-friendly workout videos",
          },
        ],
        suggestions: ["Home workout routines", "Yoga for beginners", "Walking program", "Strength training basics"],
        category: "exercise",
      }
    }

    // Nutrition and Diet
    if (
      message.includes("diet") ||
      message.includes("nutrition") ||
      message.includes("eating") ||
      message.includes("food") ||
      message.includes("meal")
    ) {
      updateUserProfile("nutrition", userMessage)

      return {
        type: "bot",
        content: `🥗 **Nutrition & Healthy Eating Guide**

**🍎 Balanced Diet Fundamentals:**
• **Fruits & Vegetables:** 5-9 servings daily (variety of colors)
• **Whole Grains:** Brown rice, quinoa, oats, whole wheat
• **Lean Proteins:** Fish, poultry, beans, lentils, tofu, eggs
• **Healthy Fats:** Nuts, seeds, avocado, olive oil
• **Dairy/Alternatives:** Low-fat options or fortified plant-based

**🥤 Hydration Guidelines:**
• 8-10 glasses of water daily
• More if you're active or in hot weather
• Limit sugary drinks and excessive caffeine
• Herbal teas and water-rich foods count too

**🍽️ Healthy Eating Habits:**
• Eat regular meals - don't skip breakfast
• Practice portion control (use smaller plates)
• Eat slowly and mindfully
• Plan and prepare meals when possible
• Limit processed and ultra-processed foods

**🚫 Foods to Limit:**
• Added sugars and sugary snacks
• Excessive salt and sodium
• Trans fats and excessive saturated fats
• Highly processed foods
• Excessive alcohol

**⚠️ Important Note:** These are general nutrition guidelines. For specific dietary needs, food allergies, medical conditions, or weight management, please consult with a registered dietitian or healthcare provider.`,
        actions: [
          {
            type: "consult",
            label: "Find Registered Dietitian",
            description: "Get personalized nutrition advice",
          },
          {
            type: "resource",
            label: "Healthy Recipe Database",
            description: "Access nutritious meal ideas",
          },
        ],
        suggestions: ["Meal planning tips", "Healthy snack ideas", "Reading nutrition labels", "Cooking healthy meals"],
        category: "nutrition",
      }
    }

    // Sleep and Rest
    if (
      message.includes("sleep") ||
      message.includes("insomnia") ||
      message.includes("tired") ||
      message.includes("rest")
    ) {
      updateUserProfile("sleep", userMessage)

      return {
        type: "bot",
        content: `😴 **Better Sleep & Rest Guide**

**🛏️ Sleep Hygiene Basics:**
• Maintain consistent sleep/wake times (even on weekends)
• Create a relaxing bedtime routine (30-60 minutes before bed)
• Keep bedroom cool (60-67°F), dark, and quiet
• Use comfortable mattress and pillows
• Reserve bed for sleep and intimacy only

**📱 Pre-Sleep Habits:**
• Avoid screens 1 hour before bedtime (blue light disrupts sleep)
• Try reading, gentle stretching, or meditation instead
• Dim lights in the evening to signal bedtime
• Avoid large meals, caffeine, and alcohol before bed

**☀️ Daytime Habits for Better Sleep:**
• Get natural sunlight exposure, especially in the morning
• Exercise regularly (but not close to bedtime)
• Limit daytime naps to 20-30 minutes before 3 PM
• Manage stress through relaxation techniques

**😌 Relaxation Techniques:**
• Deep breathing exercises (4-7-8 technique)
• Progressive muscle relaxation
• Mindfulness meditation
• Gentle yoga or stretching

**⚠️ When to Seek Help:** If sleep problems persist for more than 2-3 weeks, or if you experience loud snoring, gasping during sleep, or excessive daytime fatigue, consult a healthcare professional. You may have a sleep disorder that requires medical attention.`,
        actions: [
          {
            type: "consult",
            label: "Sleep Specialist",
            description: "Professional help for sleep disorders",
          },
          {
            type: "resource",
            label: "Sleep Tracking Apps",
            description: "Monitor your sleep patterns",
          },
        ],
        suggestions: ["Bedtime routine ideas", "Relaxation techniques", "Managing sleep anxiety", "Natural sleep aids"],
        category: "sleep",
      }
    }

    // Stress Management and Mental Health
    if (
      message.includes("stress") ||
      message.includes("anxiety") ||
      message.includes("mental health") ||
      message.includes("overwhelmed")
    ) {
      updateUserProfile("mental_health", userMessage)

      return {
        type: "bot",
        content: `🧘 **Stress Management & Mental Wellness**

**🆘 Immediate Stress Relief:**
• Take 5 deep, slow breaths (inhale for 4, hold for 4, exhale for 6)
• Step outside for fresh air and sunlight
• Do a quick 5-minute walk
• Listen to calming music
• Practice the 5-4-3-2-1 grounding technique

**🏃‍♂️ Long-term Stress Management:**
• Regular physical exercise (releases endorphins)
• Maintain consistent sleep schedule
• Practice mindfulness or meditation daily
• Build and maintain social connections
• Engage in hobbies you enjoy
• Learn to say "no" to excessive commitments

**🧠 Mental Health Maintenance:**
• Practice gratitude (write down 3 things daily)
• Limit social media and news consumption
• Set realistic goals and expectations
• Take regular breaks from work/responsibilities
• Spend time in nature when possible

**⚠️ Seek Professional Help If:**
• Stress interferes with daily activities for more than 2 weeks
• You feel overwhelmed most days
• You have persistent physical symptoms (headaches, stomach issues)
• You experience panic attacks
• You have thoughts of self-harm
• You're using substances to cope

**🆘 Crisis Resources:**
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 102/108

**Important:** Mental health is just as important as physical health. There's no shame in seeking professional help from counselors, therapists, or psychiatrists.`,
        actions: [
          {
            type: "consult",
            label: "Mental Health Professional",
            description: "Find therapists and counselors",
          },
          {
            type: "resource",
            label: "Mental Health Apps",
            description: "Meditation and mood tracking tools",
          },
        ],
        suggestions: ["Breathing exercises", "Meditation for beginners", "Work-life balance", "Building resilience"],
        category: "mental_health",
      }
    }

    // First Aid Basics
    if (message.includes("first aid") || message.includes("emergency care") || message.includes("basic treatment")) {
      updateUserProfile("first_aid", userMessage)

      return {
        type: "bot",
        content: `🚑 **Basic First Aid Information**

**🩹 Common First Aid Situations:**

**Minor Cuts & Scrapes:**
• Clean hands before treating wound
• Stop bleeding with direct pressure
• Clean wound with water
• Apply antibiotic ointment if available
• Cover with sterile bandage

**Burns (Minor):**
• Cool with cold running water for 10-20 minutes
• Remove jewelry/clothing from area before swelling
• Cover with sterile, non-stick bandage
• Take over-the-counter pain reliever if needed

**Sprains:**
• R.I.C.E. method: Rest, Ice, Compression, Elevation
• Apply ice for 15-20 minutes every 2-3 hours
• Use elastic bandage for compression
• Elevate injured area above heart level

**Choking (Conscious Adult):**
• Encourage coughing first
• If unable to cough/speak: 5 back blows between shoulder blades
• If unsuccessful: 5 abdominal thrusts (Heimlich maneuver)
• Alternate until object dislodged or person becomes unconscious

**⚠️ CRITICAL WARNINGS:**
• These are basic guidelines only
• For serious injuries, burns, or medical emergencies: Call 102/108 immediately
• Take a certified first aid course for proper training
• Never attempt procedures you're not trained for
• When in doubt, seek professional medical help

**🎓 Recommendation:** Consider taking a certified first aid and CPR course from organizations like the Red Cross or local emergency services.`,
        actions: [
          {
            type: "emergency",
            label: "Emergency Services (102/108)",
            description: "For serious medical emergencies",
          },
          {
            type: "resource",
            label: "First Aid Course Locator",
            description: "Find certified training near you",
          },
        ],
        suggestions: [
          "CPR basics",
          "Emergency preparedness",
          "First aid kit essentials",
          "When to call emergency services",
        ],
        category: "first_aid",
      }
    }

    // When to see a doctor
    if (
      message.includes("doctor") ||
      message.includes("when to consult") ||
      message.includes("medical help") ||
      message.includes("see a physician")
    ) {
      return {
        type: "bot",
        content: `🩺 **When to Consult Healthcare Professionals**

**🚨 Seek IMMEDIATE Medical Care for:**
• Chest pain or pressure
• Difficulty breathing or shortness of breath
• Severe or persistent abdominal pain
• High fever (103°F/39.4°C or higher)
• Severe headache with vision changes
• Signs of stroke (face drooping, arm weakness, speech difficulty)
• Severe allergic reactions
• Persistent vomiting or signs of dehydration
• Any injury involving head trauma

**📅 Schedule an Appointment for:**
• Symptoms lasting more than a few days without improvement
• New or unusual symptoms that concern you
• Changes in appetite, weight, or energy levels
• Persistent fatigue or weakness
• Changes in bowel or urinary habits
• Skin changes or new growths
• Mental health concerns affecting daily life

**🔄 Regular Check-ups & Screenings:**
• Annual physical exams
• Blood pressure and cholesterol checks
• Cancer screenings (as recommended by age/risk factors)
• Eye and dental exams
• Vaccinations and immunizations
• Preventive care based on age and health history

**🔍 How to Find Healthcare Providers:**
• Ask for referrals from friends, family, or current doctors
• Check with your insurance provider for covered physicians
• Use online physician directories
• Contact local hospitals for physician referral services
• Consider telemedicine options for non-emergency consultations

**💡 Remember:** It's always better to be cautious with your health. When in doubt, consult a healthcare professional. Early detection and treatment often lead to better outcomes.`,
        actions: [
          {
            type: "appointment",
            label: "Find Healthcare Providers",
            description: "Locate doctors and specialists near you",
          },
          {
            type: "resource",
            label: "Telemedicine Services",
            description: "Online consultation options",
          },
          {
            type: "location",
            label: "Nearby Hospitals & Clinics",
            description: "Find medical facilities in your area",
          },
        ],
        suggestions: [
          "Preparing for doctor visits",
          "Questions to ask your doctor",
          "Understanding medical tests",
          "Second opinion guidance",
        ],
        category: "medical_consultation",
      }
    }

    // Default response with personalization
    const previousTopicsText =
      userProfile.previousTopics.length > 0
        ? `\n\n**Based on our previous conversations about ${userProfile.previousTopics.join(", ")}, you might also be interested in related topics.**`
        : ""

    return {
      type: "bot",
      content: `Thank you for reaching out! I'm here to help with general health and wellness information.

**I can provide guidance on:**
• **🌟 General wellness** and healthy lifestyle tips
• **🏃‍♂️ Exercise and fitness** recommendations
• **🥗 Nutrition and healthy eating** advice
• **😴 Sleep hygiene** and rest improvement
• **🧘 Stress management** and mental wellness
• **🚑 Basic first aid** information
• **🩺 When to seek** professional medical care

Could you tell me more specifically what health topic you'd like to learn about? The more specific you are, the better I can tailor my advice to help you!${previousTopicsText}

**⚠️ Important Reminder:** All information I provide is for general educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for any health concerns.`,
      suggestions: [
        "Daily wellness routine",
        "Healthy eating tips",
        "Exercise for beginners",
        "Better sleep habits",
        "Stress relief techniques",
        "When to see a doctor",
      ],
      category: "general",
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate realistic typing delay
    setTimeout(
      () => {
        const botResponse = getPersonalizedResponse(inputMessage)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          ...botResponse,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 second delay
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleActionClick = (action: { type: string; label: string; description: string; url?: string }) => {
    switch (action.type) {
      case "emergency":
        if (
          confirm("This will attempt to call emergency services. In a real emergency, call 102 or 108 immediately!")
        ) {
          // In a real app, this would initiate emergency calling
          window.open("tel:102", "_self")
        }
        break
      case "consult":
        alert("This would connect you to healthcare professional directories in a real implementation.")
        break
      case "appointment":
        alert("This would open the appointment booking system with local healthcare providers.")
        break
      case "location":
        alert("This would show a map with nearby healthcare facilities.")
        break
      case "resource":
        if (action.url) {
          window.open(action.url, "_blank")
        } else {
          alert("This would provide additional resources and tools.")
        }
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-600 to-green-600">
                <AvatarFallback className="text-white font-bold text-lg">B</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Brisons Health Assistant
                </h1>
                <p className="text-gray-600 font-medium">AI-Powered Health & Wellness Guidance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600 px-3 py-1">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                Online & Ready to Help
              </Badge>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6" />
                <span>Health Consultation Chat</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="h-[600px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar
                    className={`${message.type === "user" ? "bg-blue-600" : "bg-gradient-to-r from-blue-600 to-green-600"}`}
                  >
                    <AvatarFallback className="text-white">
                      {message.type === "user" ? <User className="h-5 w-5" /> : "B"}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`rounded-2xl p-4 shadow-md ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                    {/* Category Badge */}
                    {message.category && message.type === "bot" && (
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {message.category === "emergency" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {message.category === "exercise" && <Dumbbell className="h-3 w-3 mr-1" />}
                          {message.category === "nutrition" && <Apple className="h-3 w-3 mr-1" />}
                          {message.category === "sleep" && <Moon className="h-3 w-3 mr-1" />}
                          {message.category === "mental_health" && <Brain className="h-3 w-3 mr-1" />}
                          {message.category === "wellness" && <Activity className="h-3 w-3 mr-1" />}
                          {message.category.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {message.actions && (
                      <div className="mt-4 space-y-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.type === "emergency" ? "destructive" : "outline"}
                            className="w-full text-left justify-start text-xs"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.type === "emergency" && <AlertTriangle className="h-4 w-4 mr-2" />}
                            {action.type === "consult" && <Phone className="h-4 w-4 mr-2" />}
                            {action.type === "appointment" && <Calendar className="h-4 w-4 mr-2" />}
                            {action.type === "location" && <MapPin className="h-4 w-4 mr-2" />}
                            {action.type === "resource" && <Heart className="h-4 w-4 mr-2" />}
                            <div>
                              <div className="font-medium">{action.label}</div>
                              <div className="text-xs opacity-70">{action.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Suggestion Chips */}
                    {message.suggestions && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 px-3 rounded-full border-blue-200 hover:bg-blue-50"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-400"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <Avatar className="bg-gradient-to-r from-blue-600 to-green-600">
                    <AvatarFallback className="text-white">B</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Brisons is typing...</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white rounded-b-lg">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about wellness, nutrition, exercise, sleep, stress management, or any health topic..."
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                className="flex-1 border-2 border-gray-200 focus:border-blue-400 rounded-full px-4 py-3"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Medical Disclaimer:</strong> Information provided by Brisons is for general educational
                  purposes only and should not be considered as medical advice, diagnosis, or treatment. Always consult
                  with qualified healthcare professionals for any health concerns or before making health-related
                  decisions.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Resources */}
      <div className="container mx-auto px-4 pb-8 max-w-5xl">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Phone className="h-6 w-6 mr-3 text-blue-600" />
              Need Professional Medical Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="text-center">
                  <div className="font-semibold text-red-700">Emergency</div>
                  <div className="text-sm text-gray-600">Call 102/108</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 border-blue-200 hover:bg-blue-50"
              >
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="text-center">
                  <div className="font-semibold text-blue-700">Book Appointment</div>
                  <div className="text-sm text-gray-600">Schedule with doctors</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 border-green-200 hover:bg-green-50"
              >
                <MapPin className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <div className="font-semibold text-green-700">Find Healthcare</div>
                  <div className="text-sm text-gray-600">Nearby facilities</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 border-purple-200 hover:bg-purple-50"
              >
                <Heart className="h-8 w-8 text-purple-500" />
                <div className="text-center">
                  <div className="font-semibold text-purple-700">Health Resources</div>
                  <div className="text-sm text-gray-600">Articles & tools</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
