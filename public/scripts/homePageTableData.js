// * Create a namespace on the window and assign to a convenient variable
tableData = window.tableData;

// * add data and functions/behavior to the namespace
tableData = {
  _sortDir: "",
  _sortField: "",

  get sortDir() {
    return this._sortDir;
  },
  set sortDir(val) {
    this._sortDir = val;
  },
  set sortField(field) {
    this._sortField = field;
  },
  get sortField() {
    return this._sortField;
  },
  toggleSort(field) {
    if (field !== this.sortField) {
      // if the sort field is not the same as the last one
      // then reset the sort direction steps
      this.sortDir = "";
      this.sortField = field;
    }
    switch (this.sortDir) {
      case "asc":
        this.sortDir = "desc";
        return this.sortDir;
      case "desc":
        this.sortDir = "";
        return this.sortDir;
      case "":
        this.sortDir = "asc";
        return this.sortDir;
      default:
        return this.sortDir;
    }
  },
  toggleSearchInput(field) {
    const node = document.querySelector(`.th-container-${field} input`);
    if (node.classList.contains("hide")) {
      node.classList.remove("hide");
      node.focus();
    } else {
      node.classList.add("hide");
    }
  },
  clearFilters() {
    // clear data
    this.sortDir = "";
    this.sortField = "";

    // reset the url
    const url = new URL(window.location);
    // remove all query params by reverting url to origin only
    window.location.replace(`${url.origin}/users`);
  },
};
