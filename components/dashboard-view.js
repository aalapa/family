import { LitElement, html, css, property } from './base-component.js';
import { formatDateAsString, isHabitScheduledForDate, getTextColor } from './base-component.js';
import { COLOR_PALETTE } from '../config/constants.js';

export class DashboardView extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .stat-value {
            font-size: 1.8em;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .stat-label {
            opacity: 0.8;
            font-size: 0.75em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
        }

        .category-card {
            border-radius: 12px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }

        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .category-title {
            font-size: 1.1em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .habit-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .habit-row:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .habit-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .habit-name {
            font-size: 0.95em;
            font-weight: 500;
        }

        .habit-schedule {
            font-size: 0.7em;
            opacity: 0.7;
            padding: 2px 6px;
            border-radius: 10px;
        }

        .habit-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 4px;
        }

        .status-indicator.completed { 
            background: #22c55e; 
        }
        
        .status-indicator.rest { 
            background: #86efac; 
        }
        
        .status-indicator.missed { 
            background: rgba(255,255,255,0.3); 
        }

        .no-habits {
            text-align: center;
            opacity: 0.7;
            margin: 40px 0;
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .categories-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .stat-value {
                font-size: 1.5em;
            }
            
            .category-title {
                font-size: 1em;
            }
            
            .habit-name {
                font-size: 0.9em;
            }
        }
    `;

    @property({ type: Array }) habits = [];
    @property({ type: Array }) entries = [];
    @property({ type: String }) currentUser = '';
    @property({ type: Object }) categoryColors = {};

    render() {
        const userHabits = this.habits.filter(h => h.person === this.currentUser);
        const userEntries = this.entries.filter(e => e.person === this.currentUser);
        
        const today = formatDateAsString(new Date());
        const todayEntries = userEntries.filter(e => e.date === today);
        const todayHabits = userHabits.filter(h => isHabitScheduledForDate(h, new Date()));
        
        const todayCompleted = todayEntries.filter(e => e.status === 'completed').length;
        const todayTotal = todayHabits.length;
        const todayCompletion = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

        return html`
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${todayCompletion}%</div>
                    <div class="stat-label">Today's Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">0%</div>
                    <div class="stat-label">This Week</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Current Streak</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">0%</div>
                    <div class="stat-label">This Month</div>
                </div>
            </div>
            <div class="categories-grid">
                ${this._renderCategories(todayHabits, todayEntries)}
            </div>
        `;
    }

    _renderCategories(todayHabits, todayEntries) {
        if (todayHabits.length === 0) {
            return html`
                <div class="category-card">
                    <div class="category-title">No Habits Scheduled</div>
                    <p>No habits are scheduled for today. Visit the Calendar or Manage Habits sections to add some!</p>
                </div>
            `;
        }

        const categories = {};
        todayHabits.forEach(habit => {
            if (!categories[habit.category]) {
                categories[habit.category] = [];
            }
            categories[habit.category].push(habit);
        });

        return Object.keys(categories).map(categoryName => {
            const bgColor = this._getCategoryColor(categoryName);
            const textColor = getTextColor(bgColor);
            
            return html`
                <div class="category-card" style="background: ${bgColor}; color: ${textColor};">
                    <div class="category-header">
                        <div class="category-title" style="color: ${textColor};">${categoryName}</div>
                    </div>
                    ${categories[categoryName].map(habit => {
                        const entry = todayEntries.find(e => e.habit === habit.habit);
                        const status = entry ? entry.status : 'missed';
                        
                        return html`
                            <div class="habit-row" @click=${() => this._openDayModal(formatDateAsString(new Date()))} style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">
                                <div class="habit-info">
                                    <div class="habit-name" style="color: ${textColor};">${habit.habit}</div>
                                    <div class="habit-schedule" style="color: ${textColor}; opacity: 0.8; background: rgba(255,255,255,0.1);">${habit.schedule}</div>
                                </div>
                                <div class="habit-status">
                                    <div class="status-indicator ${status}"></div>
                                    <span style="color: ${textColor};">${status === 'completed' ? 'Done' : status === 'rest' ? 'Rest' : 'Miss'}</span>
                                </div>
                            </div>
                        `;
                    })}
                </div>
            `;
        });
    }

    _getCategoryColor(category) {
        if (this.categoryColors[category]) {
            return this.categoryColors[category];
        }
        
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;
        return COLOR_PALETTE[colorIndex];
    }

    _openDayModal(date) {
        this.dispatchEvent(new CustomEvent('open-day-modal', {
            detail: { date },
            bubbles: true
        }));
    }
}

customElements.define('dashboard-view', DashboardView); 
