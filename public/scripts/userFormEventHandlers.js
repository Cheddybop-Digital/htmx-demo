htmx.on("htmx:afterRequest", (e) => {
  const eventIsFromTheUserForm =
    e.detail.requestConfig.headers["HX-Trigger"] === "htmx-user-form";
  const eventWasSuccessful = [200, 201].includes(e.detail.xhr.status);
  const httpVerb = e.detail.requestConfig.verb;

  // An error response will have a status of 207
  if (eventIsFromTheUserForm && eventWasSuccessful) {
    // if no errors come back, reset form and close modal
    document.getElementById("htmx-user-form").reset();

    if (httpVerb === "post") user_create_modal.close();
    if (httpVerb === "put") user_edit_modal.close();
  }
});
