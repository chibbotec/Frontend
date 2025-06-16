'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  Locale
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState, useEffect } from 'react'

interface CalendarProps {
  selected?: Date | null
  onChange?: (date: Date) => void
  onSelect?: (date: Date | undefined) => void
  onClose?: () => void
  markedDates?: Date[]
  startDate?: Date | null
  endDate?: Date | null
  mode?: 'single' | 'range'
  locale?: Locale
  initialMonth?: Date
}

export function Calendar({
  selected,
  onChange,
  onSelect,
  onClose,
  markedDates = [],
  startDate,
  endDate,
  mode = 'single',
  locale = ko,
  initialMonth
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date())

  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth)
    }
  }, [initialMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const isMarkedDate = (date: Date) => markedDates.some((markedDate) => isSameDay(date, markedDate))

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return date >= startDate && date <= endDate && !isSameDay(date, startDate) && !isSameDay(date, endDate)
  }

  const handleDateClick = (date: Date) => {
    if (onChange) {
      onChange(date)
    }
    if (onSelect) {
      onSelect(date)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="w-full max-w-[280px] p-2">
      <div className="flex justify-between items-center mb-2">
        {/* <h2 className="text-sm font-medium text-gray-900">
          {format(currentMonth, 'yyyy년 MM월', { locale })}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((day) => (
          <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}

        {days.map((day: Date, dayIdx: number) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selected && isSameDay(day, selected)
          const isMarked = isMarkedDate(day)
          const isInRange = isDateInRange(day)

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`
                min-w-6 min-h-6 h-6 w-6 flex items-center justify-center relative text-xs
                ${isMarked ? 'bg-[#FFB130] text-white' :
                  isSelected ? 'bg-blue-500 text-white' :
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isInRange ? 'bg-[#FFB130]/30' : ''}
                hover:bg-blue-50
                rounded-md transition-colors
              `}
            >
              <span className={isMarked ? 'font-bold' : ''}>{format(day, 'd')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
