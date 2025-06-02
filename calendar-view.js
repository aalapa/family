import { LitElement, html, css, property } from './base-component.js';
import { formatDateAsString, isHabitScheduledForDate } from './base-component.js';

export class CalendarView extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 0;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }

        .calendar-header h2 {
            margin: 0;
            font-size: 1.4em;
            font-weight: 600;
        }

        .calendar-nav {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .calendar-nav button {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.3s ease;
        }

        .calendar-nav button:hover {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 16px;
            overflow: hidden;
        }

        .calendar-day-header {
            text-align: center;
            padding: 8px;
            font-weight: 600;
            opacity: 0.8;
            font-size: 0.75em;
            background: rgba(255,255,255,0.05);
        }

        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.05);
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 4px;
            min-height: 50px;
            border: 1px solid rgba(255,255,255,0.1);
            font-size: 0.85em;
        }

        .calendar-day:hover {
            border-color: rgba(255,255,255,0.3);
            transform: scale(1.05);
            background: rgba(255,255,255,0.15);
        }

        .calendar-day.other-month {
            opacity: 0.4;
        }

        .calendar-day.today {
            border-color: #667eea;
            border-width: 2px;
        }

        @media (max-width: 768px) {
            .calendar-grid {
                padding: 12px;
            }
            
            .calendar-day {
                min-height: 40px;
                font-size: 0.8em;
            }
        }
    `;

    @property({ type: Array }) habits = [];
    @property({ type: Array }) entries = [];
    @property({ type: String }) currentUser = '';
    @property({ type: Date }) currentDate = new Date();

    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return html`
            <div class="calendar-header">
                <h2>${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}</h2>
                <div class="calendar-nav">
                    <button @click=${() => this._changeMonth(-1)}>← Previous</button>
                    <button @click=${this._goToToday}>Today</button>
                    <button @click=${() => this._changeMonth(1)}>Next →</button>
                </div>
            </div>
            
            <div class="calendar-grid">
                ${dayNames.map(day => html`
                    <div class="calendar-day-header">${day}</div>
                `)}
                ${this._renderCalendarDays()}
            </div>
        `;
    }

    _renderCalendarDays() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const todayStr = formatDateAsString(new Date());
        const days = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = formatDateAsString(date);
            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = dateStr === todayStr;
            
            const dayEntries = this.entries.filter(e => e.person === this.currentUser && e.date === dateStr);
            const completed = dayEntries.filter(e => e.status === 'completed').length;
            const total = this.habits.filter(h => h.person === this.currentUser && isHabitScheduledForDate(h, date)).length;
            
            const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
            
            let backgroundColor = 'rgba(255,255,255,0.05)';
            let textColor = 'white';
            let borderColor = 'rgba(255,255,255,0.1)';
            
            if (total > 0) {
                if (completionPercentage === 100) {
                    backgroundColor = 'rgba(34, 197, 94, 0.8)';
                    borderColor = 'rgba(34, 197, 94, 1)';
                } else if (completionPercentage >= 80) {
                    backgroundColor = 'rgba(34, 197, 94, 0.6)';
                    borderColor = 'rgba(34, 197, 94, 0.8)';
                } else if (completionPercentage >= 60) {
                    backgroundColor = 'rgba(34, 197, 94, 0.4)';
                    borderColor = 'rgba(34, 197, 94, 0.6)';
                } else if (completionPercentage >= 40) {
                    backgroundColor = 'rgba(132, 204, 22, 0.4)';
                    borderColor = 'rgba(132, 204, 22, 0.6)';
                } else if (completionPercentage >= 20) {
                    backgroundColor = 'rgba(251, 146, 60, 0.4)';
                    borderColor = 'rgba(251, 146, 60, 0.6)';
                } else if (completionPercentage > 0) {
                    backgroundColor = 'rgba(239, 68, 68, 0.3)';
                    borderColor = 'rgba(239, 68, 68, 0.5)';
                } else {
                    backgroundColor = 'rgba(239, 68, 68, 0.5)';
                    borderColor = 'rgba(239, 68, 68, 0.7)';
                }
            }
            
            if (isToday) {
                borderColor = '#667eea';
                if (total === 0) {
                    backgroundColor = 'rgba(102, 126, 234, 0.2)';
                }
            }

            days.push(html`
                <div class="calendar-day ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}" 
                     @click=${() => this._openDayModal(dateStr)}
                     style="opacity: ${isCurrentMonth ? '1' : '0.4'}; 
                            background: ${backgroundColor}; 
                            border-color: ${borderColor};
                            color: ${textColor};
                            border-width: ${isToday ? '2px' : '1px'};">
                    <div style="font-weight: 600; margin-bottom: 2px;">${date.getDate()}</div>
                    ${total > 0 ? html`
                        <div style="font-size: 0.65em; opacity: 0.9;">
                            ${completed}/${total} (${Math.round(completionPercentage)}%)
                        </div>
                    ` : ''}
                    ${isToday ? html`<div style="font-size: 0.6em; margin-top: 2px;">TODAY</div>` : ''}
                </div>
            `);
        }

        return days;
    }

    _changeMonth(direction) {
        const newDate = new Date(this.currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        this.currentDate = newDate;
        this.requestUpdate();
    }

    _goToToday() {
        this.currentDate = new Date();
        this.requestUpdate();
    }

    _openDayModal(date) {
        this.dispatchEvent(new CustomEvent('open-day-modal', {
            detail: { date },
            bubbles: true
        }));
    }
}

customElements.define('calendar-view', CalendarView); 