const log = (message) => {
  console.log(message);
};

const sortAsc = (array) => {
  return array.sort((a, b) => {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  });
};

const sortDesc = (array) => {
  return array.sort((a, b) => {
    if (a > b) return -1;
    else if (a < b) return 1;
    else return 0;
  });
};

const sortAscByProperty = (array, property) => {
  return array.sort((a, b) => {
    if (a[property] > b[property]) return 1;
    else if (a < b) return -1;
    else return 0;
  });
};

const sortDescByProperty = (array, property) => {
  return array.sort((a, b) => {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;
    else return 0;
  });
};

export { log, sortAsc, sortDesc, sortAscByProperty, sortDescByProperty };