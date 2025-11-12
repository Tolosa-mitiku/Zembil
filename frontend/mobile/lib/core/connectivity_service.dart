import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

enum ConnectivityStatus { connected, disconnected, unknown }

class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  final _connectivityController = StreamController<ConnectivityStatus>.broadcast();
  
  Stream<ConnectivityStatus> get connectivityStream => _connectivityController.stream;
  ConnectivityStatus _currentStatus = ConnectivityStatus.unknown;

  ConnectivityService() {
    _init();
  }

  Future<void> _init() async {
    // Check initial status
    final result = await _connectivity.checkConnectivity();
    _updateStatus(result);

    // Listen for connectivity changes
    _connectivity.onConnectivityChanged.listen((result) {
      _updateStatus(result);
    });
  }

  void _updateStatus(List<ConnectivityResult> result) {
    ConnectivityStatus newStatus;
    
    if (result.contains(ConnectivityResult.mobile) || 
        result.contains(ConnectivityResult.wifi) ||
        result.contains(ConnectivityResult.ethernet)) {
      newStatus = ConnectivityStatus.connected;
    } else if (result.contains(ConnectivityResult.none)) {
      newStatus = ConnectivityStatus.disconnected;
    } else {
      newStatus = ConnectivityStatus.unknown;
    }

    if (_currentStatus != newStatus) {
      _currentStatus = newStatus;
      _connectivityController.add(newStatus);
      debugPrint('🌐 Connectivity changed: $newStatus');
    }
  }

  Future<bool> hasInternetConnection() async {
    try {
      final result = await _connectivity.checkConnectivity();
      return result.contains(ConnectivityResult.mobile) || 
             result.contains(ConnectivityResult.wifi) ||
             result.contains(ConnectivityResult.ethernet);
    } catch (e) {
      debugPrint('❌ Error checking connectivity: $e');
      return false;
    }
  }

  ConnectivityStatus get currentStatus => _currentStatus;

  void dispose() {
    _connectivityController.close();
  }
}

