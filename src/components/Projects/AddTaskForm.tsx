import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { grey } from '@mui/material/colors'
import { z } from 'zod'
// @ts-ignore
import Axios from '../../utils/axios'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { toast } from 'react-hot-toast'
import { Box } from '@mui/material'

type AddTaskFormPropsT = {
  id: string
  open: boolean
  handleClose: () => void
  setDataChanged: (dataChanged: boolean) => void
}

const projectSchema = z.object({
  task_name: z.string().min(1, 'Task name is required'),
  task_status: z.string().min(1, 'Task status  is required')
})

export function AddTaskForm ({
  id,
  open,
  handleClose,
  setDataChanged
}: AddTaskFormPropsT) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [taskStatus, setTaskStatus] = useState('To Do')

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setTaskStatus(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries())

    try {
      const validatedData = projectSchema.parse({
        ...formJson,
        task_status: taskStatus
      })
      setErrors({})
      await createTask(validatedData)
      handleClose()
      setDataChanged(true)
      toast.success('Task created successfully!', {
        id: 'create-task-success-toast'
      })
    } catch (error) {
      handleValidationError(error)
    }
  }

  const handleValidationError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      toast.error('Failed to create task. Please try again.', {
        id: 'create-task-error-toast'
      })
    }
  }

  const createTask = async (data: {
    task_name: string
    task_status: string
  }) => {
    setIsLoading(true)
    try {
      const res = await Axios.post(`/api/projects/${id}/tasks`, {
        name: data.task_name,
        status: data.task_status
      })
      console.log('Task created:', res.data)
    } catch (err: any) {
      const apiErrorMessage =
        err.response?.data?.message ||
        'Failed to create task. Please try again.'
      setErrors({ api_response: apiErrorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle variant={'h4'}>Create New Project</DialogTitle>
      <DialogContent>
        {errors.api_response && (
          <Box sx={{ color: 'red', mb: 2, textAlign: 'center' }}>
            {errors.api_response}
          </Box>
        )}
        <TextField
          autoFocus
          margin='dense'
          id='task_name'
          name='task_name'
          label='Task Name'
          type='text'
          fullWidth
          variant='outlined'
          error={!!errors.project_name}
          helperText={errors.project_name}
        />
        <InputLabel id='task-status-label'>Status</InputLabel>
        <Select
          labelId='task-status-label'
          id='task-status'
          label='Status'
          value={taskStatus}
          onChange={handleStatusChange}
          fullWidth
        >
          <MenuItem value='To Do'>To Do</MenuItem>
          <MenuItem value='In Progress'>In Progress</MenuItem>
          <MenuItem value='Completed'>Completed</MenuItem>
        </Select>
        {errors.task_status && (
          <div style={{ color: 'red', marginTop: '8px' }}>
            {errors.task_status}
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: 'column',
          padding: '24px',
          paddingTop: '0px',
          gap: '8px'
        }}
      >
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
          onClick={handleClose}
          fullWidth
          variant='contained'
          style={{ backgroundColor: grey[900], margin: '0px' }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
