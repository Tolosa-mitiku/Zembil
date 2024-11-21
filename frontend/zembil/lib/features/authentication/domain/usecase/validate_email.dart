class ValidateEmail {
  String? call(String? email) {
    final emailRegex =
        RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
    if (!emailRegex.hasMatch(email!)) {
      return 'Enter a valid email address';
    }
    return null;
  }
}
