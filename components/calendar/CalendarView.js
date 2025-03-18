import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2 
} from 'react-native-feather';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '../Button';

export default function CalendarView({ days, onDayClick, loading = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleMonths, setVisibleMonths] = useState([]);
  const scrollViewRef = useRef(null);

  // Initialize with 3 months (previous, current, next)
  useEffect(() => {
    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);
    setVisibleMonths([prevMonth, currentDate, nextMonth]);
  }, [currentDate]);

  // In React Native we can't use the same scroll event handling approach,
  // so we'll simplify it for mobile
  const handleScroll = (event) => {
    // We could implement infinite scrolling here if needed
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
    
    // Scroll to current month (simplified for React Native)
    if (scrollViewRef.current) {
      // We would need a different approach for scrolling in React Native
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button 
          variant="outline" 
          size="sm" 
          onPress={handlePreviousMonth}
          icon={<ChevronLeft width={16} height={16} color="#ffffff" />}
        />
        <View style={styles.headerCenter}>
          <Button 
            variant="outline" 
            size="sm" 
            onPress={handleTodayClick}
          >
            Heute
          </Button>
          <Text style={styles.headerTitle}>
            {format(currentDate, "MMMM yyyy", { locale: de })}
          </Text>
        </View>
        <Button 
          variant="outline" 
          size="sm" 
          onPress={handleNextMonth}
          icon={<ChevronRight width={16} height={16} color="#ffffff" />}
        />
      </View>

      <View style={styles.weekdays}>
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.monthsContainer}>
          {visibleMonths.map((month) => (
            <CalendarMonth
              key={format(month, "yyyy-MM")}
              month={month}
              days={days}
              onDayClick={onDayClick}
              id={`month-${format(month, "yyyy-MM")}`}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function CalendarMonth({ month, days, onDayClick, id }) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate days from previous month to fill the first row
  const firstDayOfMonth = monthStart.getDay() || 7; // Convert Sunday (0) to 7 for European calendar
  const prevMonthDays = firstDayOfMonth > 1 ? firstDayOfMonth - 1 : 0;

  // Calculate total rows needed
  const totalDays = monthDays.length + prevMonthDays;
  const rows = Math.ceil(totalDays / 7);

  // Create calendar grid
  const calendarGrid = [];

  // Add days from previous month
  for (let i = 1; i <= prevMonthDays; i++) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (prevMonthDays - i + 1));
    calendarGrid.push(date);
  }

  // Add days from current month
  calendarGrid.push(...monthDays);

  // Add days from next month to fill the last row
  const remainingDays = rows * 7 - calendarGrid.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i);
    calendarGrid.push(date);
  }

  return (
    <View style={styles.month}>
      <Text style={styles.monthTitle}>
        {format(month, "MMMM yyyy", { locale: de })}
      </Text>
      <View style={styles.calendarGrid}>
        {calendarGrid.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, month);
          const dateString = format(date, "yyyy-MM-dd");
          const dayData = days.find((day) => format(day.date, "yyyy-MM-dd") === dateString);

          return (
            <CalendarDay
              key={i}
              date={date}
              isCurrentMonth={isCurrentMonth}
              dayData={dayData}
              onClick={() => onDayClick(date)}
            />
          );
        })}
      </View>
    </View>
  );
}

function CalendarDay({ date, isCurrentMonth, dayData, onClick }) {
  const isToday = isSameDay(date, new Date());
  
  const hasEventIndicators = 
    dayData?.hasEvent || 
    dayData?.hasMeeting || 
    dayData?.hasShift || 
    dayData?.hasAvailability || 
    dayData?.hasStaffAvailability;

  return (
    <TouchableOpacity
      style={[
        styles.day,
        !isCurrentMonth && styles.dayOtherMonth,
        isToday && styles.dayToday,
      ]}
      onPress={onClick}
    >
      <Text style={[
        styles.dayText,
        !isCurrentMonth && styles.dayTextOtherMonth,
        hasEventIndicators && styles.dayTextWithEvents,
      ]}>
        {format(date, "d")}
      </Text>

      {isCurrentMonth && (
        <View style={styles.indicators}>
          {dayData?.hasEvent && <View style={[styles.indicator, styles.indicatorEvent]} />}
          {dayData?.hasMeeting && <View style={[styles.indicator, styles.indicatorMeeting]} />}
          {dayData?.hasShift && <View style={[styles.indicator, styles.indicatorShift]} />}
          {dayData?.hasAvailability && <View style={[styles.indicator, styles.indicatorAvailability]} />}
          {dayData?.hasStaffAvailability && <View style={[styles.indicator, styles.indicatorStaffAvailability]} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  weekdays: {
    flexDirection: 'row',
    padding: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#a1a1aa',
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  monthsContainer: {
    paddingBottom: 24,
  },
  month: {
    marginBottom: 24,
  },
  monthTitle: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  day: {
    width: '14.28%', // 100% / 7 days
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 2,
  },
  dayOtherMonth: {
    opacity: 0.5,
  },
  dayToday: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  dayText: {
    fontSize: 14,
    color: '#ffffff',
  },
  dayTextOtherMonth: {
    color: '#a1a1aa',
  },
  dayTextWithEvents: {
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  indicatorEvent: {
    backgroundColor: '#3b82f6', // blue
  },
  indicatorMeeting: {
    backgroundColor: '#8b5cf6', // purple
  },
  indicatorShift: {
    backgroundColor: '#22c55e', // green
  },
  indicatorAvailability: {
    backgroundColor: '#ef4444', // red
  },
  indicatorStaffAvailability: {
    backgroundColor: '#eab308', // yellow
  },
});