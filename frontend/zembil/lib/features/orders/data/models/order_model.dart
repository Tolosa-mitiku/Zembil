import 'package:zembil/features/orders/domain/entity/order.dart';

class OrderModel extends OrderEntity {
  OrderModel({
    required super.id,
    required super.items,
    required super.totalPrice,
    required super.shippingAddress,
    required super.tracking,
    required super.paymentStatus,
    required super.paymentMethod,
    super.paymentId,
    required super.createdAt,
    required super.updatedAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['_id'] ?? json['id'] ?? '',
      items: (json['items'] as List<dynamic>?)
              ?.map((item) => OrderItemModel.fromJson(item))
              .toList() ??
          [],
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
      shippingAddress: ShippingAddressModel.fromJson(
          json['shippingAddress'] as Map<String, dynamic>? ?? {}),
      tracking: OrderTrackingModel.fromJson(
          json['tracking'] as Map<String, dynamic>? ?? {}),
      paymentStatus: json['paymentStatus'] as String? ?? 'pending',
      paymentMethod: json['paymentMethod'] as String? ?? 'stripe',
      paymentId: json['paymentId'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'items': items
          .map((item) => (item as OrderItemModel).toJson())
          .toList(),
      'totalPrice': totalPrice,
      'shippingAddress': (shippingAddress as ShippingAddressModel).toJson(),
      'paymentMethod': paymentMethod,
      'paymentId': paymentId,
    };
  }
}

class OrderItemModel extends OrderItem {
  OrderItemModel({
    required super.productId,
    required super.title,
    super.image,
    required super.price,
    required super.quantity,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      productId: json['productId'] is Map
          ? json['productId']['_id']
          : json['productId'] ?? '',
      title: json['title'] ?? '',
      image: json['image'],
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      quantity: json['quantity'] as int? ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'title': title,
      'image': image,
      'price': price,
      'quantity': quantity,
    };
  }
}

class ShippingAddressModel extends ShippingAddress {
  ShippingAddressModel({
    required super.addressLine1,
    super.addressLine2,
    required super.city,
    required super.postalCode,
    required super.country,
    super.geolocation,
  });

  factory ShippingAddressModel.fromJson(Map<String, dynamic> json) {
    return ShippingAddressModel(
      addressLine1: json['addressLine1'] ?? '',
      addressLine2: json['addressLine2'],
      city: json['city'] ?? '',
      postalCode: json['postalCode'] ?? '',
      country: json['country'] ?? '',
      geolocation: json['geolocation'] != null
          ? GeolocationModel.fromJson(json['geolocation'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'addressLine1': addressLine1,
      if (addressLine2 != null) 'addressLine2': addressLine2,
      'city': city,
      'postalCode': postalCode,
      'country': country,
      if (geolocation != null)
        'geolocation': (geolocation as GeolocationModel).toJson(),
    };
  }
}

class GeolocationModel extends Geolocation {
  GeolocationModel({
    required super.latitude,
    required super.longitude,
  });

  factory GeolocationModel.fromJson(Map<String, dynamic> json) {
    return GeolocationModel(
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}

class OrderTrackingModel extends OrderTracking {
  OrderTrackingModel({
    super.currentLocation,
    required super.status,
    required super.statusHistory,
    super.estimatedDelivery,
    super.trackingNumber,
  });

  factory OrderTrackingModel.fromJson(Map<String, dynamic> json) {
    return OrderTrackingModel(
      currentLocation: json['currentLocation'] != null
          ? TrackingLocationModel.fromJson(json['currentLocation'])
          : null,
      status: json['status'] ?? 'pending',
      statusHistory: (json['statusHistory'] as List<dynamic>?)
              ?.map((item) => StatusHistoryModel.fromJson(item))
              .toList() ??
          [],
      estimatedDelivery: json['estimatedDelivery'] != null
          ? DateTime.parse(json['estimatedDelivery'] as String)
          : null,
      trackingNumber: json['trackingNumber'],
    );
  }
}

class TrackingLocationModel extends TrackingLocation {
  TrackingLocationModel({
    required super.latitude,
    required super.longitude,
    super.address,
    required super.updatedAt,
  });

  factory TrackingLocationModel.fromJson(Map<String, dynamic> json) {
    return TrackingLocationModel(
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      address: json['address'],
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : DateTime.now(),
    );
  }
}

class StatusHistoryModel extends StatusHistory {
  StatusHistoryModel({
    required super.status,
    required super.timestamp,
    super.location,
  });

  factory StatusHistoryModel.fromJson(Map<String, dynamic> json) {
    return StatusHistoryModel(
      status: json['status'] ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'] as String)
          : DateTime.now(),
      location: json['location'],
    );
  }
}

