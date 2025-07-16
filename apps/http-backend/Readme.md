{
  type: "validation_error" | "server_error" | "unauthorized" | "not_found",
  message: string,
  errors?: object // only for validation errors
}
<br>
This is being followed