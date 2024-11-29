import 'package:equatable/equatable.dart';

abstract class BottomNavEvent extends Equatable {
  const BottomNavEvent();

  @override
  List<Object> get props => [];
}

class ChangeTab extends BottomNavEvent {
  final int index;
  const ChangeTab(this.index);

  @override
  List<Object> get props => [index];
}
