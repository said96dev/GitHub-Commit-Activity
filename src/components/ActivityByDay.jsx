import React from 'react'
import { Paper } from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const ActivityByDay = ({ data }) => {
  return (
    <Paper style={{ padding: 20, margin: '20px auto', maxWidth: 800 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="activityCount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export default ActivityByDay
