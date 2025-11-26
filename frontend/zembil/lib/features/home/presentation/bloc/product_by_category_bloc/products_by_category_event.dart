abstract class ProductsByCategoryEvent {}

class GetProductsByCategoriesEvent extends ProductsByCategoryEvent {
  final String category;

  GetProductsByCategoriesEvent(this.category);
}

class SearchProductsEvent extends ProductsByCategoryEvent {
  final String query;

  SearchProductsEvent(this.query);
}

class FilterProductsEvent extends ProductsByCategoryEvent {
  final Map<String, dynamic> filters;

  FilterProductsEvent(this.filters);
}
