import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import './App.css';

interface TodoProps {
  id: number,
  title: string,
  status: boolean
}

function App() {
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [state, setState] = React.useState<boolean>(false)
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [clickId, setClickId] = useState<number>(0);

  useEffect(() => {
    axios.get<TodoProps[]>('http://localhost:3000/get')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddTodo = () => {
    if (!newTodoTitle) {
      return;
    }
    axios.post('http://localhost:3000/post', { title: newTodoTitle })
      .then(response => {
        setTodos(todo => [...todo, response.data]);
        setNewTodoTitle('');
      })
      .catch(error => {
        console.error('Error adding new todo:', error);
      });
  };

  const handleDeleteTodo = (id: number) => () => {
    axios.delete(`http://localhost:3000/get/${id}`)
      .then(response => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const handleUpdateTitle = (id: number) => () => {
    setState(!state);
    if (!newTodoTitle) {
      setNewTodoTitle(todos.find(todo => todo.id === id)?.title || '')
      setClickId(id)
      return;
    }
    if (id !== clickId) {
      setNewTodoTitle('');
      setState(!state)
      return;
    }
    axios.put(`http://localhost:3000/post/${id}`, { title: newTodoTitle })
      .then(response => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, title: newTodoTitle };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setNewTodoTitle('');
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  }

  const handleUpdateTodo = (id: number) => () => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, status: !todo.status };
      }
      return todo;
    });

    axios.put(`http://localhost:3000/finish/${id}`)
      .then(response => {
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  const handleKeyDown = (event : React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (state) {
        handleUpdateTitle(clickId)();
      } else {
        handleAddTodo();
      }
    }
  };

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 500, padding: 3 }}>
        <CardContent >
          <Typography sx={{ fontSize: 42 }} color="text.secondary">Todo List</Typography>
          <TextField
            id="outlined-helperText"
            sx={{ mb: 2 }}
            label="To-do List"
            fullWidth
            value={newTodoTitle}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={state ? handleUpdateTitle(clickId) : handleAddTodo} >{state ? "Edit To-do list" : "+ ADD"}</Button>
          <Card sx={{ minWidth: 400, mt: 2 }}>
            <CardContent>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {todos.map((value) => {
                  const labelId = `checkbox-list-label-${value.id}`;
                  return (
                    <ListItem
                      key={value.id}
                      className={clickId === value.id ? (state ? 'blue-background' : 'normal-background') : undefined}
                      secondaryAction={
                        <Stack direction="row" >
                          <IconButton edge="end" aria-label="comments" onClick={handleUpdateTitle(value.id)}>
                            {clickId === value.id && (
                              state ? <ClearIcon style={{ color: "green" }} /> : <EditIcon style={{ color: "green" }} />
                            )}
                            {clickId !== value.id && <EditIcon style={{ color: "green" }} />}
                          </IconButton>
                          <IconButton edge="end" aria-label="comments" onClick={handleDeleteTodo(value.id)}>
                            <DeleteIcon style={{ color: "red" }} />
                          </IconButton>
                        </Stack>
                      }
                      disablePadding
                    >
                      <ListItemButton role={undefined} onClick={handleUpdateTodo(value.id)} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={value.status}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText sx={{ mr: 5 }} id={labelId} primary={value.title} style={{ textDecoration: value.status ? 'line-through' : 'none', overflow: 'auto' }} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

    </>
  )
}

export default App;
