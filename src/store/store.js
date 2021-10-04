const DB_NAME = 'todoApp';
const STORE_NAME = 'todos';
const DB_VERSION = 1;

export default class Store {
  constructor() {
    this.db = null;

    return new Promise((resolve, reject) => {

      if (!('indexedDB' in window)) reject('IndexedDB not supported');

      const dbOpen = indexedDB.open(DB_NAME, DB_VERSION);

      dbOpen.onupgradeneeded = function (e) {
        this.db = dbOpen.result;

        if(e.oldVersion < 1) {
          this.db.createObjectStore(STORE_NAME, { autoIncrement: true });
        }
      };

      dbOpen.onsuccess = () => {
        this.db = dbOpen.result;
        resolve(this);
      };

      dbOpen.onerror = e => {
        reject(`IndexedDB error: ${ e.target.errorCode }`);
      };

    });
  }

  set(record) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let newKey = null;
      
      store.add(record).onsuccess = (e) => {
        newKey = e.target.result;
      }

      transaction.oncomplete = () => {
        resolve(newKey);
      }

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      store.delete(key);

      transaction.oncomplete = (e) => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  update(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // write record
      store.put(value, key);

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.openCursor();
      const results = [];
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          results.push({ key: cursor.primaryKey, ...cursor.value});
          cursor.continue();
        } else {
          resolve(results);
        }
      }

      store.onerror = function (event) {
        reject(event);
      };

      transaction.onerror = event => {
        reject(event.target.value);
      };
    });
  }


}