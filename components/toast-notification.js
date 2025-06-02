import { LitElement, html, css } from './base-component.js';

export class ToastNotification extends LitElement {
    constructor() {
        super();
        this.message = '';
        this.type = 'success';
    }

    static get properties() {
        return {
            message: { type: String },
            type: { type: String }
        };
    }

    static get styles() {
        return css`
            :host {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }

            :host(.show) {
                opacity: 1;
                transform: translateX(0);
            }

            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                min-width: 280px;
            }

            .toast-content.success {
                border-left: 4px solid #22c55e;
            }

            .toast-content.error {
                border-left: 4px solid #ef4444;
            }

            .toast-content.info {
                border-left: 4px solid #3b82f6;
            }

            .toast-icon {
                font-size: 1.2em;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .toast-message {
                font-size: 0.9em;
                font-weight: 500;
                color: white;
            }

            @media (max-width: 768px) {
                :host {
                    top: 16px;
                    right: 16px;
                    left: 16px;
                }
                
                .toast-content {
                    min-width: auto;
                }
            }
        `;
    }

    render() {
        let icon = '';
        if (this.type === 'success') {
            icon = '✓';
        } else if (this.type === 'error') {
            icon = '✗';
        } else {
            icon = 'i';
        }

        return html`
            <div class="toast-content ${this.type}">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${this.message}</span>
            </div>
        `;
    }

    show(message, type = 'success') {
        this.message = message;
        this.type = type;
        this.classList.add('show');
        
        setTimeout(() => {
            this.classList.remove('show');
        }, 4000);
    }
}

customElements.define('toast-notification', ToastNotification); 