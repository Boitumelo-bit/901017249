import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

import food1 from './assets/food1.jpg';
import food2 from './assets/food2.jpg';
import food3 from './assets/food3.jpg';
import food4 from './assets/food4.jpg';
import food5 from './assets/food5.jpg';
import food6 from './assets/food6.jpg';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [food1, food2, food3, food4, food5, food6];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const graphData = products.map((product) => ({
    name: product.name,
    quantity: product.quantity,
  }));

  const styles = {
    dashboard: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#333',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '750px',
      margin: 'auto',
    },
    heading: {
      textAlign: 'center',
      color: '#333',
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    imageFlexContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      margin: '20px 0',
    },
    carouselImage: {
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '50%',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.5s ease-in-out',
    },
    carouselImageHover: {
      transform: 'scale(1.05)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: '#ffe9a3',
      color: '#333',
      textAlign: 'left',
      padding: '8px',
    },
    tableRow: {
      borderBottom: '1px solid #ddd',
    },
    tableData: {
      padding: '8px',
    },
  };

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Dashboard - Current Stock Levels</h2>

      <div style={styles.chartContainer}>
        <BarChart width={700} height={400} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#fc9724af" />
        </BarChart>
      </div>

      <div style={styles.imageFlexContainer}>
        <img
          src={images[currentImageIndex]}
          alt={`Food ${currentImageIndex + 1}`}
          style={styles.carouselImage}
        />
        <img
          src={images[currentImageIndex]}
          alt={`Food ${currentImageIndex + 1}`}
          style={styles.carouselImage}
        />
        <img
          src={images[currentImageIndex]}
          alt={`Food ${currentImageIndex + 1}`}
          style={styles.carouselImage}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Product Name</th>
            <th style={styles.tableHeader}>Quantity in Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} style={styles.tableRow}>
                <td style={styles.tableData}>{product.name}</td>
                <td style={styles.tableData}>{product.quantity}</td>
              </tr>
            ))
          ) : (
            <tr style={styles.tableRow}>
              <td colSpan="2" style={{ ...styles.tableData, textAlign: 'center' }}>
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
