import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/navigation/bloc/navigation_event.dart';
import 'package:zembil/features/navigation/bloc/navigation_state.dart';

class BottomNavBloc extends Bloc<BottomNavEvent, BottomNavState> {
  BottomNavBloc() : super(BottomNavState.initial()) {
    on<ChangeTab>((event, emit) {
      emit(state.copyWith(selectedIndex: event.index));
    });
  }
}
