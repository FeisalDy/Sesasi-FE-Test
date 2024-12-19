import * as React from 'react'
import Container from '@mui/material/Container'
import DrawerAppBar from './components/NavBar'
import ToastMessage from './components/Toast'
import { Box } from '@mui/material'
export default function Layout ({ children }) {
  return (
    <>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Container fixed maxWidth='lg'>
          <DrawerAppBar />
          {children}
          <ToastMessage />
        </Container>
      </Box>
    </>
  )
}
