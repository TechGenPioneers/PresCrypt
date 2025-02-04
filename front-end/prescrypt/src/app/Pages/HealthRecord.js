import React from 'react';
import './HealthRecord.css';

const HealthRecord = () => {
  const appointmentData = [
    {
      appointedDoctor: 'DR KASUN FERNANDO',
      hospitalName: 'Durdans Hospital',
      appointedType: 'Physiotherapy',
      checkedIn: 'YES',
      date: '2020/06/28',
      time: '1:00 PM'
    },
    {
      appointedDoctor: 'DR NIRMAL EKANAYAKE',
      hospitalName: 'Asiri Hospital',
      appointedType: 'Eye treatment',
      checkedIn: 'CANCELLED',
      date: '2020/07/01',
      time: '3:00 PM'
    },
    {
      appointedDoctor: 'DR SHEHAN ALWIS',
      hospitalName: 'Asiri Hospital',
      appointedType: 'Cancer treatment',
      checkedIn: 'YES',
      date: '2020/07/07',
      time: '2:00 PM'
    },
    {
      appointedDoctor: 'DR KASUN FERNANDO',
      hospitalName: 'Durdans Hospital',
      appointedType: 'Physiotherapy',
      checkedIn: 'NO',
      date: '2020/07/03',
      time: '3:00 PM'
    },
    {
      appointedDoctor: 'DR KASUN FERNANDO',
      hospitalName: 'Durdans Hospital',
      appointedType: 'Physiotherapy',
      checkedIn: 'YES',
      date: '2020/07/06',
      time: '4:00 PM'
    }
  ];

  return (
    <div>
      <h2>Medical History</h2>
      <div>
        <p>Ms Kayle Fernando</p>
        <p>24 years old</p>
        <p>Colombo</p>
      </div>
      <div>
        <p>Total No. of Appointments: 14</p>
        <p>Accepted Appointments: 11</p>
        <p>Cancelled Appointments: 3</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Appointed Doctor</th>
            <th>Hospital Name</th>
            <th>Appointed Type</th>
            <th>Checked In</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {appointmentData.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.appointedDoctor}</td>
              <td>{appointment.hospitalName}</td>
              <td>{appointment.appointedType}</td>
              <td>{appointment.checkedIn}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Load more...</button>
    </div>
  );
};

export default HealthRecord;