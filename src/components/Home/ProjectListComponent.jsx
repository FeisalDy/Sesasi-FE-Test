import React, { memo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'

export const ProjectListComponent = memo(({ data }) => {
  // console.log('ProjectListComponent', data);

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} href={`/projects/${data.id}`}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {data.name}
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {data.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})
