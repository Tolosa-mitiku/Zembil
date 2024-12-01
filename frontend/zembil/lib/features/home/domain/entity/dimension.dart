import 'package:equatable/equatable.dart';

class DimensionEntity extends Equatable {
  final int length;
  final int height;
  final int width;

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
