import 'package:equatable/equatable.dart';

class DiscountEntity extends Equatable {
  final int percentage;
  final String? startDate;
  final String? endDate;

  const DiscountEntity({
    required this.percentage,
    required this.startDate,
    required this.endDate,
  });

  @override
  List<Object?> get props => [
        percentage,
        startDate,
        endDate,
      ];
}
