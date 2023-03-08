import React, { useEffect, useState } from 'react';

// import { useNavigate } from 'react-router-dom';

import api, { setToken } from '../../axios/config';
import Loading from '../Loading';

import RenderSales from './RenderSales';

export default function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    async function getSales() {
      const { token } = JSON.parse(localStorage.getItem('user'));
      setToken(token);
      const response = await api.get('/seller/orders');
      setSales(response.data);
    }
    getSales();
  }, []);

  if (sales.length === 0) {
    return <Loading />;
  }

  return (
    <section>
      <div>
        {sales.map(({ id,
          status, saleDate, totalPrice, deliveryAddress, deliveryNumber }, index) => (
          (<RenderSales
            key={ index }
            id={ id }
            status={ status }
            saleDate={ saleDate }
            totalPrice={ totalPrice }
            deliveryAddress={ deliveryAddress }
            deliveryNumber={ deliveryNumber }
          />)
        ))}
      </div>
    </section>
  );
}
