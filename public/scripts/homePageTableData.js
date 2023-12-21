// * Create a namespace on the window and assign to a convenient variable
tableData = window.tableData;

const startingSort = "";

// * add data and functions/behavior to the namespace
tableData = {
  sortDir: startingSort,
  sortField: "",
  searchField: "",
  searchTerm: "",
  setSearchTerm(term) {
    this.searchTerm = term;
  },
  getSearchTerm() {
    return this.searchTerm;
  },
  getSortDir() {
    return this.sortDir;
  },
  setSortField(field) {
    this.sortField = field;
  },
  getSortField() {
    return this.sortField;
  },
  getSearchField() {
    return this.searchField;
  },
  setSearchField(field) {
    this.searchField = field;
  },
  setSortDir(value) {
    this.sortDir = value;
  },
  toggleSort() {
    switch (this.sortDir) {
      case "asc":
        this.sortDir = "desc";
        return this.sortDir;
      case "desc":
        this.sortDir = startingSort;
        return this.sortDir;
      case startingSort:
        this.sortDir = "asc";
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
    this.setSearchField(field);
    this.toggleSearchInput(field);
  },
  submitHandler(field) {
    // set the search term, so it isn't lost when sorting changes
    tableData.setSearchTerm(
      Array.from(document.forms).find((f) => f.name === `search-form-${field}`)
        ?.searchTerm?.value,
    );

    // set the sortField
    tableData.setSortField(field);
  },
  clearFilters() {
    this.setSearchTerm("");
    this.setSearchField("");
    this.setSortDir("");
    this.setSortField("");
  },
};
