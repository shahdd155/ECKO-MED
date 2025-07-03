# Backend API Documentation

## Dashboard Data Entry Endpoint

The frontend now expects the following API endpoint to provide dynamic dashboard data:

### GET `/api/dashboard/data-entry`

**Response Format:**
```json
{
  "userName": "John Mark",
  "totalPatients": 1834,
  "totalLabResults": 460,
  "patientOverviewData": [
    {
      "name": "Patients Number This Month",
      "series": [
        { "name": "Sat", "value": 12000 },
        { "name": "Sun", "value": 15000 },
        { "name": "Mon", "value": 20000 },
        { "name": "Tue", "value": 30858 },
        { "name": "Wed", "value": 25000 },
        { "name": "Thu", "value": 18000 },
        { "name": "Fri", "value": 17000 }
      ]
    },
    {
      "name": "Patients Number Last Month",
      "series": [
        { "name": "Sat", "value": 9000 },
        { "name": "Sun", "value": 11000 },
        { "name": "Mon", "value": 14000 },
        { "name": "Tue", "value": 17000 },
        { "name": "Wed", "value": 16000 },
        { "name": "Thu", "value": 15000 },
        { "name": "Fri", "value": 17000 }
      ]
    }
  ],
  "expensesData": [
    { "name": "Medications", "value": 60450 },
    { "name": "Scans and tests", "value": 75550 }
  ],
  "genderStats": {
    "male": 18454,
    "female": 4500
  }
}
```

### Implementation Notes:

1. **Base URL**: The frontend is configured to use `http://localhost:3000/api` as the base URL
2. **Fallback**: If the API call fails, the frontend will fall back to mocked data
3. **Loading State**: The frontend shows a loading spinner while fetching data
4. **Error Handling**: API errors are logged to the console

### Required Backend Implementation:

The backend should implement this endpoint to return real-time dashboard statistics including:
- Total patient count
- Total lab results count
- Patient overview chart data (weekly/monthly trends)
- Expense breakdown (medications vs scans/tests)
- Gender distribution statistics

### Environment Configuration:

Update the `src/app/core/environment/environment.ts` file to point to your actual backend API URL:

```typescript
export const environment = {
  baseUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api' // Update this to your backend URL
};
``` 