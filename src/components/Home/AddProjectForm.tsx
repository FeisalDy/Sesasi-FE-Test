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
import { toast } from 'react-hot-toast'
import Box from '@mui/material/Box'

type AddProjectFormPropsT = {
  open: boolean
  handleClose: () => void
  setDataChanged: (dataChanged: boolean) => void
}

const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  project_description: z.string().min(1, 'Project description is required')
})

export function AddProjectForm ({
  open,
  handleClose,
  setDataChanged
}: AddProjectFormPropsT) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries())

    try {
      const validatedData = projectSchema.parse(formJson)
      setErrors({})
      await createProject(validatedData)
      handleClose()
      toast.success('Project created successfully!', {
        id: 'create-project-success-toast'
      })
      setDataChanged(true)
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
      toast.error('Failed to create project. Please try again.', {
        id: 'create-project-error-toast'
      })
    }
  }

  const createProject = async (data: {
    project_name: string
    project_description: string
  }) => {
    setIsLoading(true)
    try {
      const res = await Axios.post('/api/projects', {
        name: data.project_name,
        description: data.project_description
      })
      console.log('Project created:', res.data)
    } catch (err: any) {
      const apiErrorMessage =
        err.response?.data?.message ||
        'Failed to create project. Please try again.'
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
          id='project_name'
          name='project_name'
          label='Project Name'
          type='text'
          fullWidth
          variant='outlined'
          error={!!errors.project_name}
          helperText={errors.project_name}
        />
        <TextField
          margin='dense'
          id='project_description'
          name='project_description'
          label='Project Description'
          multiline
          rows={4}
          fullWidth
          variant='outlined'
          error={!!errors.project_description}
          helperText={errors.project_description}
        />
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
