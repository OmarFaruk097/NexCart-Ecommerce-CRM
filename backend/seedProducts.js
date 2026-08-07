const db = require('./config/db');

const seedProducts = async () => {
  try {
    // Wait for the DB to initialize and create tables
    await db.initDb();

    console.log('Resetting and seeding products table with accurate images...');
    
    // Clear all existing products to rebuild clean catalog
    await db.pool.query('DELETE FROM products');

    const products = [
      { 
        name: 'iPhone 15 Pro Max (256GB)', 
        price: 165000.00, 
        category: 'Mobiles', 
        description: 'Forged in titanium with A17 Pro chip, customizable Action button, and 48MP camera.', 
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop', 
        stock: 10 
      },
      { 
        name: 'Samsung Galaxy S24 Ultra', 
        price: 155000.00, 
        category: 'Mobiles', 
        description: 'Titanium frame, Galaxy AI features, S Pen included, and 200MP camera system.', 
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop', 
        stock: 12 
      },
      { 
        name: 'Google Pixel 8 Pro', 
        price: 115000.00, 
        category: 'Mobiles', 
        description: 'Powered by Tensor G3 with Google AI, pro triple camera system and crisp OLED display.', 
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop', 
        stock: 8 
      },
      { 
        name: 'Premium Wireless Headphones', 
        price: 29999.00, 
        category: 'Electronics', 
        description: 'High-fidelity audio with active noise cancellation.', 
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', 
        stock: 15 
      },
      { 
        name: 'Minimalist Mechanical Keyboard', 
        price: 14950.00, 
        category: 'Electronics', 
        description: 'Sleek design with tactile switches for typing enthusiasts.', 
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', 
        stock: 5 
      },
      { 
        name: 'Ergonomic Office Chair', 
        price: 45000.00, 
        category: 'Furniture', 
        description: 'Adjustable lumbar support and breathable mesh.', 
        imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop', 
        stock: 8 
      },
      { 
        name: 'Ceramic Coffee Mug', 
        price: 2400.00, 
        category: 'Home', 
        description: 'Hand-crafted ceramic mug, perfect for your morning brew.', 
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop', 
        stock: 50 
      },
      { 
        name: 'Leather Messenger Bag', 
        price: 18000.00, 
        category: 'Accessories', 
        description: 'Durable genuine leather with laptop compartment.', 
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', 
        stock: 10 
      },
      { 
        name: 'Smart Home Speaker', 
        price: 8999.00, 
        category: 'Electronics', 
        description: 'Voice-controlled speaker with rich sound and smart home integration.', 
        imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop', 
        stock: 8 
      },
      { 
        name: 'Running Shoes', 
        price: 12000.00, 
        category: 'Apparel', 
        description: 'Lightweight and breathable running shoes for daily workouts.', 
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', 
        stock: 25 
      },
      { 
        name: '4K Action Camera', 
        price: 34999.00, 
        category: 'Electronics', 
        description: 'Capture your adventures in stunning 4K resolution.', 
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop', 
        stock: 12 
      },
      { 
        name: 'Stainless Steel Water Bottle', 
        price: 3500.00, 
        category: 'Home', 
        description: 'Vacuum insulated bottle keeps drinks cold for 24 hours.', 
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop', 
        stock: 100 
      },
      { 
        name: 'Yoga Mat', 
        price: 4500.00, 
        category: 'Fitness', 
        description: 'Eco-friendly non-slip yoga mat with carrying strap.', 
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop', 
        stock: 30 
      },
      { 
        name: 'Smart Watch Series 5', 
        price: 39900.00, 
        category: 'Electronics', 
        description: 'Advanced fitness tracking and health monitoring.', 
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', 
        stock: 7 
      },
      { 
        name: 'Classic Sunglasses', 
        price: 15000.00, 
        category: 'Accessories', 
        description: 'Polarized lenses with 100% UV protection.', 
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop', 
        stock: 40 
      },
      { 
        name: 'Kids Wooden Puzzle Set', 
        price: 2900.00, 
        category: 'Toys', 
        description: 'Educational wooden puzzles for early learning and cognitive development.', 
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop', 
        stock: 55 
      },
      { 
        name: 'Outdoor Camping Hammock', 
        price: 6500.00, 
        category: 'Outdoor', 
        description: 'Comfortable portable hammock with tree straps included.', 
        imageUrl: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?q=80&w=600&auto=format&fit=crop', 
        stock: 20 
      },
      { 
        name: 'Designer LED Table Lamp', 
        price: 12000.00, 
        category: 'Home', 
        description: 'Modern LED table lamp with adjustable warm brightness.', 
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop', 
        stock: 15 
      }
    ];

    for (const p of products) {
      await db.pool.query(
        'INSERT INTO products (name, price, category, description, imageUrl, stock) VALUES ($1, $2, $3, $4, $5, $6)',
        [p.name, p.price, p.category, p.description, p.imageUrl, p.stock]
      );
    }
    
    console.log(`Successfully seeded ${products.length} products with proper images & mobile devices!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();


