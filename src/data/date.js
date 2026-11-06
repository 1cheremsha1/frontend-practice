// Функция построения сетки дней для календаря
export function buildCalendarGrid(year, month) {
  // Получаем день недели первого дня месяца (0 - воскресенье, 1 - понедельник...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Переводим на человеческий формат (0 - понедельник, 6 - воскресенье)
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  
  // Количество дней в текущем месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const grid = [];
  
  // Заполняем пустые ячейки до начала месяца
  for (let i = 0; i < startDay; i++) {
    grid.push(null);
  }
  
  // Заполняем числами месяца
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(day);
  }
  
  return grid;
}

// Функция сравнения двух дат без учета времени
export function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() - d2.getTime();
}

// Функция проверки: можно ли кликнуть на этот день (не прошел ли он уже)
export function isDateSelectable(day, month, year, today) {
  if (!day) return false;
  const checkDate = new Date(year, month, day);
  
  // Сравниваем с "сегодня". Время сбрасываем, чтобы текущий день был доступен
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return checkDate.getTime() >= currentDate.getTime();
}
