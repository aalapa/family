import { LitElement, html, css, property, state } from './base-component.js';

export class ConfirmModal extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2500;
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
            max-width: 380px;
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
            color: rgba(255,255,255,0.9);
            line-height: 1.5;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px 24px 24px;
            border-top: 1px solid rgba(255,255,255,0.1);
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

        .danger-btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .danger-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
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

    @state() title = 'Confirm Action';
    @state() message = 'Are you sure you want to proceed?';
    @state() confirmText = 'Confirm';
    @state() cancelText = 'Cancel';
    @state() isDanger = false;
    @state() confirmCallback = null;

    render() {
        return html`
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.title}</h3>
                    <button class="close-btn" @click=${this._close}>&times;</button>
                </div>
                
                <div class="modal-body">
                    <p>${this.message}</p>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click=${this._close}>${this.cancelText}</button>
                    <button class="${this.isDanger ? 'danger-btn' : 'confirm-btn'}" 
                            @click=${this._confirm}>
                        ${this.confirmText}
                    </button>
                </div>
            </div>
        `;
    }

    show(options = {}) {
        this.title = options.title || 'Confirm Action';
        this.message = options.message || 'Are you sure you want to proceed?';
        this.confirmText = options.confirmText || 'Confirm';
        this.cancelText = options.cancelText || 'Cancel';
        this.isDanger = options.isDanger || false;
        this.confirmCallback = options.onConfirm || null;
        
        this.classList.add('open');
        this.requestUpdate();
    }

    _close() {
        this.classList.remove('open');
        this.confirmCallback = null;
    }

    _confirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this._close();
    }
}

customElements.define('confirm-modal', ConfirmModal); 