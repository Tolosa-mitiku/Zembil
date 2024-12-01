import 'package:zembil/features/home/domain/entity/dimension.dart';

class DimensionModel extends DimensionEntity {
  const DimensionModel({
    required super.length,
    required super.height,
    required super.width,
  });

  factory DimensionModel.fromJson(Map<String, dynamic> json) {
    return DimensionModel(
      length: json['length'] as int,
      height: json['height'] as int,
      width: json['width'] as int,
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
