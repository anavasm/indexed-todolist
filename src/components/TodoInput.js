import { html, css, LitElement } from 'lit-element';

export class TodoInput extends LitElement {
  static get properties() {
    return {
      placeholder: { type: String },
    };
  }

  static get styles() {
    return css`
      input::placeholder {
        font-style: italic;
        font-weight: 300;
        color: #a2a1a1;
      }

      input {
        padding: 16px 16px 16px 60px;
        background: rgba(0, 0, 0, 0.003);
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        color: inherit;
        border: 1px solid #999;
        box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 16px 16px 16px 60px;
        border: none;
        background: rgba(0, 0, 0, 0.003);
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
      }
    `;
  }

  render() {
    return html`
      <input
        id="todo-input"
        type="text"
        placeholder="${this.placeholder}"
        @keypress=${this.handleKeyPress}
      />
    `;
  }

  handleKeyPress({ key }) {
    if (key === 'Enter') {
      this.handleSend();
    }
  }

  handleSend() {
    const { value } = this.shadowRoot.querySelector('#todo-input');
    const event = new CustomEvent('send-value', { detail: value });
    this.dispatchEvent(event);
    this.resetInput();
  }

  resetInput() {
    this.shadowRoot.querySelector('#todo-input').value = '';
  }
}

customElements.define('todo-input', TodoInput);