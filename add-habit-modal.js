import { LitElement, html, css, property, state } from './base-component.js';

export class AddHabitModal extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2000;
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
            padding: 0;
            max-width: 450px;
            width: 100%;
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
            padding: 20px 24px 16px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .modal-header h3 {
            margin: 0;
            font-size: 1.2em;
            font-weight: 600;
            color: white;
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

        .modal-body {
            padding: 24px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px 24px 24px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 0.9em;
            font-weight: 500;
            color: rgba(255,255,255,0.9);
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 0.9em;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #667eea;
            background: rgba(255,255,255,0.15);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .form-group input::placeholder {
            color: rgba(255,255,255,0.5);
        }

        .cancel-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .cancel-btn:hover {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
        }

        .confirm-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .confirm-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .confirm-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        @media (max-width: 768px) {
            .modal-content {
                max-width: 90%;
                margin: 0 auto;
            }
            
            .modal-header,
            .modal-body,
            .modal-footer {
                padding-left: 20px;
                padding-right: 20px;
            }
        }
    `;

    @property({ type: Array }) existingHabits = [];
    @property({ type: String }) currentUser = '';
    @state() habitName = '';
    @state() habitCategory = '';
    @state() habitSchedule = 'daily';
    @state() isSubmitting = false;

    render() {
        return html`
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Habit</h3>
                    <button class="close-btn" @click=${this._close}>&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="habitName">Habit Name</label>
                        <input 
                            type="text" 
                            id="habitName"
                            .value=${this.habitName}
                            @input=${this._onHabitNameChange}
                            placeholder="e.g., Morning Jog" 
                            maxlength="50"
                            @keydown=${this._onKeyDown}>
                    </div>
                    
                    <div class="form-group">
                        <label for="habitCategory">Category</label>
                        <input 
                            type="text" 
                            id="habitCategory"
                            .value=${this.habitCategory}
                            @input=${this._onHabitCategoryChange}
                            placeholder="e.g., Fitness, Learning, Health" 
                            maxlength="30"
                            @keydown=${this._onKeyDown}>
                    </div>
                    
                    <div class="form-group">
                        <label for="habitSchedule">Schedule</label>
                        <select id="habitSchedule" .value=${this.habitSchedule} @change=${this._onScheduleChange}>
                            <option value="daily">Daily</option>
                            <option value="weekdays">Weekdays (Mon-Fri)</option>
                            <option value="weekends">Weekends (Sat-Sun)</option>
                            <option value="mon,wed,fri">Mon, Wed, Fri</option>
                            <option value="tue,thu,sat">Tue, Thu, Sat</option>
                            <option value="mon">Monday only</option>
                            <option value="tue">Tuesday only</option>
                            <option value="wed">Wednesday only</option>
                            <option value="thu">Thursday only</option>
                            <option value="fri">Friday only</option>
                            <option value="sat">Saturday only</option>
                            <option value="sun">Sunday only</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click=${this._close}>Cancel</button>
                    <button class="confirm-btn" 
                            @click=${this._confirmAdd} 
                            ?disabled=${this.isSubmitting || !this._isValid()}>
                        ${this.isSubmitting ? 'Adding...' : 'Add Habit'}
                    </button>
                </div>
            </div>
        `;
    }

    open() {
        this._resetForm();
        this.classList.add('open');
        this.requestUpdate();
        
        // Focus on first input after animation
        setTimeout(() => {
            const nameInput = this.shadowRoot.getElementById('habitName');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    _close() {
        this.classList.remove('open');
        this._resetForm();
    }

    _resetForm() {
        this.habitName = '';
        this.habitCategory = '';
        this.habitSchedule = 'daily';
        this.isSubmitting = false;
    }

    _onHabitNameChange(e) {
        this.habitName = e.target.value;
    }

    _onHabitCategoryChange(e) {
        this.habitCategory = e.target.value;
    }

    _onScheduleChange(e) {
        this.habitSchedule = e.target.value;
    }

    _onKeyDown(e) {
        if (e.key === 'Enter' && this._isValid() && !this.isSubmitting) {
            e.preventDefault();
            this._confirmAdd();
        }
    }

    _isValid() {
        return this.habitName.trim() && this.habitCategory.trim();
    }

    _confirmAdd() {
        const habitName = this.habitName.trim();
        const category = this.habitCategory.trim();
        
        if (!habitName) {
            this.dispatchEvent(new CustomEvent('show-notification', {
                detail: { message: 'Please enter a habit name', type: 'error' },
                bubbles: true
            }));
            this.shadowRoot.getElementById('habitName').focus();
            return;
        }
        
        if (!category) {
            this.dispatchEvent(new CustomEvent('show-notification', {
                detail: { message: 'Please enter a category', type: 'error' },
                bubbles: true
            }));
            this.shadowRoot.getElementById('habitCategory').focus();
            return;
        }
        
        // Check if habit already exists
        const existingHabit = this.existingHabits.find(h => 
            h.person === this.currentUser && 
            h.habit.toLowerCase() === habitName.toLowerCase()
        );
        
        if (existingHabit) {
            this.dispatchEvent(new CustomEvent('show-notification', {
                detail: { message: 'A habit with this name already exists', type: 'error' },
                bubbles: true
            }));
            this.shadowRoot.getElementById('habitName').focus();
            return;
        }
        
        this.isSubmitting = true;
        
        this.dispatchEvent(new CustomEvent('add-habit', {
            detail: { 
                habitName, 
                category, 
                schedule: this.habitSchedule 
            },
            bubbles: true
        }));
        
        this._close();
    }
}

customElements.define('add-habit-modal', AddHabitModal); 