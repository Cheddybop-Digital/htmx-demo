htmx.on("htmx:afterRequest", (e) => {
  // this listens for form success. If not successful, keep the modal open
  // and show error messages. If successful, close the modal
  if (
    e.detail.requestConfig.headers["HX-Trigger"] === "htmx-user-form" &&
    e.detail.xhr.status === 201
  ) {
    // if no errors come back, reset form and close modal
    document.getElementById("htmx-user-form").reset();
    if (e.detail.requestConfig.verb === "post") user_create_modal.close();
    if (e.detail.requestConfig.verb === "put") user_edit_modal.close();
  }
});
