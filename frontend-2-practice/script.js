// =========================================================================
// ДАННЫЕ И КОНСТАНТЫ (Шаг 2)
// =========================================================================
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

// Захардкоженные слоты времени для демонстрации
const AVAILABLE_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

// Текущая дата для проверки ("сегодня")
const TODAY = new Date();

// =========================================================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ (Шаг 3)
// =========================================================================
const state = {
  currentMonth: TODAY.getMonth(), // 0-11
  currentYear: TODAY.getFullYear(),
  selectedDate: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), // Объект даты без времени
  selectedTime: null, // Строка формата "12:00" или null
};

// =========================================================================
// ЧИСТЫЕ ФУНКЦИИ (Шаг 4)
// =========================================================================

/**
 * Строит матрицу дней для календаря (недели)
 */
function buildCalendarGrid(year, month) {
  const grid = [];
  // Первый день месяца
  const firstDayOfMonth = new Date(year, month, 1);
  // День недели первого дня (0 - вс, 1 - пн, ...). Переводим, чтобы пн был 0, вс - 6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Количество дней в месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let currentDay = 1;
  // Создаем сетку (максимум 6 недель)
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startDayOfWeek) {
        week.push(null); // Пустые ячейки до начала месяца
      } else if (currentDay > daysInMonth) {
        week.push(null); // Пустые ячейки после конца месяца
      } else {
        week.push(currentDay);
        currentDay++;
      }
    }
    grid.push(week);
    if (currentDay > daysInMonth) break;
  }
  return grid;
}

/**
 * Сравнение двух дат (без учета времени)
 */
function compareDates(date1, date2) {
  if (!date1 || !date2) return -1;
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() - d2.getTime();
}

/**
 * Проверяет, можно ли выбрать день (не раньше "сегодня")
 */
function isDateSelectable(day, month, year, today) {
  const targetDate = new Date(year, month, day);
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return targetDate.getTime() >= currentDate.getTime();
}

// =========================================================================
// ФУНКЦИИ РЕНДЕРА (Шаг 5 и Шаг 7)
// =========================================================================

/**
 * Отрисовка календаря
 */
function renderCalendar() {
  const calendarContainer = document.querySelector('.calendar-grid'); // ЗАМЕНИТЕ НА ВАШ КЛАСС
  const monthLabel = document.querySelector('.calendar-month-label'); // ЗАМЕНИТЕ НА ВАШ КЛАСС
  
  if (!calendarContainer) return;

  // Обновляем заголовок месяца и года
  if (monthLabel) {
    monthLabel.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  }

  const grid = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  // Шапка дней недели (если у вас она генерируется динамически, иначе можно оставить в HTML)
  // html += '<div class="week-days">...</div>';

  grid.forEach(week => {
    week.forEach(day => {
      if (day === null) {
        html += '<div class="calendar-day empty"></div>';
      } else {
        const isSelectable = isDateSelectable(day, state.currentMonth, state.currentYear, TODAY);
        const dateObj = new Date(state.currentYear, state.currentMonth, day);
        const isSelected = compareDates(dateObj, state.selectedDate) === 0;

        let classes = 'calendar-day';
        if (!isSelectable) classes += ' disabled';
        if (isSelected) classes += ' active'; // или ваш класс выбранного дня

        html += `<div class="${classes}" data-day="${day}">${day}</div>`;
      }
    });
  });

  calendarContainer.innerHTML = html;

  // Навешиваем обработчики на новые элементы (Шаг 5: «После вставки вешает обработчики»)
  setupCalendarDayListeners();
}

/**
 * Отрисовка слотов времени
 */
function renderTimeSlots() {
  const slotsContainer = document.querySelector('.time-slots-container'); // ЗАМЕНИТЕ НА ВАШ КЛАСС
  if (!slotsContainer) return;

  let html = '';
  AVAILABLE_SLOTS.forEach(slot => {
    const isSelected = state.selectedTime === slot;
    let classes = 'time-slot';
    if (isSelected) classes += ' active'; // или ваш класс выбранного слота

    html += `<div class="${classes}" data-time="${slot}">${slot}</div>`;
  });

  slotsContainer.innerHTML = html;
  setupTimeSlotListeners();
}

/**
 * Обновление нижней панели (Шаг 7)
 */
function updateBottomBar() {
  const bottomBar = document.querySelector('.bottom-panel'); // ЗАМЕНИТЕ НА ВАШ КЛАСС
  if (!bottomBar) return;

  if (!state.selectedDate) {
    bottomBar.textContent = 'Выберите дату и время';
    return;
  }

  const dayOfWeek = DAYS_OF_WEEK[state.selectedDate.getDay()];
  const dayNum = state.selectedDate.getDate();
  const monthText = MONTHS_GENITIVE[state.selectedDate.getMonth()];
  const yearNum = state.selectedDate.getFullYear();
  const timeText = state.selectedTime ? `• ${state.selectedTime}` : '';

  // Пример вывода: "Пятница, 23 октября 2026 • 12:00"
  bottomBar.textContent = `${dayOfWeek}, ${dayNum} ${monthText} ${yearNum} ${timeText}`;
}

// =========================================================================
// ОБРАБОТЧИКИ СОБЫТИЙ (Шаг 6)
// =========================================================================

function setupCalendarDayListeners() {
  const days = document.querySelectorAll('.calendar-day:not(.disabled):not(.empty)');
  days.forEach(dayEl => {
    dayEl.addEventListener('click', (event) => {
      // Важно: используем event.currentTarget, чтобы не путаться во вложенных элементах
      const day = parseInt(event.currentTarget.getAttribute('data-day'), 10);
      
      state.selectedDate = new Date(state.currentYear, state.currentMonth, day);
      state.selectedTime = null; // Частая ошибка: сбрасываем время при смене дня!

      renderCalendar();
      renderTimeSlots();
      updateBottomBar();
    });
  });
}

function setupTimeSlotListeners() {
  const slots = document.querySelectorAll('.time-slot');
  slots.forEach(slotEl => {
    slotEl.addEventListener('click', (event) => {
      const time = event.currentTarget.getAttribute('data-time');
      state.selectedTime = time;

      renderTimeSlots();
      updateBottomBar();
    });
  });
}

function setupMonthNavigation() {
  const prevBtn = document.querySelector('.btn-prev-month'); // ЗАМЕНИТЕ НА ВАШ КЛАСС КНОПКИ «<»
  const nextBtn = document.querySelector('.btn-next-month'); // ЗАМЕНИТЕ НА ВАШ КЛАСС КНОПКИ «>»

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.currentMonth--;
      if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear--;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.currentMonth++;
      if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear++;
      }
      renderCalendar();
    });
  }
}

// =========================================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ (Шаг 8)
// =========================================================================
function init() {
  setupMonthNavigation();
  
  // Первый рендер интерфейса
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

document.addEventListener('DOMContentLoaded', init);
