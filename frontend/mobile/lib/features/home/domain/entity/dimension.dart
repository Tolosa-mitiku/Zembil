import 'package:equatable/equatable.dart';

class DimensionEntity extends Equatable {
  final double length;
  final double height;
  final double width;

  const DimensionEntity({
    required this.length,
    required this.height,
    required this.width,
  });

  @override
  List<Object?> get props => [
        length,
        height,
        width,
      ];
}
