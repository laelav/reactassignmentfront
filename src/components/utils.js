function getName() {
  const name = Math.random()
    .toString(36)
    .substring(2);
  return name[0].toUpperCase() + name.substring(1);
}

export const getRows = num => {
  return [...Array(num).keys()].map(a => ({
    id: a,
    name: `${getName()} ${getName()}`,
    count: Math.floor(Math.random() * 100)
  }));
};
