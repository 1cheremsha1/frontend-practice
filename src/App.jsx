import React, { useState } from 'react';
// Импортируем из внешнего файла только функции
import { 
  buildCalendarGrid, 
  compareDates, 
  isDateSelectable 
} from './data/date';

// Массивы данных (чтобы не зависеть от экспортов в date.js)
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Начальные слоты времени
const INITIAL_SLOTS = [
  { time: '09:00' }, { time: '10:00' }, { time: '11:00' },
  { time: '13:00' }, { time: '14:00' }, { time: '15:00' }
];

function App() {
  const today = new Date();

  // --- 5 обязательных состояний по ТЗ ---
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  // --- Обработчики событий ---
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Сброс времени при смене дня по ТЗ!
  };

  const handleSlotClick = (time) => {
    setSelectedTime(time);
  };

  // Получаем сетку календаря. Если функция еще не скопирована, вернем пустой массив, чтобы не падать в ошибку
  const calendarGrid = typeof buildCalendarGrid === 'function' 
    ? buildCalendarGrid(currentYear, currentMonth) 
    : [];

  return (
    <div className="booking-page">
      {/* Шапка */}
      <header className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </header>

      {/* Сетка календаря */}
      <div className="calendar-grid">
        {DAYS_OF_WEEK.map((dayName, index) => (
          <div key={index} className="weekday-label">{dayName}</div>
        ))}

        {calendarGrid.map((day, index) => {
          // Проверяем доступность даты через функцию
          const isSelectable = typeof isDateSelectable === 'function'
            ? isDateSelectable(day, currentMonth, currentYear, today)
            : true;
            
          const isSelected = day === selectedDay;

          let dayClass = "calendar-day";
          if (!isSelectable) dayClass += " disabled";
          if (isSelected && isSelectable) dayClass += " active";

          return (
            <button
              key={index}
              className={dayClass}
              disabled={!isSelectable}
              onClick={() => day && handleDayClick(day)}
            >
              {day || ''}
            </button>
          );
        })}
      </div>

      {/* Слоты времени */}
      <div className="time-slots">
        <h3>Доступные слоты</h3>
        <div className="slots-list">
          {slots.map((slot) => {
            const isTimeSelected = slot.time === selectedTime;
            return (
              <button
                key={slot.time}
                className={`slot-btn ${isTimeSelected ? 'active' : ''}`}
                onClick={() => handleSlotClick(slot.time)}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Панель информации */}
      <footer className="booking-bottom-bar">
        <p>Выбранная дата: <strong>{selectedDay} {MONTHS_GENITIVE[currentMonth]} {currentYear} года</strong></p>
        <p>Время: <strong>{selectedTime ? selectedTime : 'не выбрано'}</strong></p>
      </footer>
    </div>
  );
}

export default App;
