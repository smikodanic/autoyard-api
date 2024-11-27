// makes from mobile.de - open mobile.de and run in the console
const carMakes = [];
document.querySelectorAll('#qs-select-make option').forEach(option => {
  if (option.value) {
    option.text = option.text.replace(/Alle/i, 'All');
    option.text = option.text.replace(/Andere/i, 'Other');
    option.text = option.text.replace(/Beliebig/i, 'Any');
    carMakes.push(option.text);
  }
});
console.log(carMakes);


// models from mobile.de - open mobile.de and run in the console
const carModels = [];
document.querySelectorAll('#qs-select-model option').forEach(option => {
  if (option.value) {
    option.text = option.text.replace(/Alle/i, 'All');
    option.text = option.text.replace(/Andere/i, 'Other');
    option.text = option.text.replace(/Beliebig/i, 'Any');
    carModels.push(option.text);
  }
});
console.log(carModels);
