import React, { useState, useRef, useEffect } from 'react';
import './Todo.css';
import { IoMdDoneAll } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';

function Todo() {
    const [todo, setTodo] = useState('');
    const [editId, setEditId] = useState(null);
   const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
        return JSON.parse(savedTodos);
    }

    return [];
});
    

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    localStorage.setItem("todos", JSON.stringify(todos));
}, [todo, todos]);

   
    const handleSubmit = (e) => {
        e.preventDefault();

        if (todo.trim() === '') {
            alert("Todo cannot be empty.");
            return;
        }

       
        const isDuplicate = todos.some((t) => t.list.trim().toLowerCase() === todo.trim().toLowerCase() && t.id !== editId);

        if (isDuplicate) {
            alert("Todo already exists.");
            return;
        }

        
        if (editId) {
            const updatedTodos = todos.map((t) =>
                t.id === editId ? { ...t, list: todo } : t
            );
            setTodos(updatedTodos);
            setEditId(null);
        } else {
            
            setTodos([...todos, { list: todo, id: Date.now(), status: false }]);
        }

        setTodo('');
    };

    const onDelete = (id) => {
        setTodos(todos.filter((t) => t.id !== id));
    };

    const onComplete = (id) => {
        const updatedTodos = todos.map((t) =>
            t.id === id ? { ...t, status: !t.status } : t
        );
        setTodos(updatedTodos);
    };

    const onEdit = (id) => {
        const editItem = todos.find((t) => t.id === id);
        setTodo(editItem.list);
        setEditId(editItem.id);
    };

    return  (
    <div className="container todo-container">

      <h2 className="mb-4">TODO APP</h2>

      <form
        className="d-flex flex-column flex-sm-row gap-2"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Enter your todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />

        <button type="submit" className="add-btn">
          {editId ? "UPDATE" : "ADD"}
        </button>
      </form>

      <div className="list mt-4">

        <ul className="p-0">

          {todos.map((to) => (

            <li className="list-items" key={to.id}>

              <div
                className={`list-item-list ${
                  to.status ? "completed" : ""
                }`}
              >
                {to.list}
              </div>

              <div className="icons">

                <IoMdDoneAll
                  id="complete"
                  className="list-item-icons"
                  onClick={() => onComplete(to.id)}
                />

                <FiEdit
                  id="edit"
                  className="list-item-icons"
                  onClick={() => onEdit(to.id)}
                />

                <MdDelete
                  id="delete"
                  className="list-item-icons"
                  onClick={() => onDelete(to.id)}
                />

              </div>

            </li>

          ))}

        </ul>

      </div>

    </div>
  );
}

export default Todo;
