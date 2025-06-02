// Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyC_vmlSRAJM3vG5fpT1t1KPQgSYz_ibf5Q",
    authDomain: "family-habit-tracker.firebaseapp.com",
    projectId: "family-habit-tracker",
    storageBucket: "family-habit-tracker.firebasestorage.app",
    messagingSenderId: "266358836502",
    appId: "1:266358836502:web:cc10ad06b0792310dfd437"
};

// Color palette for categories
export const COLOR_PALETTE = [
    '#667eea', '#f093fb', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff6b6b', '#c44569', '#f8b500', '#6c5ce7', '#00cec9', '#fd79a8',
    '#fdcb6e', '#6c5ce7', '#00b894', '#e17055'
];

// Sample habits data
export const SAMPLE_HABITS = [
    { person: 'veda', category: 'Learning', habit: 'Reading', schedule: 'daily', required: true },
    { person: 'veda', category: 'Learning', habit: 'Math Practice', schedule: 'weekdays', required: true },
    { person: 'veda', category: 'Learning', habit: 'Piano', schedule: 'mon,wed,fri', required: true },
    { person: 'veda', category: 'Health', habit: 'Exercise', schedule: 'daily', required: true },
    { person: 'radhika', category: 'Fitness', habit: 'Yoga', schedule: 'daily', required: true },
    { person: 'radhika', category: 'Fitness', habit: 'Walking', schedule: 'daily', required: false },
    { person: 'radhika', category: 'Wellness', habit: 'Meditation', schedule: 'daily', required: true },
    { person: 'aravind', category: 'Exercise', habit: 'Push-ups', schedule: 'daily', required: true },
    { person: 'aravind', category: 'Exercise', habit: 'Running', schedule: 'mon,wed,fri', required: true },
    { person: 'aravind', category: 'Reading', habit: 'Technical Books', schedule: 'daily', required: true }
];

// User avatar mapping
export const USER_AVATARS = {
    veda: '👧',
    radhika: '👩',
    aravind: '👨'
}; 