require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const Photo = require('../models/Photo');
const Product = require('../models/Product');

// Connect to database
connectDB();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

// Sample blog posts
const blogs = [
  {
    title: 'Essential Camera Settings Every Beginner Should Know',
    content: `<p>When you're just starting out with photography, all the settings on your camera can seem overwhelming. But understanding just a few key settings can help you take much better photos right away.</p><p>In this post, we'll cover the essential camera settings every beginner should know:</p><h3>Aperture</h3><p>Aperture controls the amount of light entering your camera and affects the depth of field. A lower f-number (like f/2.8) creates a blurry background, which is great for portraits. A higher f-number (like f/16) keeps more of the scene in focus, which is better for landscapes.</p><h3>Shutter Speed</h3><p>This determines how long your camera's sensor is exposed to light. Fast shutter speeds (like 1/1000) freeze motion, while slow shutter speeds (like 1/30) can create motion blur or let in more light in dark situations.</p><h3>ISO</h3><p>ISO controls your camera's sensitivity to light. Lower ISO (like 100) produces better quality images but needs more light. Higher ISO (like 3200) lets you shoot in darker conditions but can introduce digital noise.</p><p>Understanding the relationship between these three settings—often called the "exposure triangle"—is the key to taking better photos in any situation.</p>`,
    excerpt: 'A beginner-friendly guide to the most important camera settings you need to know to start taking better photos immediately.',
    category: 'camera-basics',
    image: '/uploads/blog/camera-settings.jpg',
    readTime: '4 min read',
  },
  {
    title: 'Mastering Composition: The Rule of Thirds',
    content: `<p>Good composition is what separates a great photo from an average one, even when the subject is identical. One of the simplest and most effective composition techniques is the Rule of Thirds.</p><h3>What is the Rule of Thirds?</h3><p>Imagine your image is divided into a grid of nine equal parts, with two horizontal lines and two vertical lines. The Rule of Thirds suggests that you should position the important elements of your scene along these lines or at their intersections.</p><p>This creates a more balanced and interesting image than simply centering your subject.</p><h3>Why It Works</h3><p>The Rule of Thirds works because it creates a sense of balance and movement. It encourages you to leave space around your subject, which can make your photos feel more natural and dynamic.</p><h3>When to Use It</h3><p>The Rule of Thirds works well for many types of photography:</p><ul><li>Landscapes: Position the horizon along the top or bottom third line</li><li>Portraits: Place the subject's eyes or face at an intersection point</li><li>Action shots: Give space in the direction the subject is moving</li></ul><h3>When to Break It</h3><p>Like all rules in art, this one is meant to be broken! Sometimes a centered composition or other arrangement works better. But understanding the Rule of Thirds gives you a strong foundation to work from.</p>`,
    excerpt: 'Learn how to use the Rule of Thirds to create more balanced and visually appealing photographs.',
    category: 'composition',
    image: '/uploads/blog/rule-of-thirds.jpg',
    readTime: '5 min read',
  }
];

// Sample galleries
const galleries = [
  {
    title: 'Wildlife of Sri Lanka',
    description: 'Capturing the incredible diversity of wildlife across Sri Lanka, from elephants in Udawalawe to leopards in Yala.',
    category: 'wildlife',
    coverImage: '/uploads/photos/wildlife-cover.jpg',
    featured: true,
  },
  {
    title: 'Sri Lankan Weddings',
    description: 'Traditional Sri Lankan wedding ceremonies captured with attention to cultural details and emotional moments.',
    category: 'weddings',
    coverImage: '/uploads/photos/wedding-cover.jpg',
    featured: true,
  }
];

// Sample products
const products = [
  {
    name: 'Sri Lanka Landscapes Preset Pack',
    type: 'preset',
    description: 'A collection of 10 presets specifically designed for enhancing landscape photos of Sri Lanka. Perfect for bringing out the vibrant greens and blues in your tropical photos.',
    price: 24.99,
    image: '/uploads/products/landscape-preset.jpg',
    featured: true,
    downloadLink: '/downloads/landscape-presets.zip',
  },
  {
    name: 'Sunset at Ella Gap',
    type: 'print',
    description: 'A stunning print of the sunset at Ella Gap, capturing the breathtaking view from Little Adam\'s Peak.',
    price: 49.99,
    image: '/uploads/products/ella-print.jpg',
    featured: true,
    printSizes: ['8x10', '11x14', '16x20', '20x30'],
  }
];

// Create necessary folders for uploads
const fs = require('fs');
const path = require('path');

const createUploadDirs = () => {
  const dirs = [
    'uploads/photos', 
    'uploads/products', 
    'uploads/blog'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
};

// Seed data function
const seedData = async () => {
  try {
    // Create upload directories
    createUploadDirs();

    // Clear existing data
    await User.deleteMany();
    console.log('Users collection cleared');
    
    await Blog.deleteMany();
    console.log('Blogs collection cleared');
    
    await Gallery.deleteMany();
    console.log('Galleries collection cleared');
    
    await Photo.deleteMany();
    console.log('Photos collection cleared');
    
    await Product.deleteMany();
    console.log('Products collection cleared');
    
    console.log('All data cleared');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded');

    // Create blogs one by one to better handle errors
    for (const blog of blogs) {
      try {
        await Blog.create(blog);
      } catch (error) {
        console.error(`Error creating blog "${blog.title}": ${error.message}`);
      }
    }
    console.log('Blogs seeded');

    // Create galleries one by one to handle slug generation better
    for (const gallery of galleries) {
      try {
        await Gallery.create(gallery);
      } catch (error) {
        console.error(`Error creating gallery "${gallery.title}": ${error.message}`);
      }
    }
    console.log('Galleries seeded');

    // Get all galleries for photo references
    const createdGalleries = await Gallery.find();

    // Create sample photos for each gallery
    const photos = [
      {
        gallery: createdGalleries[0]._id,
        src: '/uploads/photos/elephant.jpg',
        caption: 'Elephant at Udawalawe National Park',
        order: 1,
      },
      {
        gallery: createdGalleries[0]._id,
        src: '/uploads/photos/leopard.jpg',
        caption: 'Leopard at Yala National Park',
        order: 2,
      },
      {
        gallery: createdGalleries[1]._id,
        src: '/uploads/photos/wedding1.jpg',
        caption: 'Traditional Poruwa Ceremony',
        order: 1,
      },
      {
        gallery: createdGalleries[1]._id,
        src: '/uploads/photos/wedding2.jpg',
        caption: 'First dance',
        order: 2,
      },
    ];

    await Photo.insertMany(photos);
    console.log('Photos seeded');

    // Create products one by one
    for (const product of products) {
      try {
        await Product.create(product);
      } catch (error) {
        console.error(`Error creating product "${product.name}": ${error.message}`);
      }
    }
    console.log('Products seeded');

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedData();