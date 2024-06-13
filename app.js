document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
});

const fetchCategories = async () => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        const data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('mainCategories');
    categoriesContainer.innerHTML = '';
    const heading = document.getElementById('heading');
    heading.innerHTML = 'CATEGORIES';
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <button>${category.strCategory.toUpperCase()}</button>
        `;
        categoryDiv.onclick = () => fetchMealsByCategory(category.strCategory);
        categoriesContainer.appendChild(categoryDiv);
    });
};

const fetchMealsByCategory = async (category) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        displayCategoryDescription(category);
        displayMeals(data.meals);
    } catch (error) {
        console.error('Error fetching meals by category:', error);
    }
};

const displayCategoryDescription = async (categoryName) => {
    const categoriesContainer = document.getElementById('mainCategories');
    categoriesContainer.innerHTML = '';
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        const data = await response.json();
        const category = data.categories.find(cat => cat.strCategory === categoryName);
        if (category) {
            const description = document.getElementById('description');
            description.className = 'description';
            description.innerHTML = `
                <h1>${category.strCategory}</h1>
                <p>${category.strCategoryDescription}</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching category description:', error);
    }
};

const displayMeals = (meals) => {
    console.log(meals);
    const categoriesContainer = document.getElementById('mainCategories');
    categoriesContainer.innerHTML='';               
    const heading = document.getElementById('heading');
    heading.innerHTML = 'MEALS';
    heading.style.marginLeft = '4px';

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.innerHTML = `
            <a href="./mealsrecipe"><img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h4>${meal.strArea}</h4>
            <h3>${meal.strMeal}</h3></a>
        `;
        categoriesContainer.onclick=()=> fetchMealsRecipe(meal.strMeal);
        categoriesContainer.appendChild(mealDiv);
    });
};

async function searchMeal() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) {
        alert('Input field cannot be empty');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
        const data = await response.json();
        console.log(data.meals);
        if (data.meals) {
            data.meals.forEach((category)=>{
                displayCategoryDescription(category.strCategory);
            })

            displayMeals(data.meals);
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error searching for meal:', error);
    }
}

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
}

document.querySelector('.hamburger').addEventListener('click', openNav);

document.querySelectorAll('#sidebar a').forEach((link) => {
    link.addEventListener('click', () => {
        fetchMealsByCategory(link.textContent);
    });
});