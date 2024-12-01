import 'package:zembil/features/home/domain/entity/discount.dart';

class DiscountModel extends DiscountEntity {
  const DiscountModel({
    required super.percentage,
    required super.startDate,
    required super.endDate,
  });

  factory DiscountModel.fromJson(Map<String, dynamic> json) {
    return DiscountModel(
      percentage: json['percentage'] as int,
      startDate: json['startDate'] as String?,
      endDate: json['endDate'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'percentage': percentage,
      'startDate': startDate,
      'endDate': endDate,
    };
  }
}
