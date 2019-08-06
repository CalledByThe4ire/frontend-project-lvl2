const countNumberOfStateChange = (ast, state) =>
  ast.reduce((acc, data) => {
    const { type, children } = data;
    const newAcc = type !== state ? acc : acc + 1;

    if (!children) {
      return newAcc;
    }
    return newAcc + countNumberOfStateChange(children, state);
  }, 0);

export default ast =>
  JSON.stringify(
    {
      addedPropertiesCount: countNumberOfStateChange(ast, 'added'),
      removedPropertiesCount: countNumberOfStateChange(ast, 'removed'),
      changedPropertiesCount: countNumberOfStateChange(ast, 'changed'),
      unchangedPropertiesCount: countNumberOfStateChange(ast, 'unchanged'),
    },
    null,
    '\t',
  );
