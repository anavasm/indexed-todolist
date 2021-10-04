import { LitElement, html, css } from 'lit';
import Store from './store/store.js';
import './components/TodoInput.js';
import './components/TodoList.js';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class IndexedTodolist extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      todos: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        line-height: 1.4em;
        color: #4d4d4d;
        margin: 0 auto;
        text-align: center;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-weight: 300;
      }

      main {
        flex-grow: 1;
        background: #fff;
        margin: 200px 0 40px 0;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
          0 25px 50px 0 rgba(0, 0, 0, 0.1);
        min-width: 550px;
        max-width: 550px;
      }

      main h1 {
        position: absolute;
        top: -155px;
        width: 100%;
        font-size: 100px;
        font-weight: 100;
        text-align: center;
        color: rgba(175, 47, 47, 0.35);
        -webkit-text-rendering: optimizeLegibility;
        -moz-text-rendering: optimizeLegibility;
        text-rendering: optimizeLegibility;
      }
    `;
  }

  constructor() {
    super();
    this.todos = [];
  }

  async firstUpdated() {
    try {
      this.db = await new Store();
      const todos = await this.db.getAll();
      this.todos = todos;
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    return html`
      <main>
        <header>
          <h1>Todos</h1>
          <todo-input
            placeholder="hay algo por hacer?"
            @send-value=${this.addTodo}
          ></todo-input>
        </header>
        <section>
          <todo-list
            .todos=${this.todos}
            @todo-completed=${this.onTodoComplete}
            @todo-deleted=${this.onTodoDelete}
          ></todo-list>
        </section>
      </main>
    `;
  }

  addTodo({ detail }) {
    const newTodo = {
      completed: false,
      text: detail,
    };

    this.db.set(newTodo)
    .then((key) => {
      this.todos = [...this.todos, { key, ...newTodo}];
    })
    .catch((err) => console.error('Error', error));
  }

  async onTodoComplete({ detail }) {
    try {
      this.todos = this.todos.map((todo, index) => {
        if (index === detail.index) {
          return { ...todo, completed: detail.completed };
        }
        return todo;
      });

      const { key, ...values } = this.todos[detail.index];
      await this.db.update(key, values);
    } catch (error) {
      console.error(error);
    }
  }

  async onTodoDelete({ detail }) {
    try {
      await this.db.delete(this.todos[detail.index]?.key);

      this.todos = this.todos.filter((todo, index) => index !== detail.index);
    } catch (error) {
      console.error(error);
    }
  }
}
