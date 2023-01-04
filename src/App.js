import React from 'react';

// Apollo imports
import { useQuery, gql } from '@apollo/client';

// VSIX imports
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Grid } from '@visx/grid';
import { scaleBand, scaleLinear } from '@visx/scale';

// Utils imports
import {
  width,
  height,
  background,
  margin,
  yMax,
  xMax,
  x,
  y,
  NavBar,
  Footer,
} from './utils';

const POSTS = gql`
  query PostsQuery($count: Int) {
    allPosts(count: $count) {
      createdAt
    }
  }
`;

const App = () => {
  const { data } = useQuery(POSTS, {
    variables: { count: 500 },
  });

  let objCount = {};

  if (data) {
    let dataAllPosts = data.allPosts;
    for (let i = 0; i < dataAllPosts.length; i++) {
      const date = new Date(Number(dataAllPosts[i]['createdAt']));
      let month = date.toString().slice(4, 7);
      if (!objCount[month]) {
        objCount[month] = 1;
      } else if (objCount[month]) {
        objCount[month] += 1;
      }
    }
  }

  // Data to show on Bar
  const myData = [
    { letter: 'A', frequency: objCount['Jan'] },
    { letter: 'B', frequency: objCount['Feb'] },
    { letter: 'C', frequency: objCount['Mar'] },
    { letter: 'D', frequency: objCount['Apr'] },
    { letter: 'E', frequency: objCount['May'] },
    { letter: 'F', frequency: objCount['Jun'] },
    { letter: 'G', frequency: objCount['Jul'] },
    { letter: 'H', frequency: objCount['Aug'] },
    { letter: 'I', frequency: objCount['Sep'] },
    { letter: 'K', frequency: objCount['Oct'] },
    { letter: 'L', frequency: objCount['Nov'] },
    { letter: 'M', frequency: objCount['Dec'] },
  ];

  //Scales
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: myData.map(x),
    padding: 0.4,
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...myData.map(y))],
  });

  const axisBottomScale = scaleBand({
    domain: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    range: [0, 755],
  });

  const gridScale = scaleLinear({
    domain: [Math.max(...Object.values(objCount)), 0],
    range: [0, 710],
  });

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => (data) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return (
    <div className='App'>
      <NavBar />
      <h1>GraphQL 2019 Posts</h1>

      <svg width={width + 100} height={height}>
        <rect width={width + 100} height={height} fill={background} rx={14} />
        <Group top={margin.top} left={margin.left + 70}>
          <text x={-700} y={-50} transform='rotate(-90)' fontSize={'1.5rem'}>
            Posts
          </text>
          <text x={-65} y={740} fontSize={'1.25rem'}>
            Months
          </text>
          <Grid
            numTicksRows={10}
            numTicksColumns={0}
            scale={gridScale}
            width={755}
            height={710}
            stroke='#000'
            strokeOpacity={0.4}
          />
          {myData.map((data, index) => {
            const barHeight = yMax - yPoint(data);
            return (
              <Bar
                key={index}
                x={xPoint(data)}
                y={String(yMax - barHeight)}
                height={String(barHeight)}
                width={xScale.bandwidth()}
                fill='#fc2e1c'
              />
            );
          })}
          <AxisLeft scale={gridScale} />
          <AxisBottom
            top={710}
            scale={axisBottomScale}
            stroke={'#000'}
            tickStroke={'#000'}
            tickLabelProps={() => ({
              fill: '#000',
              fontSize: 12,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>

      <Footer />
    </div>
  );
};

export default App;
