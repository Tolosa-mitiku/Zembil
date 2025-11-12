abstract class EmailVerificationEvent {}

class SendEmailVerificationEvent extends EmailVerificationEvent {}

class CheckEmailVerificationEvent extends EmailVerificationEvent {}

// login events

class ZembilLogInEvent extends EmailVerificationEvent {}
