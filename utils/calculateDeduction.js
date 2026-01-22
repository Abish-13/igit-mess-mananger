const calculateDeduction = (stoppedMeals, totalMeals) => {
  const mealCost = 50; // assume per meal
  return (stoppedMeals / totalMeals) * mealCost * totalMeals;
};

module.exports = { calculateDeduction };