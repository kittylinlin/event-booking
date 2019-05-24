import React from 'react';
import { Bar } from 'react-chartjs';
import PropTypes from 'prop-types';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 99999999,
  },
};

const bookingChart = (props) => {
  const { bookings } = props;
  const chartData = {
    labels: [],
    datasets: [],
  };
  let values = [];
  Object.keys(BOOKINGS_BUCKETS).forEach((key) => {
    const filteredBookingsCount = bookings.reduce((acc, cur) => {
      if (
        cur.event.price < BOOKINGS_BUCKETS[key].max
        && cur.event.price >= BOOKINGS_BUCKETS[key].min
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(key);
    chartData.datasets.push({
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  });
  console.log(chartData);
  return (
    <div style={{ textAlign: 'center' }}>
      <Bar
        data={chartData}
      />
    </div>
  );
};

bookingChart.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default bookingChart;
