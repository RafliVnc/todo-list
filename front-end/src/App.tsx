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
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import axios from "axios";
import './App.css';

interface Todo {
  title: string;
  status: boolean
}

function App() {
  const [todos, setTodos] = React.useState<Array<any>>([])
  const [newTodoTitle, setNewTodoTitle] = React.useState<string>('');

  React.useEffect(() => {
    axios.get('http://localhost:3000/get')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddTodo = () => {
    const newTodo: Todo = {
      title: newTodoTitle,
      status: false,
    };
    axios.post('http://localhost:3000/post', newTodo)
      .then(response => {
        window.location.reload()
      })
      .catch(error => {
        console.error('Error adding new todo:', error);
      });
  };

  const handleDeleteTodo = (id: number) =>()=> {
    axios.delete(`http://localhost:3000/get/${id}`)
      .then(response => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

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

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 500,padding:3 }}>
        <CardContent >
          <Typography sx={{ fontSize: 42 }} color="text.secondary">Todo List</Typography>
          <Stack spacing={1} sx={{ width: 300 }}>
            <TextField
              id="outlined-helperText"
              label="To-do List"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddTodo}>+ ADD</Button>
          </Stack>
          <Card sx={{ maxWidth: 300, mt: 2 }}>
            <CardContent>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {todos.map((value) => {
                  const labelId = `checkbox-list-label-${value.id}`;

                  return (
                    <ListItem
                      key={value.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="comments" onClick={handleDeleteTodo(value.id)}>
                          <DeleteIcon style={{ color: "red" }} />
                        </IconButton>
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
                        <ListItemText id={labelId} primary={value.title} style={{ textDecoration: value.status ? 'line-through' : 'none' }} />
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

export default App
