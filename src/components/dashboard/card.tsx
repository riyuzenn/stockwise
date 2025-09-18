// Note(ryuu): color palette shud be defined in the tailwind css global
// variable configs. for now, lets keep it this way.

import { FC, ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Ban, Package, Flag } from "lucide-react"

interface CardProps {
  title: string
  description: string
  value: number
  type?: "total" | "low" | "out"
}

const typeStyles: Record<NonNullable<CardProps["type"]>, string> = {
  total: "bg-[#0a0a0a] text-white border-white/20",
  low: "bg-[#f9f06b] text-black border-[#0a0a0a]",
  out: "bg-[#F96B6B] text-white border-[#0a0a0a]",
}

const typeIcons: Record<NonNullable<CardProps["type"]>, ReactNode> = {
  total: <Package className="w-8 h-8 text-[#f9f06b]" />, 
  low: <Flag className="w-8 h-8 text-black" />,
  out: <Ban className="w-8 h-8 text-white" />,
}

const Card: FC<CardProps> = ({ title, description, value, type = "total" }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-md border shadow-sm p-6 flex flex-col justify-between transition-all duration-300 ${typeStyles[type]}`}
    >
      <div className="text-3xl mb-4">{typeIcons[type]}</div>
      <div>
        <h3
          className={`text-xl font-bold mb-1 ${
            type === "total" ? "text-[#f9f06b]" : ""
          }`}
        >
          {value}
        </h3>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-80 mb-4">{description}</p>
      </div>
      <button
        className={`flex items-center gap-2 font-medium mt-auto ${
          type === "total" ? "text-[#f9f06b]" : ""
        }`}
      >
        View details <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

const TestCard: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card
        title="Total Products"
        type="total"
        value={10}
        description="All products currently in the database"
      />
      <Card
        title="Low Stock"
        value={5}
        type="low"
        description="Currently low products"
      />
      <Card
        title="Out of Stock Product"
        type="out"
        value={0}
        description="Products that require re-stocking"
      />
    </div>
  )
}

export default TestCard

