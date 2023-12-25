// * Create a namespace on the window and assign to a convenient variable
tableData = window.tableData;

const startingSort = "";

// * add data and functions/behavior to the namespace
tableData = {
  _sortDir: startingSort,
  _sortField: "",
  _searchField: "",
  _searchTerm: "",

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
  get searchField() {
    return this._searchField;
  },
  set searchField(field) {
    this._searchField = field;
  },
  get searchTerm() {
    return this._searchTerm;
  },
  set searchTerm(val) {
    this._searchTerm = val;
  },
  toggleSort() {
    switch (this._sortDir) {
      case "asc":
        this._sortDir = "desc";
        return this.sortDir;
      case "desc":
        this._sortDir = startingSort;
        return this.sortDir;
      case startingSort:
        this._sortDir = "asc";
        return this.sortDir;
      default:
        return this.sortDir;
    }
  },
  toggleSearchInput(className) {
    const node = document.querySelector(`.th-container-${className}`);
    if (node.classList.contains("show-input")) {
      node.classList.remove("show-input");
    } else {
      node.classList.add("show-input");
    }
  },
  searchIconClickHandler(field) {
    this._searchField = field;
    this.toggleSearchInput(field);
  },
  submitHandler(event, field) {
    event.preventDefault();

    // set the search term, so it isn't lost when sorting changes
    tableData._searchTerm = Array.from(document.forms).find(
      (f) => f.name === `search-form-${field}`,
    )?.searchTerm?.value;

    // set the sortField
    tableData._sortField = field;
  },
  clearFilters() {
    // clear data
    this._searchTerm = "";
    this._searchField = "";
    this._sortDir = "";
    this._sortField = "";

    // reset the url
    const url = new URL(window.location);
    // remove all query params by reverting url to origin only
    window.location.replace(`${url.origin}/users`);
  },
};

addEventListener("DOMContentLoaded", (event) => {
  // TODO: parse url search params and set their values on page load
});

// total=`${Math.ceil(<%= it.count %>/<%= it.limit %>))}`
