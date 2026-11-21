require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');

async function seed() {
  console.log('[Seed] Connecting to database...');
  await connectDB();

  console.log('[Seed] Clearing existing demo data...');
  await User.deleteMany({});
  await Item.deleteMany({});
  await Claim.deleteMany({});
  await Notification.deleteMany({});

  console.log('[Seed] Creating demo users...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Password123!', salt);

  const admin = await User.create({
    name: 'Sai Campus Admin',
    email: 'admin@saiuniversity.edu.in',
    password: adminHash,
    role: 'admin',
    campusId: 'SAI-ADM-01',
    phone: '+91 98765 43210',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
  });

  const student = await User.create({
    name: 'Aarav Sharma',
    email: 'student@saiuniversity.edu.in',
    password: passwordHash,
    role: 'student',
    campusId: 'SAI-2026-CS042',
    phone: '+91 91234 56789',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav'
  });

  const student2 = await User.create({
    name: 'Diya Krishnan',
    email: 'diya.k@saiuniversity.edu.in',
    password: passwordHash,
    role: 'student',
    campusId: 'SAI-2026-CS088',
    phone: '+91 94567 89012',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Diya'
  });

  console.log('[Seed] Seeding 12+ realistic campus lost and found items...');

  const itemsData = [
    {
      title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
      type: 'found',
      category: 'Electronics',
      description: 'Found white AirPods Pro in a dark navy silicone case on the study table near the east window.',
      location: 'Central Library, 2nd Floor Silent Study Area',
      building: 'Central Library',
      date: '2026-10-16',
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: admin._id.toString(),
      reportedByName: admin.name,
      contactEmail: admin.email,
      contactPhone: admin.phone,
      secretDetails: 'Initials "AS" faintly engraved on the inside hinge.'
    },
    {
      title: 'Sai University Student ID Card (CS2026-042)',
      type: 'found',
      category: 'ID & Cards',
      description: 'Found official campus RFID identity card left on tray return counter after lunch hours.',
      location: 'Dining Commons, Tray Return Station 1',
      building: 'Dining Commons',
      date: '2026-10-16',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student2._id.toString(),
      reportedByName: student2.name,
      contactEmail: student2.email,
      contactPhone: student2.phone,
      secretDetails: 'Card barcode ends with digits 8841.'
    },
    {
      title: 'Titan Edge Matte Black Wristwatch',
      type: 'lost',
      category: 'Accessories',
      description: 'Ultra-slim black ceramic watch with silver buckle clasp, misplaced near the basketball court spectator bleachers.',
      location: 'Sports Complex, Basketball Court Bleachers',
      building: 'Sports Complex',
      date: '2026-10-15',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student._id.toString(),
      reportedByName: student.name,
      contactEmail: student.email,
      contactPhone: student.phone,
      secretDetails: 'Slight scratch near the 4 o\'clock marker.'
    },
    {
      title: 'Thomas Calculus & Linear Algebra Textbook (14th Ed)',
      type: 'found',
      category: 'Books',
      description: 'Hardcover mathematics textbook with highlighted chapters on multivariable calculus, left on the back bench.',
      location: 'Academic Block, Room 104',
      building: 'Academic Block',
      date: '2026-10-15',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student2._id.toString(),
      reportedByName: student2.name,
      contactEmail: student2.email,
      contactPhone: student2.phone,
      secretDetails: 'Yellow sticky notes on pages 312 and 455.'
    },
    {
      title: 'Dell 65W USB-C Laptop Charger with Braided Cable',
      type: 'lost',
      category: 'Electronics',
      description: 'Black Dell original Type-C fast charger forgotten plugged into the wall outlet next to bench 3.',
      location: 'Robotics & Tech Lab, Workstation 3',
      building: 'Robotics & Tech Lab',
      date: '2026-10-14',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student._id.toString(),
      reportedByName: student.name,
      contactEmail: student.email,
      contactPhone: student.phone,
      secretDetails: 'Small piece of neon green tape wrapped near the USB-C plug.'
    },
    {
      title: 'Sony WH-1000XM4 Noise Cancelling Over-Ear Headphones',
      type: 'found',
      category: 'Electronics',
      description: 'Silver/platinum color Sony headphones with black carrying case, found in the third row of the auditorium.',
      location: 'Auditorium, Row C Seat 14',
      building: 'Auditorium',
      date: '2026-10-14',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      status: 'claimed',
      reportedBy: admin._id.toString(),
      reportedByName: admin.name,
      contactEmail: admin.email,
      contactPhone: admin.phone,
      secretDetails: 'Includes an airline two-prong audio adapter inside mesh pocket.'
    },
    {
      title: 'Bike Keychain with Sai University Maroon Lanyard',
      type: 'lost',
      category: 'Accessories',
      description: 'Ring containing two bike keys and a maroon Sai University embroidered strap lost near the parking gate.',
      location: 'Main Gate & Parking, Two-Wheeler Bay B',
      building: 'Main Gate & Parking',
      date: '2026-10-13',
      imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student._id.toString(),
      reportedByName: student.name,
      contactEmail: student.email,
      contactPhone: student.phone,
      secretDetails: 'Small silver bottle opener attached to key ring.'
    },
    {
      title: 'Amazon Kindle Paperwhite (11th Gen, Agave Green)',
      type: 'found',
      category: 'Electronics',
      description: 'E-reader in sage/agave green magnetic flip cover, turned in to the reception desk after evening tea.',
      location: 'Dining Commons, Coffee Corner',
      building: 'Dining Commons',
      date: '2026-10-13',
      imageUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: admin._id.toString(),
      reportedByName: admin.name,
      contactEmail: admin.email,
      contactPhone: admin.phone,
      secretDetails: 'Lock screen displays wallpaper of a mountain landscape.'
    },
    {
      title: 'Hydro Flask 32oz Wide Mouth Water Bottle (Cobalt Blue)',
      type: 'lost',
      category: 'Other',
      description: 'Metallic blue vacuum insulated water bottle with black flex cap and several coding stickers on the body.',
      location: 'Sports Complex, Indoor Badminton Hall',
      building: 'Sports Complex',
      date: '2026-10-12',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student2._id.toString(),
      reportedByName: student2.name,
      contactEmail: student2.email,
      contactPhone: student2.phone,
      secretDetails: 'Stickers include GitHub Octocat and React logo.'
    },
    {
      title: 'Titanium Framed Reading Eyeglasses with Hard Case',
      type: 'found',
      category: 'Accessories',
      description: 'Rimless titanium eyeglasses in a brown leather magnetic protective case.',
      location: 'Academic Block, Seminar Hall A',
      building: 'Academic Block',
      date: '2026-10-11',
      imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: admin._id.toString(),
      reportedByName: admin.name,
      contactEmail: admin.email,
      contactPhone: admin.phone,
      secretDetails: 'Cloth inside case has brand logo "Lenskart Air".'
    },
    {
      title: 'TI-84 Plus CE Color Graphing Calculator',
      type: 'lost',
      category: 'Electronics',
      description: 'Texas Instruments rechargeable graphing calculator in white casing, forgotten during the probability lab exam.',
      location: 'Academic Block, Computer Lab 2',
      building: 'Academic Block',
      date: '2026-10-10',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      status: 'open',
      reportedBy: student._id.toString(),
      reportedByName: student.name,
      contactEmail: student.email,
      contactPhone: student.phone,
      secretDetails: 'Small silver metallic sticker on back cover with serial number.'
    },
    {
      title: 'Brown Leather Fossil Bifold Wallet',
      type: 'found',
      category: 'Accessories',
      description: 'Distressed brown leather wallet found resting on the magazine rack near the main library exit.',
      location: 'Central Library, Ground Floor Newspaper Section',
      building: 'Central Library',
      date: '2026-10-09',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
      status: 'resolved',
      reportedBy: admin._id.toString(),
      reportedByName: admin.name,
      contactEmail: admin.email,
      contactPhone: admin.phone,
      secretDetails: 'Contains metro card and student bus concession pass.'
    }
  ];

  const createdItems = [];
  for (const item of itemsData) {
    const created = await Item.create(item);
    createdItems.push(created);
  }

  console.log(`[Seed] Successfully inserted ${createdItems.length} items.`);

  // Create sample claim on the Sony headphones
  const sonyHeadphones = createdItems[5];
  await Claim.create({
    itemId: sonyHeadphones._id.toString(),
    itemTitle: sonyHeadphones.title,
    claimantId: student._id.toString(),
    claimantName: student.name,
    claimantEmail: student.email,
    contactPhone: student.phone,
    proofDescription: 'I was studying in Auditorium Row C for the robotics workshop and had left the headphones on my seat. My phone Bluetooth connection log shows paired device "WH-1000XM4".',
    verificationAnswer: 'Airline two-prong audio adapter in the zipper pouch.',
    status: 'approved',
    reviewNotes: 'Bluetooth MAC address and accessory contents verified against physical item.',
    reviewedBy: admin.name
  });

  // Seed sample in-app notification
  await Notification.create({
    userId: student._id.toString(),
    title: `Claim Approved for "${sonyHeadphones.title}"`,
    message: `Your ownership claim has been verified. You may collect your item from the Central Security Desk.`,
    type: 'claim_approved',
    link: `/items/${sonyHeadphones._id}`,
    isRead: false
  });

  console.log('[Seed] Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('  Admin User:   admin@saiuniversity.edu.in  | Password: Password123!');
  console.log('  Student User: student@saiuniversity.edu.in| Password: Password123!');
  console.log('----------------------------------------------------');

  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
