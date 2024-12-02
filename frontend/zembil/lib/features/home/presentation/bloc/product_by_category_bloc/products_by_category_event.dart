abstract class ProductsByCategoryEvent {}

class GetProductsByCategoriesEvent extends ProductsByCategoryEvent {
  final String category;

  GetProductsByCategoriesEvent(this.category);
}
