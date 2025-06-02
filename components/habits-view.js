import { LitElement, html, css, property } from './base-component.js';
import { getTextColor } from './base-component.js';
import { COLOR_PALETTE } from '../config/constants.js';

export class HabitsView extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 0;
        }

        .habits-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }

        .habits-header h2 {
            font-size: 1.4em;
            font-weight: 600;
            margin: 0;
        }

        .add-habit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .add-habit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .habits-category {
            margin-bottom: 30px;
        }

        .category-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .category-header h3 {
            margin: 0;
        }

        .color-btn {
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.3s ease;
        }

        .color-btn:hover {
            transform: scale(1.05);
        }

        .habits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .habit-tile {
            border-radius: 10px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
        }

        .habit-tile:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .habit-name {
            font-weight: 600;
            margin-bottom: 8px;
        }

        .habit-schedule {
            font-size: 0.8em;
            opacity: 0.8;
            margin-bottom: 15px;
        }

        .habit-actions {
            display: flex;
            gap: 10px;
        }

        .habit-actions button {
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.3s ease;
        }

        .edit-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
        }

        .edit-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .delete-btn {
            background: rgba(255,0,0,0.3);
            border: 1px solid rgba(255,0,0,0.5);
        }

        .delete-btn:hover {
            background: rgba(255,0,0,0.5);
        }

        .no-habits {
            text-align: center;
            opacity: 0.7;
            margin: 40px 0;
        }

        @media (max-width: 768px) {
            .habits-grid {
                grid-template-columns: 1fr;
            }
            
            .habits-header {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
        }
    `;

    @property({ type: Array }) habits = [];
    @property({ type: String }) currentUser = '';
    @property({ type: Object }) categoryColors = {};

    render() {
        const userHabits = this.habits.filter(h => h.person === this.currentUser);
        
        return html`
            <div class="habits-header">
                <h2>Manage Habits</h2>
                <button class="add-habit-btn" @click=${this._showAddHabitModal}>+ Add New Habit</button>
            </div>
            
            <div class="habits-list">
                ${this._renderHabits(userHabits)}
            </div>
        `;
    }

    _renderHabits(userHabits) {
        if (userHabits.length === 0) {
            return html`
                <div class="no-habits">
                    <h3>No habits created yet</h3>
                    <p>Click "Add New Habit" to get started!</p>
                </div>
            `;
        }

        // Group habits by category
        const categories = {};
        userHabits.forEach(habit => {
            if (!categories[habit.category]) {
                categories[habit.category] = [];
            }
            categories[habit.category].push(habit);
        });

        return Object.keys(categories).map(categoryName => {
            const bgColor = this._getCategoryColor(categoryName);
            const textColor = getTextColor(bgColor);
            
            return html`
                <div class="habits-category">
                    <div class="category-header">
                        <h3 style="color: ${bgColor};">${categoryName}</h3>
                        <button class="change-color-btn" 
                                @click=${() => this._openColorPicker(categoryName)}
                                title="Change category color">Color</button>
                    </div>
                    <div class="habits-grid">
                        ${categories[categoryName].map(habit => html`
                            <div class="habit-tile" style="background: ${bgColor}; color: ${textColor};">
                                <div class="habit-name" style="color: ${textColor};">${habit.habit}</div>
                                <div class="habit-schedule" style="color: ${textColor};">${habit.schedule}</div>
                                <div class="habit-actions">
                                    <button class="edit-btn" 
                                            style="color: ${textColor};"
                                            @click=${() => this._editHabit(habit.habit)}>Edit</button>
                                    <button class="delete-btn" 
                                            style="color: ${textColor};"
                                            @click=${() => this._deleteHabit(habit.habit)}>Delete</button>
                                </div>
                            </div>
                        `)}
                    </div>
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

    _showAddHabitModal() {
        this.dispatchEvent(new CustomEvent('show-add-habit-modal', {
            bubbles: true
        }));
    }

    _editHabit(habitName) {
        this.dispatchEvent(new CustomEvent('edit-habit', {
            detail: { habitName },
            bubbles: true
        }));
    }

    _deleteHabit(habitName) {
        this.dispatchEvent(new CustomEvent('delete-habit', {
            detail: { habitName },
            bubbles: true
        }));
    }

    _changeCategoryColor(categoryName) {
        this.dispatchEvent(new CustomEvent('change-category-color', {
            detail: { categoryName },
            bubbles: true
        }));
    }

    _openColorPicker(categoryName) {
        this.dispatchEvent(new CustomEvent('open-color-picker', {
            detail: { categoryName },
            bubbles: true
        }));
    }
}

customElements.define('habits-view', HabitsView); 
