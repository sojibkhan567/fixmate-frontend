import {
  Laptop,
  Smartphone,
  Snowflake,
  Tv,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react"

/* ---------- Categories ---------- */
export type Category = {
  name: string
  icon: LucideIcon
  blurb: string
  repairs: string[]
  from: number
  quote: { text: string; name: string; place: string }
}

export const CATEGORIES: Category[] = [
  {
    name: "Smartphone",
    icon: Smartphone,
    blurb:
      "Cracked screens, battery drain, charging ports and water damage, fixed by phone specialists.",
    repairs: [
      "Screen replacement",
      "Battery swap",
      "Charging port",
      "Water damage",
    ],
    from: 800,
    quote: {
      text: "My screen was replaced at my doorstep in under two hours. I paid only after checking it.",
      name: "Sadia Islam",
      place: "Kushtia",
    },
  },
  {
    name: "Laptop & PC",
    icon: Laptop,
    blurb:
      "Slow, overheating or not booting? Hardware and software repair for laptops and desktops.",
    repairs: [
      "Overheating",
      "SSD / RAM upgrade",
      "OS reinstall",
      "Keyboard & display",
    ],
    from: 1000,
    quote: {
      text: "The technician found the real fault and didn’t upsell me. Fair price, great work.",
      name: "Imran Hasan",
      place: "Khulna",
    },
  },
  {
    name: "AC",
    icon: Wind,
    blurb:
      "Servicing, gas refill, installation and leak repair for split and window air conditioners.",
    repairs: ["Gas refill", "Deep cleaning", "Installation", "Water leakage"],
    from: 1500,
    quote: {
      text: "Booked in the morning, AC was cooling again by evening. Very professional.",
      name: "Farhana Akter",
      place: "Jessore",
    },
  },
  {
    name: "Refrigerator",
    icon: Snowflake,
    blurb:
      "Fix cooling problems, noisy compressors and frost build-up for all fridge types.",
    repairs: ["Not cooling", "Compressor", "Gas leak", "Door seal"],
    from: 1200,
    quote: {
      text: "Our fridge had stopped cooling for days. Fixed the same afternoon.",
      name: "Mahbub Alam",
      place: "Kushtia",
    },
  },
  {
    name: "TV",
    icon: Tv,
    blurb:
      "LED, LCD and smart TV repair, from no-picture issues to backlight and panel faults.",
    repairs: ["No display", "Backlight", "Sound issues", "Smart TV software"],
    from: 1000,
    quote: {
      text: "Clear updates at every step and the TV looks brand new. Highly recommended.",
      name: "Rubel Mia",
      place: "Pabna",
    },
  },
  {
    name: "Washing Machine",
    icon: Waves,
    blurb:
      "Drum, motor, drain and control-board repair for top-load and front-load machines.",
    repairs: ["Won’t spin", "Drain problems", "Motor", "Control board"],
    from: 1100,
    quote: {
      text: "No more water on the floor. The technician explained everything clearly.",
      name: "Taslima Begum",
      place: "Kushtia",
    },
  },
  {
    name: "Electrical",
    icon: Zap,
    blurb:
      "Wiring, switchboards, fans, lights and safe fixes for household electrical faults.",
    repairs: ["Wiring", "Switchboard", "Fan & lights", "Short circuit"],
    from: 500,
    quote: {
      text: "Quick, safe and tidy. Paying after the job gave me real peace of mind.",
      name: "Nazmul Haque",
      place: "Rajbari",
    },
  },
]

const ICONS = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.icon]))
export const categoryIcon = (name: string): LucideIcon => ICONS[name] ?? Zap
