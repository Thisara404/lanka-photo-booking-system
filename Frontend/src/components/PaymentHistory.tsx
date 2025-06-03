import { useEffect, useState } from 'react';
import { PaymentService } from '../services/payment.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

type Payment = {
  _id: string;
  itemType: 'print' | 'booking' | 'preset';
  itemId: {
    _id: string;
    name?: string;
    title?: string;
  };
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
};

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await PaymentService.getPaymentHistory();
        if (response.status) {
          setPayments(response.data);
        } else {
          setError('Failed to load payment history');
        }
      } catch (err) {
        setError('Error loading payment history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  const getItemName = (payment: Payment) => {
    if (payment.itemType === 'print' && payment.itemId.name) {
      return `Print: ${payment.itemId.name}`;
    } else if (payment.itemType === 'preset' && payment.itemId.name) {
      return `Preset: ${payment.itemId.name}`;
    } else if (payment.itemType === 'booking') {
      return `Booking #${payment.itemId._id.substring(0, 8)}`;
    }
    return `${payment.itemType} #${payment.itemId._id.substring(0, 8)}`;
  };
  
  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    } else {
      return <Badge className="bg-red-500">Failed</Badge>;
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading payment history...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  
  if (payments.length === 0) {
    return <div className="text-center py-8">No payment history found.</div>;
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                {format(new Date(payment.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{getItemName(payment)}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentHistory;