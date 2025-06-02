import { LitElement, html, css, property, state } from './base-component.js';
import { createDateFromString, isHabitScheduledForDate } from './base-component.js';

export class DayModal extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 16px;
        }

        :host(.open) {
            display: flex;
        }

        .modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 16px;
            padding: 24px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.2);
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .modal-title {
            font-size: 1.2em;
            font-weight: 600;
            margin: 0;
        }

        .close-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            font-size: 1.1em;
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.3s ease;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close-btn:hover {
            opacity: 1;
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
        }

        .habit-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .habit-entry-info {
            flex: 1;
        }

        .habit-entry-name {
            font-weight: 500;
            margin-bottom: 4px;
            font-size: 0.9em;
        }

        .habit-entry-category {
            font-size: 0.75em;
            opacity: 0.7;
        }

        .status-buttons {
            display: flex;
            gap: 6px;
        }

        .status-btn {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9em;
            transition: all 0.3s ease;
        }

        .status-btn:hover {
            transform: scale(1.1);
        }

        .status-btn.active {
            border-color: #22c55e;
            background: rgba(34, 197, 94, 0.2);
        }

        .status-btn.completed.active {
            border-color: #22c55e;
            background: rgba(34, 197, 94, 0.3);
        }

        .status-btn.rest.active {
            border-color: #86efac;
            background: rgba(134, 239, 172, 0.3);
        }

        .status-btn.missed.active {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.3);
        }

        .modal-footer {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        }

        .save-close-btn {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .save-close-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .no-habits {
            text-align: center;
            opacity: 0.7;
            margin: 20px 0;
        }

        @media (max-width: 768px) {
            .modal-content {
                padding: 20px;
                margin: 8px;
            }
        }
    `;

    @property({ type: String }) selectedDate = '';
    @property({ type: Array }) habits = [];
    @property({ type: Array }) entries = [];
    @property({ type: String }) currentUser = '';
    @property({ type: Boolean }) isOpen = false;

    render() {
        if (!this.selectedDate) return html``;

        const dateObj = createDateFromString(this.selectedDate);
        const userHabits = this.habits.filter(h => h.person === this.currentUser && isHabitScheduledForDate(h, dateObj));
        const dayEntries = this.entries.filter(e => e.person === this.currentUser && e.date === this.selectedDate);

        const dateTitle = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });

        return html`
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit ${dateTitle}</h3>
                    <button class="close-btn" @click=${this._close}>&times;</button>
                </div>
                
                <div class="modal-body">
                    ${userHabits.length === 0 ? html`
                        <p class="no-habits">No habits scheduled for this day.</p>
                    ` : userHabits.map(habit => {
                        const entry = dayEntries.find(e => e.habit === habit.habit);
                        const currentStatus = entry ? entry.status : '';
                        
                        return html`
                            <div class="habit-entry">
                                <div class="habit-entry-info">
                                    <div class="habit-entry-name">${habit.habit}</div>
                                    <div class="habit-entry-category">${habit.category}</div>
                                </div>
                                <div class="status-buttons">
                                    <button class="status-btn completed ${entry?.status === 'completed' ? 'active' : ''}" 
                                            @click=${() => this._setStatus(habit.habit, 'completed')}
                                            title="Completed">Done</button>
                                    <button class="status-btn rest ${entry?.status === 'rest' ? 'active' : ''}" 
                                            @click=${() => this._setStatus(habit.habit, 'rest')}
                                            title="Rest Day">Rest</button>
                                    <button class="status-btn missed ${entry?.status === 'missed' ? 'active' : ''}" 
                                            @click=${() => this._setStatus(habit.habit, 'missed')}
                                            title="Missed">Miss</button>
                                </div>
                            </div>
                        `;
                    })}
                </div>

                <div class="modal-footer">
                    <button class="save-close-btn" @click=${this._saveAndClose}>Save & Close</button>
                </div>
            </div>
        `;
    }

    open(date) {
        this.selectedDate = date;
        this.isOpen = true;
        this.classList.add('open');
    }

    _close() {
        this.isOpen = false;
        this.classList.remove('open');
        this.selectedDate = '';
    }

    _setStatus(habit, status) {
        this.dispatchEvent(new CustomEvent('update-habit-status', {
            detail: { habit, status, date: this.selectedDate },
            bubbles: true
        }));
    }

    _saveAndClose() {
        this._close();
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: { message: 'Changes saved successfully!', type: 'success' },
            bubbles: true
        }));
    }
}

customElements.define('day-modal', DayModal); 
