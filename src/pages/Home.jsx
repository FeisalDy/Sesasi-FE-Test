import { useState, useEffect } from 'react'
import Axios from '../utils/axios'
import { ProjectListComponent } from '../components/Home/ProjectListComponent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import { AddProjectForm } from '../components/Home/AddProjectForm'
import { usePagination } from '../hooks/usePagination'
import { LoadingSpinner } from '../components/Loading'

export function Home () {
  const [projects, setProjects] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [dataChanged, setDataChanged] = useState(false)

  useEffect(() => {
    fetchProjects()
    setDataChanged(false)
  }, [dataChanged])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const res = await Axios.get('/api/projects')
      setProjects(res.data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickOpen = () => setOpenDialog(true)
  const handleClose = () => setOpenDialog(false)

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProjects,
    handlePageChange
  } = usePagination(projects, 16)

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

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
        <Typography variant='h4'>All Projects</Typography>
        <Button variant='contained' onClick={handleClickOpen}>
          Add Project
        </Button>
      </Box>
      {error && (
        <Box sx={{ color: 'red', textAlign: 'center' }}>
          <Typography variant='body1'>Error: {error.message}</Typography>
        </Box>
      )}

      {projects.length === 0 ? (
        <Box
          minHeight={'65vh'}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Typography variant='h4'>No Projects</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={1}>
            {paginatedProjects.map(project => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProjectListComponent data={project} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        </>
      )}
      <AddProjectForm
        open={openDialog}
        handleClose={handleClose}
        setDataChanged={setDataChanged}
      />
    </>
  )
}
