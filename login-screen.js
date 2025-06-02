import { LitElement, html, css } from './base-component.js';

export class LoginScreen extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .login-title {
            font-size: 2.8em;
            font-weight: 800;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
        }

        .login-subtitle {
            font-size: 1.1em;
            margin-bottom: 30px;
            opacity: 0.8;
            text-align: center;
        }

        .person-selection {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            max-width: 600px;
            width: 100%;
        }

        .person-card {
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 16px;
            padding: 24px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .person-card:hover, .person-card:focus {
            transform: translateY(-3px);
            border-color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.2);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .person-avatar {
            font-size: 2.5em;
            margin-bottom: 8px;
        }

        .person-name {
            font-size: 1.2em;
            font-weight: 600;
            text-transform: capitalize;
        }

        .person-card.veda {
            border-color: #ff6b9d;
        }
        .person-card.veda:hover {
            border-color: #ff6b9d;
            box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
        }

        .person-card.radhika {
            border-color: #4ecdc4;
        }
        .person-card.radhika:hover {
            border-color: #4ecdc4;
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
        }

        .person-card.aravind {
            border-color: #45b7d1;
        }
        .person-card.aravind:hover {
            border-color: #45b7d1;
            box-shadow: 0 8px 25px rgba(69, 183, 209, 0.3);
        }

        @media (max-width: 480px) {
            .login-title {
                font-size: 2.2em;
            }
            
            .person-selection {
                grid-template-columns: 1fr;
                max-width: 300px;
            }
        }
    `;

    render() {
        return html`
            <h1 class="login-title">👨‍👩‍👧‍👦 Shivsai family habit tracker</h1>
            <p class="login-subtitle">Choose your profile to continue</p>
            
            <div class="person-selection">
                <div class="person-card veda" @click=${() => this._loginPerson('veda')}>
                    <div class="person-avatar">👧</div>
                    <div class="person-name">Veda</div>
                </div>
                
                <div class="person-card radhika" @click=${() => this._loginPerson('radhika')}>
                    <div class="person-avatar">👩</div>
                    <div class="person-name">Radhika</div>
                </div>
                
                <div class="person-card aravind" @click=${() => this._loginPerson('aravind')}>
                    <div class="person-avatar">👨</div>
                    <div class="person-name">Aravind</div>
                </div>
            </div>
        `;
    }

    _loginPerson(person) {
        this.dispatchEvent(new CustomEvent('user-login', {
            detail: { user: person },
            bubbles: true
        }));
    }
}

customElements.define('login-screen', LoginScreen); 