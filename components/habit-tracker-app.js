import { LitElement, html, css, state } from './base-component.js';
import { formatDateAsString } from './base-component.js';
import { SAMPLE_HABITS, USER_AVATARS } from '../config/constants.js';

export class HabitTrackerApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
        }

        .main-app {
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            font-size: 1.8em;
        }

        .user-details h2 {
            font-size: 1.3em;
            font-weight: 600;
            text-transform: capitalize;
            margin: 0;
        }

        .user-details p {
            opacity: 0.8;
            margin-top: 2px;
            font-size: 0.85em;
        }

        .app-nav {
            display: flex;
            gap: 8px;
        }

        .nav-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-btn:hover, .nav-btn.active {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
        }

        .logout-btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            border-color: rgba(255,255,255,0.3);
        }

        .view-container {
            display: block;
        }

        .hidden {
            display: none !important;
        }

        @media (max-width: 768px) {
            .main-app {
                padding: 12px;
            }
            
            .app-header {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
            
            .app-nav {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .nav-btn {
                padding: 6px 10px;
                font-size: 0.8em;
            }
        }

        @media (max-width: 480px) {
            .user-avatar {
                font-size: 1.5em;
            }
            
            .user-details h2 {
                font-size: 1.1em;
            }
        }
    `;

    @state() currentUser = null;
    @state() currentView = 'dashboard';
    @state() habitsData = [];
    @state() entriesData = [];
    @state() categoryColors = {};
    @state() selectedDate = null;

    async connectedCallback() {
        super.connectedCallback();
        await this._loadData();
        this._setupKeyboardNavigation();
    }

    render() {
        if (!this.currentUser) {
            return html`
                <login-screen @user-login=${this._handleLogin}></login-screen>
            `;
        }

        const todayCompleted = this._getTodayStats().completed;
        const todayTotal = this._getTodayStats().total;

        return html`
            <div class="main-app">
                <div class="app-header">
                    <div class="user-info">
                        <div class="user-avatar">${USER_AVATARS[this.currentUser]}</div>
                        <div class="user-details">
                            <h2>${this.currentUser.charAt(0).toUpperCase() + this.currentUser.slice(1)}</h2>
                            <p>${todayCompleted}/${todayTotal} habits completed today</p>
                        </div>
                    </div>
                    
                    <div class="app-nav">
                        <button class="nav-btn ${this.currentView === 'dashboard' ? 'active' : ''}" 
                                @click=${() => this._showView('dashboard')}>Dashboard</button>
                        <button class="nav-btn ${this.currentView === 'calendar' ? 'active' : ''}" 
                                @click=${() => this._showView('calendar')}>Calendar</button>
                        <button class="nav-btn ${this.currentView === 'habits' ? 'active' : ''}" 
                                @click=${() => this._showView('habits')}>Manage Habits</button>
                        <button class="nav-btn logout-btn" @click=${this._logout}>Logout</button>
                    </div>
                </div>

                <div class="view-container">
                    <dashboard-view 
                        class="${this.currentView === 'dashboard' ? '' : 'hidden'}"
                        .habits=${this.habitsData}
                        .entries=${this.entriesData}
                        .currentUser=${this.currentUser}
                        .categoryColors=${this.categoryColors}
                        @open-day-modal=${this._handleOpenDayModal}>
                    </dashboard-view>
                    
                    <calendar-view 
                        class="${this.currentView === 'calendar' ? '' : 'hidden'}"
                        .habits=${this.habitsData} 
                        .entries=${this.entriesData} 
                        .currentUser=${this.currentUser}
                        @open-day-modal=${this._handleOpenDayModal}>
                    </calendar-view>
                    
                    <habits-view 
                        class="${this.currentView === 'habits' ? '' : 'hidden'}"
                        .habits=${this.habitsData} 
                        .currentUser=${this.currentUser} 
                        .categoryColors=${this.categoryColors}
                        @show-add-habit-modal=${this._showAddHabitModal}
                        @edit-habit=${this._handleEditHabit}
                        @delete-habit=${this._handleDeleteHabit}
                        @change-category-color=${this._handleChangeCategoryColor}>
                    </habits-view>
                </div>
            </div>

            <day-modal id="dayModal"
                       .habits=${this.habitsData}
                       .entries=${this.entriesData}
                       .currentUser=${this.currentUser}
                       @update-habit-status=${this._handleUpdateHabitStatus}
                       @show-notification=${this._handleShowNotification}>
            </day-modal>

            <add-habit-modal id="addHabitModal"
                            .existingHabits=${this.habitsData}
                            .currentUser=${this.currentUser}
                            @add-habit=${this._handleAddHabit}
                            @show-notification=${this._handleShowNotification}>
            </add-habit-modal>

            <edit-habit-modal id="editHabitModal"
                             .existingHabits=${this.habitsData}
                             .currentUser=${this.currentUser}
                             @edit-habit=${this._handleSaveEditHabit}
                             @show-notification=${this._handleShowNotification}>
            </edit-habit-modal>

            <confirm-modal id="confirmModal"></confirm-modal>

            <color-picker-modal id="colorPickerModal"
                               @color-selected=${this._handleColorSelected}>
            </color-picker-modal>

            <toast-notification id="toast"></toast-notification>
        `;
    }

    _handleLogin(e) {
        this.currentUser = e.detail.user;
        this._loadCategoryColors();
        this._showNotification(`Welcome back, ${this.currentUser}!`, 'success');
    }

    _handleOpenDayModal(e) {
        const dayModal = this.shadowRoot.getElementById('dayModal');
        if (dayModal) {
            dayModal.open(e.detail.date);
        }
    }

    _handleShowNotification(e) {
        this._showNotification(e.detail.message, e.detail.type);
    }

    async _handleUpdateHabitStatus(e) {
        const { habit, category, status, date } = e.detail;
        
        try {
            console.log(`Updating ${habit} to status ${status} for ${date}`);
            
            const entryId = `${this.currentUser}_${date}_${habit}`.replace(/[^a-zA-Z0-9]/g, '_');
            
            const newEntry = {
                date: date,
                person: this.currentUser,
                category: category,
                habit: habit,
                status: status,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Update local data immediately
            this.entriesData = this.entriesData.filter(e => 
                !(e.person === this.currentUser && e.date === date && e.habit === habit)
            );
            this.entriesData.push(newEntry);
            
            // Save to Firestore
            await window.db.collection('entries').doc(entryId).set(newEntry);
            console.log('Successfully saved to Firestore');
            
            // Force update of all components
            this.requestUpdate();
            
        } catch (error) {
            console.error('Error updating habit status:', error);
            this._showNotification('Error saving your change. Please try again.', 'error');
        }
    }

    _showAddHabitModal() {
        const addModal = this.shadowRoot.getElementById('addHabitModal');
        if (addModal) {
            addModal.open();
        }
    }

    async _handleAddHabit(e) {
        const { habitName, category, schedule } = e.detail;
        
        try {
            const newHabit = {
                person: this.currentUser,
                category: category,
                habit: habitName,
                schedule: schedule,
                required: true
            };
            
            // Add to local data
            this.habitsData = [...this.habitsData, newHabit];
            
            // Save to Firestore
            const habitRef = window.db.collection('habits').doc();
            await habitRef.set(newHabit);
            
            console.log('Successfully added new habit');
            
            // Force update of all components
            this.requestUpdate();
            
            this._showNotification(`Successfully added "${habitName}" to ${category}!`, 'success');
            
        } catch (error) {
            console.error('Error adding habit:', error);
            this._showNotification('Error adding habit. Please try again.', 'error');
        }
    }

    _handleEditHabit(e) {
        const editModal = this.shadowRoot.getElementById('editHabitModal');
        if (editModal) {
            editModal.open(e.detail.habitName);
        }
    }

    async _handleSaveEditHabit(e) {
        const { originalHabitName, newName, newCategory, newSchedule } = e.detail;
        
        try {
            // Update local data
            const habitIndex = this.habitsData.findIndex(h => h.person === this.currentUser && h.habit === originalHabitName);
            if (habitIndex !== -1) {
                this.habitsData[habitIndex] = {
                    ...this.habitsData[habitIndex],
                    habit: newName,
                    category: newCategory,
                    schedule: newSchedule
                };
                
                // Update Firestore - find the document and update it
                const habitsSnapshot = await window.db.collection('habits').where('person', '==', this.currentUser).where('habit', '==', originalHabitName).get();
                
                if (!habitsSnapshot.empty) {
                    const doc = habitsSnapshot.docs[0];
                    await doc.ref.update({
                        habit: newName,
                        category: newCategory,
                        schedule: newSchedule
                    });
                }
                
                // Update all entries that reference the old habit name
                if (originalHabitName !== newName) {
                    this.entriesData.forEach(entry => {
                        if (entry.person === this.currentUser && entry.habit === originalHabitName) {
                            entry.habit = newName;
                            entry.category = newCategory;
                        }
                    });
                    
                    // Update entries in Firestore
                    const entriesSnapshot = await window.db.collection('entries').where('person', '==', this.currentUser).where('habit', '==', originalHabitName).get();
                    const batch = window.db.batch();
                    
                    entriesSnapshot.forEach(doc => {
                        batch.update(doc.ref, {
                            habit: newName,
                            category: newCategory
                        });
                    });
                    
                    await batch.commit();
                }
                
                // Force array update for reactivity
                this.habitsData = [...this.habitsData];
                this.entriesData = [...this.entriesData];
            }
            
            this._showNotification(`Successfully updated "${newName}"!`, 'success');
            
        } catch (error) {
            console.error('Error updating habit:', error);
            this._showNotification('Error updating habit. Please try again.', 'error');
        }
    }

    _handleDeleteHabit(e) {
        const habitName = e.detail.habitName;
        const confirmModal = this.shadowRoot.getElementById('confirmModal');
        
        if (confirmModal) {
            confirmModal.show({
                title: 'Delete Habit',
                message: `Are you sure you want to delete "${habitName}"?\n\nThis will also delete ALL your progress/entries for this habit. This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                isDanger: true,
                onConfirm: () => this._confirmDeleteHabit(habitName)
            });
        }
    }

    async _confirmDeleteHabit(habitName) {
        try {
            console.log(`Attempting to delete habit: ${habitName} for user: ${this.currentUser}`);
            
            // Find the habit in local data first
            const habitToDelete = this.habitsData.find(h => h.person === this.currentUser && h.habit === habitName);
            if (!habitToDelete) {
                this._showNotification(`Habit "${habitName}" not found!`, 'error');
                return;
            }
            
            // Remove from local data immediately for UI responsiveness
            this.habitsData = this.habitsData.filter(h => !(h.person === this.currentUser && h.habit === habitName));
            this.entriesData = this.entriesData.filter(e => !(e.person === this.currentUser && e.habit === habitName));
            
            // Try to delete from Firestore (if the data exists there)
            try {
                const habitsSnapshot = await window.db.collection('habits').where('person', '==', this.currentUser).where('habit', '==', habitName).get();
                const entriesSnapshot = await window.db.collection('entries').where('person', '==', this.currentUser).where('habit', '==', habitName).get();
                
                if (!habitsSnapshot.empty || !entriesSnapshot.empty) {
                    const batch = window.db.batch();
                    
                    // Delete habit documents
                    habitsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    
                    // Delete all related entries
                    entriesSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    
                    await batch.commit();
                    console.log('Successfully deleted from Firestore');
                } else {
                    console.log('No Firestore documents found to delete (likely using sample data)');
                }
            } catch (firestoreError) {
                console.warn('Failed to delete from Firestore, but local deletion successful:', firestoreError);
            }
            
            this._showNotification(`Successfully deleted "${habitName}" and all related data.`, 'success');
            
        } catch (error) {
            console.error('Error deleting habit:', error);
            this._showNotification('Error deleting habit. Please try again.', 'error');
        }
    }

    _handleChangeCategoryColor(e) {
        const { categoryName } = e.detail;
        const colorModal = this.shadowRoot.getElementById('colorPickerModal');
        
        if (colorModal) {
            const currentColor = this.categoryColors[categoryName] || this._getDefaultCategoryColor(categoryName);
            colorModal.open(categoryName, currentColor);
        }
    }

    _handleColorSelected(e) {
        const { categoryName, color } = e.detail;
        
        this.categoryColors = {
            ...this.categoryColors,
            [categoryName]: color
        };
        
        this._saveCategoryColors();
        
        // Force update to show new colors
        this.requestUpdate();
        
        this._showNotification(`Updated color for "${categoryName}"`, 'success');
    }

    _getDefaultCategoryColor(category) {
        // Same logic as in other components for consistency
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % 16; // COLOR_PALETTE.length
        const COLOR_PALETTE = [
            '#667eea', '#f093fb', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff6b6b', '#c44569', '#f8b500', '#6c5ce7', '#00cec9', '#fd79a8',
            '#fdcb6e', '#6c5ce7', '#00b894', '#e17055'
        ];
        return COLOR_PALETTE[colorIndex];
    }

    _showView(view) {
        this.currentView = view;
    }

    _logout() {
        this.currentUser = null;
        this.currentView = 'dashboard';
    }

    _getTodayStats() {
        const userHabits = this.habitsData.filter(h => h.person === this.currentUser);
        const userEntries = this.entriesData.filter(e => e.person === this.currentUser);
        
        const today = formatDateAsString(new Date());
        const todayEntries = userEntries.filter(e => e.date === today);
        const todayHabits = userHabits.filter(h => this._isHabitScheduledForDate(h, new Date()));
        
        const completed = todayEntries.filter(e => e.status === 'completed').length;
        
        return { completed, total: todayHabits.length };
    }

    _isHabitScheduledForDate(habit, date) {
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

    _loadCategoryColors() {
        const saved = localStorage.getItem(`categoryColors_${this.currentUser}`);
        if (saved) {
            this.categoryColors = JSON.parse(saved);
        }
    }

    _saveCategoryColors() {
        localStorage.setItem(`categoryColors_${this.currentUser}`, JSON.stringify(this.categoryColors));
    }

    _showNotification(message, type = 'success') {
        const toast = this.shadowRoot.getElementById('toast');
        if (toast) {
            toast.show(message, type);
        }
    }

    _setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dayModal = this.shadowRoot.getElementById('dayModal');
                const addModal = this.shadowRoot.getElementById('addHabitModal');
                const editModal = this.shadowRoot.getElementById('editHabitModal');
                const confirmModal = this.shadowRoot.getElementById('confirmModal');
                const colorModal = this.shadowRoot.getElementById('colorPickerModal');
                
                if (dayModal && dayModal.isOpen) dayModal._close();
                if (addModal && addModal.classList.contains('open')) addModal._close();
                if (editModal && editModal.classList.contains('open')) editModal._close();
                if (confirmModal && confirmModal.classList.contains('open')) confirmModal._close();
                if (colorModal && colorModal.classList.contains('open')) colorModal._close();
            }
        });
    }

    async _loadData() {
        try {
            console.log('Loading data from Firestore...');
            
            const habitsSnapshot = await window.db.collection('habits').get();
            this.habitsData = [];
            
            habitsSnapshot.forEach(doc => {
                this.habitsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            const entriesSnapshot = await window.db.collection('entries').get();
            this.entriesData = [];
            
            entriesSnapshot.forEach(doc => {
                this.entriesData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (this.habitsData.length === 0) {
                console.log('No habits found, using sample data...');
                this.habitsData = SAMPLE_HABITS;
            }
            
            console.log('Successfully loaded data:', {
                habits: this.habitsData.length,
                entries: this.entriesData.length
            });
            
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
            this.habitsData = SAMPLE_HABITS;
            if (this.currentUser) {
                this._showNotification('Using offline data', 'info');
            }
        }
    }
}

customElements.define('habit-tracker-app', HabitTrackerApp); 
