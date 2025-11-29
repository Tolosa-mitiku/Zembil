class ValidatePassword {
  String? call(String? password) {
    if (password!.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  }
}
