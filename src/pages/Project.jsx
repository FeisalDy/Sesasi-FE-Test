import { useParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Axios from '../utils/axios'
import { LoadingSpinner } from '../components/Loading'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { TaskListComponent } from '../components/Projects/TaskListComponent'
import { AddTaskForm } from '../components/Projects/AddTaskForm'
import { TaskItem } from '../components/Projects/TaskItem'
import { toast } from 'react-hot-toast'

export function Project () {
  const { id } = useParams()
  const [project, setProject] = useState({})
  const [projectTasks, setProjectTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [dialogState, setDialogState] = useState({
    type: null,
    open: false,
    task: null
  })

  const fetchProject = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await Axios.get(`/api/projects/${id}`)
      const tasksByStatus = {
        todo: data.tasks.filter(task => task.status === 'To Do'),
        inProgress: data.tasks.filter(task => task.status === 'In Progress'),
        completed: data.tasks.filter(task => task.status === 'Completed')
      }
      setProject(data)
      setProjectTasks(tasksByStatus)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const openDialog = (type, task = null) => {
    if (type === 'edit' && task) {
      setDialogState({
        type,
        open: true,
        task: {
          task_id: task.id,
          taskName: task.name,
          initialStatus: task.status
        }
      })
    } else {
      setDialogState({ type, open: true, task })
    }
  }

  const closeDialog = () => {
    setDialogState({ type: null, open: false, task: null })
  }

  if (isLoading) {
    return (
      <Box
        minHeight={'65vh'}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <LoadingSpinner />
      </Box>
    )
  }

  if (error) {
    return <Typography color='error'>Error: {error.message}</Typography>
  }

  return (
    <>
      <Box sx={{ p: 4, width: '100%' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              {project.name}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              {project.description}
            </Typography>
          </Box>
          <Box>
            <Button
              variant='contained'
              color='primary'
              onClick={() => openDialog('new')}
            >
              New Task
            </Button>
          </Box>
        </Box>

        <TaskListComponent
          tasks={projectTasks}
          onEditTask={task => openDialog('edit', task)}
        />

        {dialogState.type === 'new' && (
          <AddTaskForm
            open={dialogState.open}
            handleClose={closeDialog}
            setDataChanged={fetchProject}
            id={id}
          />
        )}

        {dialogState.type === 'edit' && (
          <TaskItem
            open={dialogState.open}
            task_id={dialogState.task.task_id}
            taskName={dialogState.task.taskName}
            initialStatus={dialogState.task.initialStatus}
            handleClose={closeDialog}
            setDataChanged={fetchProject}
          />
        )}
      </Box>
    </>
  )
}
