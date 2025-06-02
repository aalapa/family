import { LitElement, html, css, property, state } from './base-component.js';
import { getTextColor } from './base-component.js';
import { COLOR_PALETTE } from '../config/constants.js';

export class ColorPickerModal extends LitElement {
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
            padding: 30px;
            max-width: 400px;
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
            text-align: center;
            margin-bottom: 20px;
        }

        .modal-header h3 {
            color: white;
            margin: 0;
            font-size: 1.2em;
            font-weight: 600;
        }

        .color-options {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
        }

        .color-option {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1em;
            font-weight: bold;
        }

        .color-option:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .color-option.selected {
            border: 3px solid #fff;
            box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
        }

        .custom-color-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }

        .custom-color-label {
            display: block;
            margin-bottom: 8px;
            color: white;
            font-size: 0.9em;
            font-weight: 500;
        }

        .custom-color-input {
            width: 100%;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .custom-color-input:hover,
        .custom-color-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .modal-footer {
            text-align: center;
            margin-top: 20px;
        }

        .close-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .close-btn:hover {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
        }

        @media (max-width: 768px) {
            .modal-content {
                max-width: 90%;
                padding: 20px;
            }
            
            .color-option {
                width: 35px;
                height: 35px;
            }
        }
    `;

    @property({ type: String }) categoryName = '';
    @property({ type: String }) currentColor = '';
    @state() selectedColor = '';

    render() {
        return html`
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Choose Color for "${this.categoryName}"</h3>
                </div>
                
                <div class="color-options">
                    ${COLOR_PALETTE.map(color => {
                        const textColor = getTextColor(color);
                        const isSelected = this.selectedColor === color;
                        
                        return html`
                            <button class="color-option ${isSelected ? 'selected' : ''}"
                                    style="background: ${color}; color: ${textColor}; border: 2px solid ${isSelected ? '#fff' : 'transparent'};"
                                    @click=${() => this._selectColor(color)}
                                    title="${color}">
                                ${isSelected ? '✓' : ''}
                            </button>
                        `;
                    })}
                </div>

                <div class="custom-color-section">
                    <label class="custom-color-label" for="customColorPicker">
                        Or choose a custom color:
                    </label>
                    <input type="color" 
                           id="customColorPicker"
                           class="custom-color-input"
                           .value=${this.selectedColor}
                           @input=${this._onCustomColorChange}
                           @change=${this._onCustomColorChange}>
                </div>

                <div class="modal-footer">
                    <button class="close-btn" @click=${this._close}>Close</button>
                </div>
            </div>
        `;
    }

    open(categoryName, currentColor) {
        this.categoryName = categoryName;
        this.currentColor = currentColor;
        this.selectedColor = currentColor;
        
        this.classList.add('open');
        this.requestUpdate();
    }

    _close() {
        this.classList.remove('open');
    }

    _selectColor(color) {
        this.selectedColor = color;
        this._updateColor();
    }

    _onCustomColorChange(e) {
        this.selectedColor = e.target.value;
        this._updateColor();
    }

    _updateColor() {
        this.dispatchEvent(new CustomEvent('color-selected', {
            detail: { 
                categoryName: this.categoryName, 
                color: this.selectedColor 
            },
            bubbles: true
        }));
    }
}

customElements.define('color-picker-modal', ColorPickerModal); 