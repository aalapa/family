import { LitElement, html, css } from 'https://cdn.skypack.dev/lit@3.1.0';
import { property, state } from 'https://cdn.skypack.dev/lit@3.1.0/decorators.js';

// Utility functions
export function formatDateAsString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function createDateFromString(dateStr) {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

export function isHabitScheduledForDate(habit, date) {
    const dayOfWeek = date.getDay();
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = dayNames[dayOfWeek];
    
    switch (habit.schedule) {
        case 'daily':
            return true;
        case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
        case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
        default:
            return habit.schedule.split(',').includes(currentDay);
    }
}

export function getTextColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#2d2d2d' : '#ffffff';
}

// Export Lit for other components
export { LitElement, html, css, property, state }; 
