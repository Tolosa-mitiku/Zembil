abstract class CategoryEvent {}

class GetProductsByCategoriesEvent extends CategoryEvent {
  final String category;

  GetProductsByCategoriesEvent(this.category);
}
