import { useState, useCallback } from 'react'
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

type TaskItemPropsT = {
  task_id: string
  taskName: string
  initialStatus: string
  open: boolean
  handleClose: () => void
  setDataChanged: (dataChanged: boolean) => void
}

const taskSchema = z.object({
  task_status: z.string().min(1, 'Task status is required')
})

export function TaskItem ({
  task_id,
  taskName,
  initialStatus,
  open,
  handleClose,
  setDataChanged
}: TaskItemPropsT) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [taskStatus, setTaskStatus] = useState(initialStatus)

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setTaskStatus(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const validatedData = taskSchema.parse({ task_status: taskStatus })
      setErrors({})

      await updateTaskStatus(validatedData)
      handleClose()
      setDataChanged(true)
      toast.success('Task status updated successfully!', {
        id: 'update-task-status-success-toast'
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
      toast.error('Failed to update task status. Please try again.', {
        id: 'update-task-status-error-toast'
      })
    }
  }

  const updateTaskStatus = useCallback(
    async (data: { task_status: string }) => {
      setIsLoading(true)
      try {
        const res = await Axios.put(`/api/tasks/${task_id}`, {
          status: data.task_status
        })
        console.log('Task status updated:', res.data)
      } catch (err: any) {
        const apiErrorMessage =
          err.response?.data?.message ||
          'Failed to update task status. Please try again.'
        setErrors(prev => ({ ...prev, api_response: apiErrorMessage }))
      } finally {
        setIsLoading(false)
      }
    },
    [task_id]
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle variant={'h4'}>Update Task Status</DialogTitle>
      <DialogContent>
        {errors.api_response && (
          <div
            style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}
          >
            {errors.api_response}
          </div>
        )}
        <TextField
          margin='dense'
          id='task_name'
          name='task_name'
          label='Task Name'
          type='text'
          fullWidth
          variant='outlined'
          value={taskName}
          disabled
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
          {isLoading ? 'Updating...' : 'Update'}
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
