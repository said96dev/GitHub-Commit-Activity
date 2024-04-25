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
} from '@mui/material'
import ActivityByDay from './ActivityByDay'

const GitHubComments = ({ owner, repo }) => {
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCommits, setTotalCommits] = useState(0)

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
      setLoading(false)

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

  return (
    <div className="App">
      <h1 className="bg-sky-500 text-3xl text-center py-4 mb-4">
        GitHub Commit Activity
      </h1>

      <TableContainer component={Paper} className="p-4">
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
                <TableCell colSpan={3} className="text-center">
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
      </TableContainer>
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

      <ActivityByDay data={getActivityData()} />
    </div>
  )
}

export default GitHubComments
