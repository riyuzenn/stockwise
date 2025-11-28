// Note(ryuu): color palette shud be defined in the tailwind css global
// variable configs. for now, lets keep it this way.

'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Ban, Package, Flag } from 'lucide-react'

interface CardProps {
  title: string
  description: string
  value: number
  type?: 'total' | 'low' | 'out'
  onClick?: () => void;
  className?: string;
  showButton?: boolean
}

const typeStyles = {
  total: 'bg-[#f9f06b] text-black border-black/20 dark:border-white/20',
  low: 'bg-[#fafafa] border-black/20 text-black dark:bg-[#0a0a0a] dark:text-white dark:border-white/20',
  out: 'bg-[#fafafa] border-black/20 text-black dark:bg-[#0a0a0a] dark:text-white dark:border-white/20',
}

const typeIcons = {
  total: <Package className="w-8 h-8 text-black" />,
  low: <Flag className="w-8 h-8 text-black dark:text-white" />,
  out: <Ban className="w-8 h-8 text-black dark:text-white" />,
}

export const Card = ({ title, description, value, type = 'total', className = "", onClick = () => {}, showButton = true }: CardProps) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: -5 }}
    className={`rounded-md hover:cursor-pointer border shadow-sm p-6 flex flex-col justify-between transition-all duration-300 ${typeStyles[type]}`}
  >
    <div className="text-3xl mb-4">{typeIcons[type]}</div>
    <div>
      <h3 className="text-xl font-bold mb-1">{value}</h3>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80 mb-4">{description}</p>
    </div>
    {showButton && 
      <button className="flex items-center gap-2 font-medium mt-auto">
        View details <ArrowRight size={16} />
      </button>
    }
  </motion.div>
)
