class PaymentMethod {
  final String id;
  final String name;
  const PaymentMethod({required this.id, required this.name});

  factory PaymentMethod.fromJson(Map<String, dynamic> json) {
    return PaymentMethod(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson(PaymentMethod paymentMethod) {
    return {'id': paymentMethod.id, 'name': paymentMethod.name};
  }
}
