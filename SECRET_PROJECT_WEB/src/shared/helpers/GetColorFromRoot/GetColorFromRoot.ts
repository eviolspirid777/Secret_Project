export const getColorFromRoot = (variableName: string) => {
  const root = document.documentElement;
  const style = window.getComputedStyle(root);
  return style.getPropertyValue(variableName).trim();
};
