class OrderEntity {
  final String id;
  final List<OrderItem> items;
  final double totalPrice;
  final ShippingAddress shippingAddress;
  final OrderTracking tracking;
  final String paymentStatus;
  final String paymentMethod;
  final String? paymentId;
  final DateTime createdAt;
  final DateTime updatedAt;

  OrderEntity({
    required this.id,
    required this.items,
    required this.totalPrice,
    required this.shippingAddress,
    required this.tracking,
    required this.paymentStatus,
    required this.paymentMethod,
    this.paymentId,
    required this.createdAt,
    required this.updatedAt,
  });
}

class OrderItem {
  final String productId;
  final String title;
  final String? image;
  final double price;
  final int quantity;

  OrderItem({
    required this.productId,
    required this.title,
    this.image,
    required this.price,
    required this.quantity,
  });

  double get subtotal => price * quantity;
}

class ShippingAddress {
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String postalCode;
  final String country;
  final Geolocation? geolocation;

  ShippingAddress({
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.postalCode,
    required this.country,
    this.geolocation,
  });

  String get fullAddress {
    final parts = [
      addressLine1,
      if (addressLine2 != null && addressLine2!.isNotEmpty) addressLine2,
      city,
      postalCode,
      country,
    ];
    return parts.join(', ');
  }
}

class Geolocation {
  final double latitude;
  final double longitude;

  Geolocation({
    required this.latitude,
    required this.longitude,
  });
}

class OrderTracking {
  final TrackingLocation? currentLocation;
  final String status;
  final List<StatusHistory> statusHistory;
  final DateTime? estimatedDelivery;
  final String? trackingNumber;

  OrderTracking({
    this.currentLocation,
    required this.status,
    required this.statusHistory,
    this.estimatedDelivery,
    this.trackingNumber,
  });

  String get statusDisplay {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }

  bool get isActive => !['delivered', 'canceled'].contains(status);
  bool get canCancel => !['shipped', 'out_for_delivery', 'delivered', 'canceled'].contains(status);
}

class TrackingLocation {
  final double latitude;
  final double longitude;
  final String? address;
  final DateTime updatedAt;

  TrackingLocation({
    required this.latitude,
    required this.longitude,
    this.address,
    required this.updatedAt,
  });
}

class StatusHistory {
  final String status;
  final DateTime timestamp;
  final String? location;

  StatusHistory({
    required this.status,
    required this.timestamp,
    this.location,
  });
}

