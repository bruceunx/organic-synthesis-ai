import { Flex } from '@chakra-ui/react'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from 'recharts'

const data = [
  {
    name: 1,
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 2,
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 3,
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 4,
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 5,
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 6,
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 7,
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

const LinePlot: React.FC = () => {
  return (
    <Flex p={7} width="100%" height="90%">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={150}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 17,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ stroke: 'gray', fontSize: 10 }}
            interval={2}
          >
            <Label value="时间(ms)" offset={1} position="bottom" />
          </XAxis>
          <YAxis
            yAxisId="left"
            label={{ value: '扭矩', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: '角度', angle: +90, position: 'insideRight' }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="pv"
            stroke="#2284d8"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amt"
            stroke="#8884d8"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Flex>
  )
}

export default LinePlot
