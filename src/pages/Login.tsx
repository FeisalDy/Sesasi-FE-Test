import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormHelperText
} from '@mui/material'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode('test-saja')

async function generateToken (payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET_KEY)

  console.log('Generated Token:', token)
  return token
}

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export function Login () {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loginError, setLoginError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries())

    try {
      const validatedData = loginSchema.parse(formJson)
      setErrors({})

      if (
        validatedData.username === 'admin' &&
        validatedData.password === 'admin'
      ) {
        const token = await generateToken({ username: 'admin' })
        localStorage.setItem('jwtToken', token)
        navigate('/')
        console.log('Login success')
      } else {
        setLoginError('Invalid username or password')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: '400px',
        margin: '0 auto',
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant='h5' textAlign='center'>
        Login
      </Typography>
      <TextField
        autoFocus
        margin='dense'
        id='username'
        name='username'
        label='Username'
        type='text'
        fullWidth
        variant='outlined'
        error={!!errors.username}
        helperText={errors.username}
      />
      <TextField
        margin='dense'
        id='password'
        name='password'
        label='Password'
        type='password'
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        variant='outlined'
      />
      {loginError && (
        <FormHelperText error sx={{ textAlign: 'center' }}>
          {loginError}
        </FormHelperText>
      )}
      <Button type='submit' variant='contained' color='primary' fullWidth>
        Login
      </Button>
    </Box>
  )
}

// export const Login = () => {
//   return <>ts</>
// }
