// Generate diet plan based on calorie target and macros
export const generateDietPlan = (daily_calorie_target, goal, macros) => {
  const mealsPerDay = 4; // Default to 4 meals
  const caloriesPerMeal = Math.round(daily_calorie_target / mealsPerDay);
  
  let meals = [
    {
      meal_number: 1,
      meal_name: 'Breakfast',
      description: 'Oats with protein powder and banana',
      estimated_calories: caloriesPerMeal,
      macros: {
        protein_g: Math.round(macros.protein_grams / mealsPerDay),
        carbs_g: Math.round(macros.carbs_grams / mealsPerDay),
        fat_g: Math.round(macros.fat_grams / mealsPerDay)
      }
    },
    {
      meal_number: 2,
      meal_name: 'Snack',
      description: 'Greek yogurt with berries',
      estimated_calories: caloriesPerMeal,
      macros: {
        protein_g: Math.round(macros.protein_grams / mealsPerDay),
        carbs_g: Math.round(macros.carbs_grams / mealsPerDay),
        fat_g: Math.round(macros.fat_grams / mealsPerDay)
      }
    },
    {
      meal_number: 3,
      meal_name: 'Lunch',
      description: 'Chicken breast with rice and vegetables',
      estimated_calories: caloriesPerMeal,
      macros: {
        protein_g: Math.round(macros.protein_grams / mealsPerDay),
        carbs_g: Math.round(macros.carbs_grams / mealsPerDay),
        fat_g: Math.round(macros.fat_grams / mealsPerDay)
      }
    },
    {
      meal_number: 4,
      meal_name: 'Dinner',
      description: 'Salmon with sweet potato and broccoli',
      estimated_calories: caloriesPerMeal,
      macros: {
        protein_g: Math.round(macros.protein_grams / mealsPerDay),
        carbs_g: Math.round(macros.carbs_grams / mealsPerDay),
        fat_g: Math.round(macros.fat_grams / mealsPerDay)
      }
    }
  ];
  
  // Adjust for weight loss (add extra protein meal)
  if (goal === 'Weight Loss') {
    meals.push({
      meal_number: 5,
      meal_name: 'Pre-bed Snack',
      description: 'Casein or cottage cheese',
      estimated_calories: Math.round(daily_calorie_target * 0.1),
      macros: {
        protein_g: Math.round(macros.protein_grams * 0.1),
        carbs_g: Math.round(macros.carbs_grams * 0.1),
        fat_g: Math.round(macros.fat_grams * 0.1)
      }
    });
  }
  
  return meals;
};

export const getMealSuggestions = (goal, mealType) => {
  const suggestions = {
    'Breakfast': {
      'Weight Loss': ['Egg whites with oats', 'Greek yogurt with granola', 'Protein pancakes', 'Chicken and rice'],
      'Muscle Gain': ['Oats with peanut butter', 'Eggs and toast', 'Protein smoothie bowl', 'Pancakes with syrup'],
      'Maintenance': ['Cereal with milk', 'Toast with avocado', 'Oatmeal with fruit', 'Eggs and bacon']
    },
    'Lunch': {
      'Weight Loss': ['Grilled chicken breast with broccoli', 'Turkey breast sandwich', 'Tuna salad', 'Lean ground turkey with rice'],
      'Muscle Gain': ['Steak with sweet potato', 'Salmon with rice and veggies', 'Chicken with pasta', 'Lamb with potatoes'],
      'Maintenance': ['Chicken with rice', 'Turkey burger', 'Fish tacos', 'Pork chops with veggies']
    },
    'Dinner': {
      'Weight Loss': ['Salmon with vegetables', 'Lean ground beef with veggies', 'White fish with asparagus', 'Chicken with green beans'],
      'Muscle Gain': ['Ribeye steak with potatoes', 'Salmon with sweet potato', 'Chicken thighs with rice', 'Ground beef tacos'],
      'Maintenance': ['Pork tenderloin with carrots', 'Chicken breast with quinoa', 'Fish with roasted veggies', 'Beef stew']
    }
  };
  
  return suggestions[mealType] || [];
};
