function getErrorMessage(error) {
  const code = error.code;
  const errorMessage = error.message;

  switch (code) {
    case "auth/user-not-found":
      return "User not found";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "User disabled";
    case "auth/wrong-password":
      return "Wrong password";
    default:
      return errorMessage;
  }
}

export default getErrorMessage;
