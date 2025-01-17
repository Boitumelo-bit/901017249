import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
      setMessage('Product deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const editProduct = (index) => {
    setCurrentProductIndex(index);
    setCurrentProduct({ ...products[index] });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = { ...currentProduct };

    try {
      const response = await fetch(`http://localhost:5000/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      const updatedProducts = [...products];
      updatedProducts[currentProductIndex] = data;
      setProducts(updatedProducts);
      setIsEditing(false);
      setMessage('Product updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      marginTop: '20px',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      padding: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableRow: {
      textAlign: 'center',
    },
    tableData: {
      padding: '12px',
      color: '#ffa600',
    },
    input: {
      padding: '10px',
      margin: '15px 0',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      margin: '5px', // Padding between buttons
      color: '#ffa600',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Product List</h2>
      {message && <div style={{ color: '#4CAF50', marginBottom: '20px' }}>{message}</div>}

      <input
        type="text"
        style={styles.input}
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} placeholder="Product Name" required style={styles.input} />
          <input type="text" name="description" value={currentProduct.description} onChange={handleInputChange} placeholder="Description" required style={styles.input} />
          <input type="text" name="category" value={currentProduct.category} onChange={handleInputChange} placeholder="Category" required style={styles.input} />
          <input type="number" name="price" value={currentProduct.price} onChange={handleInputChange} placeholder="Price" required style={styles.input} />
          <input type="number" name="quantity" value={currentProduct.quantity} onChange={handleInputChange} placeholder="Quantity" required style={styles.input} />
          <button type="submit" style={{ ...styles.button, backgroundColor: '#000' }}>Update Product</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Product Name</th>
            <th style={styles.tableHeader}>Description</th>
            <th style={styles.tableHeader}>Category</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr key={product.id} style={styles.tableRow}>
                <td style={styles.tableData}>{product.name}</td>
                <td style={styles.tableData}>{product.description}</td>
                <td style={styles.tableData}>{product.category}</td>
                <td style={styles.tableData}>{product.price}</td>
                <td style={styles.tableData}>{product.quantity}</td>
                <td style={styles.tableData}>
                  <button style={styles.button} onClick={() => alert('Add Stock functionality coming soon')}>Add Stock</button>
                  <button style={styles.button} onClick={() => editProduct(index)}>Edit</button>
                  <button style={styles.button} onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr style={styles.tableRow}>
              <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
