const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

function list(searchText = '' , unaccomplishedOnly = false) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('data-todos.json')) {
        fs.writeFileSync('data-todos.json', '');
      }
  
      fs.readFile('data-todos.json', 'utf8', (err, data) => {
        if (err) reject(err);
        // console.log('listing todos...')
        let todos = data ? JSON.parse(data) : [];
        if (todos.length > 0 && unaccomplishedOnly) {
            todos = todos.filter((t) => {
                return !t.doneTs;
            });
        }
        if (todos.length > 0 && searchText) {
            todos = todos.filter((t) => {
                return t.text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            });
        }
        resolve(todos);
      });
  });
}

function create(mood, text) {
  return new Promise((resolve, reject) => {
    const newTodo = {
        id: uuidv4(),
        mood: mood,
        text: text,
        ts: moment().unix(),
        doneTs: null,
    };
    list().then((todos) => {
        todos = [newTodo, ...todos];
        fs.writeFile('data-todos.json', JSON.stringify(todos), (err) => {
            if (err) reject(err);
  
            resolve(newTodo);
        });
    });
    // const todos = [newTodo, ..._listTodos()];
    // localStorage.setItem(todoKey, JSON.stringify(todos));

    // return newTodo;
  });
}
function accomplish(todoId){
    console.log('server: model/todos.js -- accomplish')
    return new Promise((resolve, reject)=>{
        let accomplishTodo = null;
        list().then((todos) => {
        todos = todos.map((t) => {
            if (t.id === todoId) {
                accomplishTodo = t;
                t.doneTs = moment().unix();
            }
            return t;
        });

        fs.writeFile('data-todos.json', JSON.stringify(todos), (err) => {
            if (err) reject(err);

            resolve(accomplishTodo);
        });
        });
    });
}
module.exports = {
  list,
  create,
  accomplish,
};
