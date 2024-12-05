'use client'

import { useEffect, useState } from 'react'
import { compareDates } from '@/app/lib/date'
import { SmOutlineButton } from '../general/buttons'
import { IMinimalClass } from '@/app/lib/types/db'
import { getMinimalClasses } from '@/app/lib/db/client'
import { useUser } from '@/app/lib/hooks/user'
import ClassTable from './class-table'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface IDateInfo {
  dayOfWeek: string
  day: number
  month: number
  date: Date
}

export default function Calendar() {
  // days of the week are from Monday to Friday
  const [day, setDay] = useState<IDateInfo[] | null>(null)
  const [currentDate, setCurrentDate] = useState(() => {
    const dt = new Date()
    const day = dt.getDay()
    if (day === 6) {
      dt.setDate(dt.getDate() - 1)
    } else if (day === 0) {
      dt.setDate(dt.getDate() + 1)
    }
    return dt
  })

  const [classes, setClasses] = useState<IMinimalClass[] | null>(null)

  const user = useUser()

  useEffect(() => {
    const date = new Date(currentDate)

    if (day != null && day.some((d) => compareDates(d.date, date))) return

    const dayWeek = date.getDay()

    // convert the day of the week to sunday
    date.setTime(date.getTime() - dayWeek * 24 * 60 * 60 * 1000)

    setDay(
      Array.from({ length: 5 }, () => {
        date.setDate(date.getDate() + 1)
        return {
          day: date.getDate(),
          dayOfWeek: date.toLocaleString('es-MX', { weekday: 'short' }),
          month: date.getMonth(),
          date: new Date(date.getTime()),
        }
      })
    )
  }, [currentDate])

  useEffect(() => {
    setClasses(null)
    const fetchClasses = async () => {
      const classes = await getMinimalClasses(
        currentDate,
        user.isTeacher ? user.grades : user.grade
      )
      setClasses(classes)
    }
    fetchClasses()
  }, [currentDate])

  const handleDateChange = ({ date }: IDateInfo) => {
    setCurrentDate(new Date(date))
  }

  const handlePrevWeek = () => {
    if (currentDate == null) return
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const handleNextWeek = () => {
    if (currentDate == null) return
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  return (
    <div className='w-full'>
      <header className='flex items-end justify-between p-4'>
        <SmOutlineButton
          className='h-10 [&:hover_svg]:-translate-x-1'
          onClick={handlePrevWeek}>
          <IconChevronLeft width={20} className='transition-transform' />
        </SmOutlineButton>
        {day &&
          day.map((date) => {
            const isSelected =
              currentDate != null && compareDates(currentDate, date.date)
            return (
              <div
                key={date.day + '/' + date.month}
                className='flex flex-col gap-1'>
                <span className='text-gray-500 text-center'>
                  {date.dayOfWeek}
                </span>
                <SmOutlineButton
                  className='h-10'
                  onClick={() => !isSelected && handleDateChange(date)}
                  selected={isSelected}>
                  {date.day}{' '}
                  <span className='hidden sm:inline'>/ {date.month}</span>
                </SmOutlineButton>
              </div>
            )
          })}
        <SmOutlineButton
          className='h-10 [&:hover_svg]:translate-x-1'
          onClick={handleNextWeek}>
          <IconChevronRight width={20} className='transition-transform' />
        </SmOutlineButton>
      </header>
      <main>
        <ClassTable classes={classes} />
      </main>
    </div>
  )
}
