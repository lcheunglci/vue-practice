export default function (element, binding) {
  element.style.position = 'absolute';
  // Object.keys(binding.modifiers).forEach((key) => {
  Object.keys(binding.value).forEach((key) => {
    // element.style[key] = '5px';
    element.style[key] = binding.value[key];
  });
}
