import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    Checkbox, 
    IconButton, 
    Paper 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // primary blue
        },
    },
});

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return; // Prevent adding empty tasks
        await axios.post('http://localhost:5000/tasks', {
            title: newTaskTitle,
            description: newTaskDescription,
        });
        setNewTaskTitle('');
        setNewTaskDescription('');
        fetchTasks();
    };

    const handleUpdateTask = async (task) => {
        await axios.put(`http://localhost:5000/tasks/${task.id}`, {
            ...task,
            completed: !task.completed,
        });
        fetchTasks();
    };

    const handleDeleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        fetchTasks();
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>Task Manager</Typography>
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                    <TextField
                        fullWidth
                        label="Task Title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Task Description"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddTask}>
                        Add Task
                    </Button>
                </Paper>
                <List>
                    {tasks.map((task) => (
                        <ListItem key={task.id} style={{ borderBottom: '1px solid #eee' }}>
                            <Checkbox
                                checked={task.completed}
                                onChange={() => handleUpdateTask(task)}
                            />
                            <Typography variant="body1" style={{ flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.title} - {task.description}
                            </Typography>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </ThemeProvider>
    );
}

export default App;