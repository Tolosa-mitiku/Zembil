import { Order, OrdersResponse } from '../api/ordersApi';
import { ORDER_STATUS } from '@/core/constants';

// Mock orders data for testing the UI
export const mockOrders: Order[] = [
  {
    _id: 'order-1',
    orderNumber: 'ZMB-20241128-1234',
    items: [
      {
        productId: '1',
        title: 'iPhone 14 Pro Max 256GB',
        price: 1099,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 1099,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'John Smith',
      phoneNumber: '+1-555-0123',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
    trackingNumber: 'TRK123456789',
    carrier: 'DHL Express',
    estimatedDelivery: '2024-11-20T12:00:00.000Z',
    customer: {
      _id: 'cust-1',
      name: 'John Smith',
      email: 'john.smith@email.com',
    },
    createdAt: '2024-11-15T10:30:00.000Z',
    updatedAt: '2024-11-20T14:22:00.000Z',
  },
  {
    _id: 'order-2',
    orderNumber: 'ZMB-20241127-5678',
    items: [
      {
        productId: '3',
        title: 'MacBook Pro 16" M3 Max',
        price: 3299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=1000&fit=crop',
      },
      {
        productId: '4',
        title: 'Sony WH-1000XM5 Headphones',
        price: 349,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 3648,
    status: ORDER_STATUS.SHIPPED,
    shippingAddress: {
      fullName: 'Emily Johnson',
      phoneNumber: '+1-555-0124',
      addressLine1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States',
    },
    trackingNumber: 'TRK987654321',
    carrier: 'FedEx',
    estimatedDelivery: '2024-11-29T12:00:00.000Z',
    customer: {
      _id: 'cust-2',
      name: 'Emily Johnson',
      email: 'emily.j@email.com',
    },
    createdAt: '2024-11-25T14:20:00.000Z',
    updatedAt: '2024-11-27T09:15:00.000Z',
  },
  {
    _id: 'order-3',
    orderNumber: 'ZMB-20241128-9012',
    items: [
      {
        productId: '2',
        title: 'Samsung Galaxy S24 Ultra',
        price: 1199,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 2398,
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    shippingAddress: {
      fullName: 'Michael Brown',
      phoneNumber: '+1-555-0125',
      addressLine1: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'United States',
    },
    trackingNumber: 'TRK456789123',
    carrier: 'UPS',
    estimatedDelivery: '2024-11-28T18:00:00.000Z',
    customer: {
      _id: 'cust-3',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
    },
    createdAt: '2024-11-26T16:45:00.000Z',
    updatedAt: '2024-11-28T08:30:00.000Z',
  },
  {
    _id: 'order-4',
    orderNumber: 'ZMB-20241128-3456',
    items: [
      {
        productId: '5',
        title: 'Nike Air Max 2024',
        price: 159,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      },
      {
        productId: '6',
        title: 'Adidas Ultraboost 23',
        price: 179,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 338,
    status: ORDER_STATUS.PROCESSING,
    shippingAddress: {
      fullName: 'Sarah Davis',
      phoneNumber: '+1-555-0126',
      addressLine1: '321 Maple Drive',
      city: 'Houston',
      state: 'TX',
      postalCode: '77001',
      country: 'United States',
    },
    customer: {
      _id: 'cust-4',
      name: 'Sarah Davis',
      email: 'sarah.d@email.com',
    },
    createdAt: '2024-11-27T11:20:00.000Z',
    updatedAt: '2024-11-27T15:10:00.000Z',
  },
  {
    _id: 'order-5',
    orderNumber: 'ZMB-20241128-7890',
    items: [
      {
        productId: '7',
        title: 'Samsung 65" QLED 4K Smart TV',
        price: 1499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 1499,
    status: ORDER_STATUS.CONFIRMED,
    shippingAddress: {
      fullName: 'David Wilson',
      phoneNumber: '+1-555-0127',
      addressLine1: '654 Cedar Lane',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85001',
      country: 'United States',
    },
    customer: {
      _id: 'cust-5',
      name: 'David Wilson',
      email: 'david.w@email.com',
    },
    createdAt: '2024-11-28T08:00:00.000Z',
    updatedAt: '2024-11-28T09:30:00.000Z',
  },
  {
    _id: 'order-6',
    orderNumber: 'ZMB-20241127-2345',
    items: [
      {
        productId: '8',
        title: 'Canon EOS R5 Camera',
        price: 3899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=1000&fit=crop',
      },
      {
        productId: '9',
        title: 'Canon RF 24-70mm f/2.8L Lens',
        price: 2299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 6198,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'Jessica Martinez',
      phoneNumber: '+1-555-0128',
      addressLine1: '987 Birch Street',
      city: 'Philadelphia',
      state: 'PA',
      postalCode: '19019',
      country: 'United States',
    },
    trackingNumber: 'TRK789123456',
    carrier: 'DHL Express',
    estimatedDelivery: '2024-11-22T12:00:00.000Z',
    customer: {
      _id: 'cust-6',
      name: 'Jessica Martinez',
      email: 'jessica.m@email.com',
    },
    createdAt: '2024-11-18T09:15:00.000Z',
    updatedAt: '2024-11-22T13:45:00.000Z',
  },
  {
    _id: 'order-7',
    orderNumber: 'ZMB-20241128-6789',
    items: [
      {
        productId: '10',
        title: 'PlayStation 5 Console',
        price: 499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=1000&fit=crop',
      },
      {
        productId: '11',
        title: 'DualSense Wireless Controller',
        price: 69,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 637,
    status: ORDER_STATUS.PENDING,
    shippingAddress: {
      fullName: 'Robert Garcia',
      phoneNumber: '+1-555-0129',
      addressLine1: '147 Elm Court',
      city: 'San Antonio',
      state: 'TX',
      postalCode: '78201',
      country: 'United States',
    },
    customer: {
      _id: 'cust-7',
      name: 'Robert Garcia',
      email: 'robert.g@email.com',
    },
    createdAt: '2024-11-28T10:00:00.000Z',
    updatedAt: '2024-11-28T10:00:00.000Z',
  },
  {
    _id: 'order-8',
    orderNumber: 'ZMB-20241126-1111',
    items: [
      {
        productId: '12',
        title: 'Dyson V15 Detect Vacuum',
        price: 649,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 649,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'Amanda Taylor',
      phoneNumber: '+1-555-0130',
      addressLine1: '258 Willow Way',
      city: 'San Diego',
      state: 'CA',
      postalCode: '92101',
      country: 'United States',
    },
    trackingNumber: 'TRK321654987',
    carrier: 'UPS',
    estimatedDelivery: '2024-11-24T12:00:00.000Z',
    customer: {
      _id: 'cust-8',
      name: 'Amanda Taylor',
      email: 'amanda.t@email.com',
    },
    createdAt: '2024-11-20T13:30:00.000Z',
    updatedAt: '2024-11-24T15:20:00.000Z',
  },
  {
    _id: 'order-9',
    orderNumber: 'ZMB-20241127-2222',
    items: [
      {
        productId: '13',
        title: 'Apple Watch Series 9',
        price: 429,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=1000&fit=crop',
      },
      {
        productId: '14',
        title: 'Apple Watch Sport Band',
        price: 49,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 527,
    status: ORDER_STATUS.SHIPPED,
    shippingAddress: {
      fullName: 'Christopher Anderson',
      phoneNumber: '+1-555-0131',
      addressLine1: '369 Spruce Avenue',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75201',
      country: 'United States',
    },
    trackingNumber: 'TRK654987321',
    carrier: 'FedEx',
    estimatedDelivery: '2024-11-29T12:00:00.000Z',
    customer: {
      _id: 'cust-9',
      name: 'Christopher Anderson',
      email: 'chris.a@email.com',
    },
    createdAt: '2024-11-25T07:45:00.000Z',
    updatedAt: '2024-11-27T10:20:00.000Z',
  },
  {
    _id: 'order-10',
    orderNumber: 'ZMB-20241128-3333',
    items: [
      {
        productId: '15',
        title: 'Bose QuietComfort Earbuds II',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 299,
    status: ORDER_STATUS.CANCELED,
    shippingAddress: {
      fullName: 'Michelle Thomas',
      phoneNumber: '+1-555-0132',
      addressLine1: '741 Redwood Blvd',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95101',
      country: 'United States',
    },
    customer: {
      _id: 'cust-10',
      name: 'Michelle Thomas',
      email: 'michelle.t@email.com',
    },
    createdAt: '2024-11-27T16:00:00.000Z',
    updatedAt: '2024-11-28T09:00:00.000Z',
  },
  {
    _id: 'order-11',
    orderNumber: 'ZMB-20241127-4444',
    items: [
      {
        productId: '16',
        title: 'Dell XPS 15 Laptop',
        price: 1799,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=1000&fit=crop',
      },
      {
        productId: '17',
        title: 'Logitech MX Master 3 Mouse',
        price: 99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 1898,
    status: ORDER_STATUS.PROCESSING,
    shippingAddress: {
      fullName: 'Daniel White',
      phoneNumber: '+1-555-0133',
      addressLine1: '852 Cypress Street',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States',
    },
    customer: {
      _id: 'cust-11',
      name: 'Daniel White',
      email: 'daniel.w@email.com',
    },
    createdAt: '2024-11-27T12:30:00.000Z',
    updatedAt: '2024-11-27T18:15:00.000Z',
  },
  {
    _id: 'order-12',
    orderNumber: 'ZMB-20241126-5555',
    items: [
      {
        productId: '18',
        title: 'GoPro HERO 12 Black',
        price: 399,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 399,
    status: ORDER_STATUS.SHIPPED,
    shippingAddress: {
      fullName: 'Lisa Harris',
      phoneNumber: '+1-555-0134',
      addressLine1: '963 Ash Drive',
      city: 'Jacksonville',
      state: 'FL',
      postalCode: '32099',
      country: 'United States',
    },
    trackingNumber: 'TRK147258369',
    carrier: 'DHL Express',
    estimatedDelivery: '2024-11-29T12:00:00.000Z',
    customer: {
      _id: 'cust-12',
      name: 'Lisa Harris',
      email: 'lisa.h@email.com',
    },
    createdAt: '2024-11-24T14:00:00.000Z',
    updatedAt: '2024-11-26T11:30:00.000Z',
  },
  {
    _id: 'order-13',
    orderNumber: 'ZMB-20241125-6666',
    items: [
      {
        productId: '19',
        title: 'Fitbit Charge 6',
        price: 159,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 318,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'Kevin Clark',
      phoneNumber: '+1-555-0135',
      addressLine1: '159 Poplar Place',
      city: 'Fort Worth',
      state: 'TX',
      postalCode: '76101',
      country: 'United States',
    },
    trackingNumber: 'TRK963852741',
    carrier: 'UPS',
    estimatedDelivery: '2024-11-23T12:00:00.000Z',
    customer: {
      _id: 'cust-13',
      name: 'Kevin Clark',
      email: 'kevin.c@email.com',
    },
    createdAt: '2024-11-19T10:15:00.000Z',
    updatedAt: '2024-11-23T14:30:00.000Z',
  },
  {
    _id: 'order-14',
    orderNumber: 'ZMB-20241128-7777',
    items: [
      {
        productId: '20',
        title: 'iPad Pro 12.9" M2',
        price: 1099,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=1000&fit=crop',
      },
      {
        productId: '21',
        title: 'Apple Pencil 2nd Gen',
        price: 129,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 1228,
    status: ORDER_STATUS.CONFIRMED,
    shippingAddress: {
      fullName: 'Nancy Lewis',
      phoneNumber: '+1-555-0136',
      addressLine1: '357 Chestnut Road',
      city: 'Columbus',
      state: 'OH',
      postalCode: '43085',
      country: 'United States',
    },
    customer: {
      _id: 'cust-14',
      name: 'Nancy Lewis',
      email: 'nancy.l@email.com',
    },
    createdAt: '2024-11-28T09:00:00.000Z',
    updatedAt: '2024-11-28T11:15:00.000Z',
  },
  {
    _id: 'order-15',
    orderNumber: 'ZMB-20241127-8888',
    items: [
      {
        productId: '22',
        title: 'Instant Pot Duo Plus',
        price: 119,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 119,
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    shippingAddress: {
      fullName: 'Brian Walker',
      phoneNumber: '+1-555-0137',
      addressLine1: '456 Hickory Lane',
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28105',
      country: 'United States',
    },
    trackingNumber: 'TRK753951456',
    carrier: 'FedEx',
    estimatedDelivery: '2024-11-28T18:00:00.000Z',
    customer: {
      _id: 'cust-15',
      name: 'Brian Walker',
      email: 'brian.w@email.com',
    },
    createdAt: '2024-11-26T08:30:00.000Z',
    updatedAt: '2024-11-28T07:45:00.000Z',
  },
  {
    _id: 'order-16',
    orderNumber: 'ZMB-20241126-9999',
    items: [
      {
        productId: '23',
        title: 'Razer BlackWidow V4 Keyboard',
        price: 179,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=1000&fit=crop',
      },
      {
        productId: '24',
        title: 'Razer DeathAdder V3 Mouse',
        price: 69,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 248,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'Patricia Young',
      phoneNumber: '+1-555-0138',
      addressLine1: '789 Walnut Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    trackingNumber: 'TRK852963741',
    carrier: 'DHL Express',
    estimatedDelivery: '2024-11-24T12:00:00.000Z',
    customer: {
      _id: 'cust-16',
      name: 'Patricia Young',
      email: 'patricia.y@email.com',
    },
    createdAt: '2024-11-21T11:00:00.000Z',
    updatedAt: '2024-11-24T16:45:00.000Z',
  },
  {
    _id: 'order-17',
    orderNumber: 'ZMB-20241128-0000',
    items: [
      {
        productId: '25',
        title: 'KitchenAid Stand Mixer',
        price: 379,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 379,
    status: ORDER_STATUS.PENDING,
    shippingAddress: {
      fullName: 'Steven King',
      phoneNumber: '+1-555-0139',
      addressLine1: '159 Magnolia Avenue',
      city: 'Indianapolis',
      state: 'IN',
      postalCode: '46201',
      country: 'United States',
    },
    customer: {
      _id: 'cust-17',
      name: 'Steven King',
      email: 'steven.k@email.com',
    },
    createdAt: '2024-11-28T11:30:00.000Z',
    updatedAt: '2024-11-28T11:30:00.000Z',
  },
  {
    _id: 'order-18',
    orderNumber: 'ZMB-20241127-1234',
    items: [
      {
        productId: '26',
        title: 'LG 27" 4K Monitor',
        price: 449,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 898,
    status: ORDER_STATUS.PROCESSING,
    shippingAddress: {
      fullName: 'Karen Wright',
      phoneNumber: '+1-555-0140',
      addressLine1: '753 Dogwood Drive',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
    },
    customer: {
      _id: 'cust-18',
      name: 'Karen Wright',
      email: 'karen.w@email.com',
    },
    createdAt: '2024-11-27T13:15:00.000Z',
    updatedAt: '2024-11-27T19:30:00.000Z',
  },
  {
    _id: 'order-19',
    orderNumber: 'ZMB-20241125-5678',
    items: [
      {
        productId: '27',
        title: 'Nespresso Vertuo Next',
        price: 179,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 179,
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: {
      fullName: 'George Hill',
      phoneNumber: '+1-555-0141',
      addressLine1: '951 Sycamore Court',
      city: 'Denver',
      state: 'CO',
      postalCode: '80201',
      country: 'United States',
    },
    trackingNumber: 'TRK159357852',
    carrier: 'UPS',
    estimatedDelivery: '2024-11-23T12:00:00.000Z',
    customer: {
      _id: 'cust-19',
      name: 'George Hill',
      email: 'george.h@email.com',
    },
    createdAt: '2024-11-20T09:00:00.000Z',
    updatedAt: '2024-11-23T15:30:00.000Z',
  },
  {
    _id: 'order-20',
    orderNumber: 'ZMB-20241128-9012',
    items: [
      {
        productId: '28',
        title: 'Philips Hue Smart Bulbs Starter Kit',
        price: 199,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&h=1000&fit=crop',
      },
    ],
    totalPrice: 199,
    status: ORDER_STATUS.CONFIRMED,
    shippingAddress: {
      fullName: 'Betty Scott',
      phoneNumber: '+1-555-0142',
      addressLine1: '357 Beech Boulevard',
      city: 'Boston',
      state: 'MA',
      postalCode: '02101',
      country: 'United States',
    },
    customer: {
      _id: 'cust-20',
      name: 'Betty Scott',
      email: 'betty.s@email.com',
    },
    createdAt: '2024-11-28T07:30:00.000Z',
    updatedAt: '2024-11-28T10:00:00.000Z',
  },
];

// Helper function to get paginated mock orders
export const getMockOrdersPage = (
  page: number = 1,
  limit: number = 12,
  status?: string
): OrdersResponse => {
  let filteredOrders = [...mockOrders];

  // Filter by status if provided
  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status);
  }

  // Sort by creation date (newest first)
  filteredOrders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filteredOrders.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return {
    orders: paginatedOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};















