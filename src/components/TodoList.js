import { LitElement, html, css } from 'lit-element';

export class TodoList extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
    };
  }

  static get styles() {
    return css`
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      ul li {
        position: relative;
        font-size: 24px;
        border-bottom: 1px solid #ededed;
      }

      ul li:last-child {
        border-bottom: none;
      }

      .toggle {
        text-align: center;
        width: 40px;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        border: none;
        -webkit-appearance: none;
        appearance: none;
        opacity: 0;
      }

      .toggle + label {
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
        background-repeat: no-repeat;
        background-position: center left;
      }

      .toggle:checked + label {
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
      }

      li label {
        text-align: left;
        word-break: break-all;
        padding: 15px 15px 15px 60px;
        display: block;
        line-height: 1.2;
        transition: color 0.4s;
      }

      li label.completed {
        color: #b3b3b3;
        text-decoration: line-through;
      }

      li .delete {
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
      }

      li .delete:hover {
        color: #af5b5e;
      }

      li .delete:after {
        content: '×';
      }

      li:hover .delete {
        display: block;
      }

      button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        font-size: 100%;
        vertical-align: baseline;
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
        -webkit-appearance: none;
        appearance: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `;
  }

  render() {
    return html`
      <ul>
        ${this.todos.map(
          ({ completed, text }, index) =>
            html`<li>
              <input
                @click=${() => this.handleCheck(index)}
                class="toggle"
                type="checkbox"
                ?checked=${completed}
              />
              <label class="${completed ? 'completed' : ''}">${text}</label
              ><button
                @click=${() => this.handleDelete(index)}
                class="delete"
              ></button>
            </li>`
        )}
      </ul>
    `;
  }

  handleCheck(index) {
    const { completed } = this.todos[index];

    const event = new CustomEvent('todo-completed', {
      detail: { index, completed: !completed },
    });
    this.dispatchEvent(event);
  }

  handleDelete(index) {
    const event = new CustomEvent('todo-deleted', {
      detail: { index },
    });
    this.dispatchEvent(event);
  }
}

customElements.define('todo-list', TodoList);