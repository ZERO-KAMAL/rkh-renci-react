import { Box } from '@mui/material'
import { useClientSize } from 'app/helpers/CommonFunction'
import { FC, memo, useRef } from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'

const COLORS = ['#8950FC', '#3699FF', '#F1416C', '#2BA579']

interface Props {
  data: { name: string; value: number; color: string; label: string }[]
  total: number
}

const SimplePieChart: FC<Props> = (props: Props) => {
  const { data, total } = props
  const ref = useRef<any>(null)
  const size = useClientSize(ref, 226)
  const { width } = size

  return (
    <Box ref={ref}>
      <PieChart {...size}>
        <Pie
          data={data}
          cx={width / 2}
          cy={113}
          startAngle={90}
          endAngle={-270}
          innerRadius={60}
          outerRadius={80}
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label value={total} position='center' />
        </Pie>
        {total === 0 && (
          <Pie
            data={[{ name: 'No Data', value: 1 }]}
            cx={width / 2}
            cy={113}
            startAngle={90}
            endAngle={-270}
            innerRadius={60}
            outerRadius={80}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={'#cecece'} />
            ))}
            <Label value={total} position='center' />
          </Pie>
        )}
      </PieChart>
    </Box>
  )
}

export default memo(SimplePieChart)
