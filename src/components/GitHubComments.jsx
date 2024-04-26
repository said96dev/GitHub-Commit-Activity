import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  CircularProgress,
} from '@mui/material'
import ActivityByDay from './ActivityByDay'

const GitHubComments = ({ owner, repo }) => {
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCommits, setTotalCommits] = useState(0)

  // eslint-disable-next-line
  useEffect(() => {
    fetchCommits()
  }, [owner, repo, page, rowsPerPage])

  const fetchCommits = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?page=${
          page + 1
        }&per_page=${rowsPerPage}`,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten')
      }
      const data = await response.json()
      setCommits(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      const totalCount = response.headers
        .get('Link')
        .match(/page=(\d+)>; rel="last"/)
      setTotalCommits(
        totalCount ? parseInt(totalCount[1]) * rowsPerPage : commits.length
      )
    } catch (error) {
      console.error('API Fehler:', error.message)
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getActivityData = () => {
    const activityMap = {}
    commits.forEach((commit) => {
      const date = new Date(commit.commit.committer.date).toLocaleDateString()
      if (activityMap[date]) {
        activityMap[date]++
      } else {
        activityMap[date] = 1
      }
    })
    const activityData = Object.keys(activityMap).map((date) => ({
      date,
      activityCount: activityMap[date],
    }))
    return activityData
  }
  if (loading) {
    return (
      <Box
        className="flex justify-center items-center"
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="p-5">
      <TableContainer
        style={{ padding: 20, margin: '0px auto', maxWidth: 1000 }}
        component={Paper}
        className="p-4 text-center"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-xl text-red">
                  Laden...
                </TableCell>
              </TableRow>
            ) : (
              commits.map((commit) => (
                <TableRow key={commit.sha} className="hover:bg-gray-100">
                  <TableCell>
                    {new Date(
                      commit.commit.committer.date
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{commit.commit.author.name}</TableCell>
                  <TableCell>{commit.commit.message}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          className="mt-4"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCommits}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ActivityByDay data={getActivityData()} />
    </div>
  )
}

export default GitHubComments
