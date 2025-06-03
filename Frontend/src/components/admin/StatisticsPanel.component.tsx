import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const sampleData = {
  monthlySales: [
    { month: 'Jan', presets: 4000, prints: 2400 },
    { month: 'Feb', presets: 3000, prints: 1398 },
    { month: 'Mar', presets: 2000, prints: 9800 },
    { month: 'Apr', presets: 2780, prints: 3908 },
    { month: 'May', presets: 1890, prints: 4800 },
    { month: 'Jun', presets: 2390, prints: 3800 },
    { month: 'Jul', presets: 3490, prints: 4300 },
    { month: 'Aug', presets: 3490, prints: 4300 },
    { month: 'Sep', presets: 3490, prints: 4300 },
    { month: 'Oct', presets: 3490, prints: 4300 },
    { month: 'Nov', presets: 3490, prints: 4300 },
    { month: 'Dec', presets: 3490, prints: 4300 },
  ],
  userActivity: [
    { name: 'Jan', visits: 4000, bookings: 2400 },
    { name: 'Feb', visits: 3000, bookings: 1398 },
    { name: 'Mar', visits: 2000, bookings: 9800 },
    { name: 'Apr', visits: 2780, bookings: 3908 },
    { name: 'May', visits: 1890, bookings: 4800 },
    { name: 'Jun', visits: 2390, bookings: 3800 },
  ],
  productDistribution: [
    { name: 'Presets', value: 400 },
    { name: 'Prints', value: 300 },
    { name: 'Bookings', value: 300 },
    { name: 'Other', value: 200 },
  ]
};

const StatisticsPanel = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sampleData.monthlySales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="presets" fill="#8884d8" name="Presets" />
                <Bar dataKey="prints" fill="#82ca9d" name="Prints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sampleData.userActivity}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Site Visits" />
                  <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleData.productDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPanel;