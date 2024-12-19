import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { grey } from '@mui/material/colors'

export function TaskListComponent ({ tasks, onEditTask }) {
  return (
    <Box>
      <Box>
        <Typography variant='h5' sx={{ mb: 2 }}>
          To Do
        </Typography>
        {renderTaskList(tasks.todo, 'To Do', onEditTask)}
      </Box>

      <Box>
        <Typography variant='h5' sx={{ mb: 2 }}>
          In Progress
        </Typography>
        {renderTaskList(tasks.inProgress, 'In Progress', onEditTask)}
      </Box>

      <Box>
        <Typography variant='h5' sx={{ mb: 2 }}>
          Completed
        </Typography>
        {renderTaskList(tasks.completed, 'Completed', onEditTask)}
      </Box>
    </Box>
  )
}

const renderTaskList = (tasks, section, onEditTask) => (
  <Box>
    {tasks.length === 0 ? (
      <Paper sx={{ p: 2, mb: 1 }}>
        <Typography>No Tasks {section}</Typography>
      </Paper>
    ) : (
      tasks.map(task => (
        <Paper
          key={task.id}
          sx={{
            p: 2,
            mb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography>{task.name}</Typography>
          <Button
            variant='contained'
            size='small'
            style={{ backgroundColor: grey[900] }}
            onClick={() => onEditTask(task)}
          >
            Update
          </Button>
        </Paper>
      ))
    )}
  </Box>
)
