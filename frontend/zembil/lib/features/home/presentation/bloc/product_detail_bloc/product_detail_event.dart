abstract class ProductDetailEvent {}

class FetchProductDetail extends ProductDetailEvent {
  final String productId;

  FetchProductDetail(this.productId);
}
