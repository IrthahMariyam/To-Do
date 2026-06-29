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
    }, [todo],[todos]);

   
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

    return (
        <div className='container'>
            <h2>TODO APP</h2>
            <form className='form-group' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={todo}
                    ref={inputRef}
                    placeholder='Enter your todo'
                    className='form-control'
                    onChange={(e) => setTodo(e.target.value)}
                />
                <button type="submit">
                    {editId ? 'UPDATE' : 'ADD'}
                </button>
            </form>

            <div className='list'>
                <ul>
                    {todos.map((to) => (
                        <li className='list-items' key={to.id}>
                            <div
                                className='list-item-list'
                                id={to.status ? 'list-item' : null}
                            >
                                {to.list}
                            </div>
                            <span>
                                <IoMdDoneAll
                                    className='list-item-icons'
                                    id='complete'
                                    title='Complete'
                                    onClick={() => onComplete(to.id)}
                                />
                                <FiEdit
                                    className='list-item-icons'
                                    id='edit'
                                    title='Edit'
                                    onClick={() => onEdit(to.id)}
                                />
                                <MdDelete
                                    className='list-item-icons'
                                    id='delete'
                                    title='Delete'
                                    onClick={() => onDelete(to.id)}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Todo;
