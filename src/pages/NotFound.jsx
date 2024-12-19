import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'

export function NotFound () {
  return (
    <Box
      minHeight={'65vh'}
      display='flex'
      flexDirection={'column'}
      justifyContent='center'
      alignItems='center'
    >
      <Typography variant='h3'>404 Not Found</Typography>
      <Button href='/' variant='contained' color='primary' sx={{ mt: 2 }}>
        Back To Home
      </Button>
    </Box>
  )
}
