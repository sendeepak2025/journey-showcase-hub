"use client"

import { useState } from "react"
import { Clock, Globe, Eye, MousePointer, Users, BriefcaseBusiness, BarChart3 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Activity, Settings } from 'lucide-react';

type TouchpointCardProps = {
  number: number
  title: string
  performanceValue: number
  type: string
  duration: string
  actions: {
    title: string
    description: string
    image: string
    type: 'customer' | 'backoffice'
  }[]
  activeTab?: 'customer' | 'backoffice'
  onTabChange?: (tab: 'customer' | 'backoffice') => void
}

export default function TouchpointCard({
  number,
  title,
  performanceValue,
  type,
  duration,
  actions,
  activeTab = 'customer',
  onTabChange = () => {},
}: TouchpointCardProps) {
  const [currentTab, setCurrentTab] = useState<'customer' | 'backoffice'>(activeTab)

  const handleTabChange = (tab: 'customer' | 'backoffice') => {
    setCurrentTab(tab)
    onTabChange(tab)
  }

  const getPerformanceColor = () => {
    if (performanceValue >= 80) return 'bg-green-100 text-green-800'
    if (performanceValue >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getIconForAction = (title: string) => {
    if (title.toLowerCase().includes('view') || title.toLowerCase().includes('ad')) return <Eye className="w-6 h-6 text-purple-600" />
    if (title.toLowerCase().includes('click')) return <MousePointer className="w-6 h-6 text-blue-500" />
    if (title.toLowerCase().includes('customer')) return <Users className="w-6 h-6 text-green-500" />
    if (title.toLowerCase().includes('office') || title.toLowerCase().includes('process')) return <BriefcaseBusiness className="w-6 h-6 text-orange-500" />
    return <BarChart3 className="w-6 h-6 text-gray-500" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden shadow-sm">
      <div className="flex items-start p-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#36164A] text-white font-semibold mr-4">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${getPerformanceColor()}`}>
              {performanceValue}%
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex lg:w-[35%] border-b border-gray-100 text-sm font-medium text-gray-600">
  <button
    className={cn(
      "flex items-center justify-center gap-1 flex-1 px-4 py-2 border-b-2 transition",
      currentTab === 'customer'
        ? 'border-purple-600 text-purple-600'
        : 'border-transparent hover:text-gray-800'
    )}
    onClick={() => handleTabChange('customer')}
  >
    <Activity className="w-4 h-4" />
    Customer Actions
  </button>

  <button
    className={cn(
      "flex items-center justify-center gap-1 flex-1 px-4 py-2 border-b-2 transition",
      currentTab === 'backoffice'
        ? 'border-purple-600 text-purple-600'
        : 'border-transparent hover:text-gray-800'
    )}
    onClick={() => handleTabChange('backoffice')}
  >
    <Settings className="w-4 h-4" />
    Back Office Processes
  </button>
</div>


      <div className="p-4 space-y-3">
        {actions
          .filter((action) => action.type === currentTab)
          .map((action, index) => (
            <div key={index} className="flex items-center bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-md flex items-center justify-center bg-gray-50 border border-gray-100 mr-4">
                {action.image ? (
                  <img
                    src={action.image || "/placeholder.svg"}
                    alt={action.title}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  getIconForAction(action.title)
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{action.title}</h4>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
