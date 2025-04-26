import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Alert } from 'react-bootstrap';
import '../styles/AttendanceReport.css';
import api from '../config/axios';

const AttendanceReport = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/attendance/report?month=${month}&year=${year}`);
      setAttendanceData(response.data.data);
    } catch (err) {
      setError('Failed to fetch attendance report. Please try again.');
      console.error('Error fetching attendance report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceReport();
  }, [month, year]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <Container className="attendance-report-container">
      <h2 className="mb-4">Monthly Attendance Report</h2>
      
      <Form className="mb-4">
        <div className="d-flex gap-3">
          <Form.Group controlId="monthSelect">
            <Form.Label>Month</Form.Label>
            <Form.Select value={month} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="yearSelect">
            <Form.Label>Year</Form.Label>
            <Form.Select value={year} onChange={handleYearChange}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Present Days</th>
              <th>Absent Days</th>
              <th>Late Days</th>
              <th>Half Days</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.department}</td>
                <td>{record.present}</td>
                <td>{record.absent}</td>
                <td>{record.late}</td>
                <td>{record.halfDay}</td>
                <td>{record.attendancePercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AttendanceReport; 