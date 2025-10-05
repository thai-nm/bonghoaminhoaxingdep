'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TulipGrowthProps {
  completedCount: number
  totalCount: number
}

export default function TulipGrowth({ completedCount, totalCount }: TulipGrowthProps) {
  const [currentStage, setCurrentStage] = useState(0)

  // Calculate progress percentage
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  // Determine tulip growth stage based on progress
  // Using 4 phases (0-3) - full bloom only at 100% completion
  useEffect(() => {
    if (progressPercentage === 0) {
      setCurrentStage(0) // First phase - no tasks completed
    } else if (progressPercentage <= 50) {
      setCurrentStage(1) // Second phase - less than half completed
    } else if (progressPercentage < 100) {
      setCurrentStage(2) // Third phase - more than half but not all completed
    } else {
      setCurrentStage(3) // Final phase - full bloom only when ALL tasks completed
    }
  }, [progressPercentage])

  // Individual tulip images configuration
  // Using tulip-000.png to tulip-003.png (4 growth stages)
  const getTulipImage = (stage: number): string => {
    return `/tulip-00${stage}.png`
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Tulip image container */}
      <div className="relative">
        <motion.img
          src={getTulipImage(currentStage)}
          alt={`Tulip growth stage ${currentStage + 1}`}
          className="tulip-image"
          style={{
            width: 'auto',
            height: '200px', // Fixed height for consistency
            imageRendering: 'pixelated', // For crisp pixel art
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          key={currentStage} // Re-animate when stage changes
        />

        {/* Sparkle effect when fully grown */}
        {currentStage === 3 && (
          <motion.div
            className="absolute -top-2 -right-2 text-yellow-400"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            ✨
          </motion.div>
        )}
      </div>

      {/* Growth stage description */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {getStageDescription(currentStage, progressPercentage)}
        </p>
      </div>
    </div>
  )
}

function getStageDescription(stage: number, progress: number): string {
  switch (stage) {
    case 0:
      return "Plant your first seed by completing a task!"
    case 1:
      return "A tiny sprout appears! Keep going!"
    case 2:
      return "Your tulip is growing beautifully!"
    case 3:
      return "🌷 Your tulip is in full bloom! Beautiful work!"
    default:
      return `${Math.round(progress)}% complete`
  }
}
