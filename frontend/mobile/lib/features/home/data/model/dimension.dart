import 'package:zembil/features/home/domain/entity/dimension.dart';

class DimensionModel extends DimensionEntity {
  const DimensionModel({
    required super.length,
    required super.height,
    required super.width,
  });

  factory DimensionModel.fromJson(Map<String, dynamic> json) {
    return DimensionModel(
      length: (json['length'] as num).toDouble(),
      height: (json['height'] as num).toDouble(),
      width: (json['width'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'length': length,
      'height': height,
      'width': width,
    };
  }
}
