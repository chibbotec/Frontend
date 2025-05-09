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
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'

interface CalendarProps {
    selectedDate: Date | null
    onChange: (date: Date) => void
    markedDates?: Date[]
    startDate?: Date | null
    endDate?: Date | null
}

export function Calendar({ selectedDate, onChange, markedDates = [], startDate, endDate }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

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

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                    {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-900" />
                    </button>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ChevronRightIcon className="w-5 h-5 text-gray-900" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                {weekDays.map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs md:text-sm font-medium text-gray-900">
                        {day}
                    </div>
                ))}

                {days.map((day: Date, dayIdx: number) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isMarked = isMarkedDate(day)
                    const isInRange = isDateInRange(day)

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onChange(day)}
                            className={`
                min-w-8 min-h-8 h-8 w-8 md:h-10 md:w-10 flex flex-col items-center justify-center relative
                ${isMarked ? 'bg-[#FFB130] text-white' :
                  isSelected ? 'bg-blue-500 text-white' :
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isInRange ? 'bg-[#FFB130]/30' : ''}
                hover:bg-blue-100
                rounded-lg transition-colors
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