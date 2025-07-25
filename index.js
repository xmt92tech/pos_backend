const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: 'https://pos-app-xm92techs-projects.vercel.app',
  credentials: true
}))

app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/invoices', require('./routes/invoices'));
app.use('/expenses', require('./routes/expenses'));
app.use('/category', require('./routes/categories'));
app.use('/suppliers', require('./routes/suppliers'));
app.use('/supplier-invoices', require('./routes/supplierInvoices'));


// app.get('/test', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Backend is running');
});

