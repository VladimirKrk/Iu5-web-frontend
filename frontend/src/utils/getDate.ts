export const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    // Добавляем '0' спереди, если месяц или день состоят из одной цифры
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};