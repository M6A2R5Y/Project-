/**
 * Event listener for the DOMContentLoaded event.
 * Initializes the car list and search functionality.
 */
document.addEventListener('DOMContentLoaded', function()
{
   const loginForm = document.getElementById('loginForm');
   const registerForm = document.getElementById('registerForm');
   
   
   
    const carList = document.getElementById('car-list');
    const searchInput = document.getElementById('search');
     /**
   * Array of car objects.
   */
    const cars = [
        {
          image: 'Honda Civic.jpg',
          model:'Honda Civic',
          year:2019,
          price:'Ksh 2,340,000'
        },
        {
            image: 'Chevrolet Camaro.jpg'.
            model:'Chevrolet Camaro',
            year:2020,
            price:'Ksh 3,640,000'
        },
        {
            image: 'BMW 3 Series.jpg',
            model:'BMW 3 Series',
            year:2018,
            price:'Ksh 3,250,000'
        },
        {
            image: 'Toyota Corolla.jpg',
            model:'Toyota Corolla',
            year:2020,
            price:'Ksh 2,600,000'
        },
        {
            image: 'Audi A4.jpg',
            model:'Audi A4',
            year:2019,
            price:'Ksh 3,510,000'
        },
        {
            image: 'Mercedes-Benz C-Class.jpg',
            model:'Mercedes-Benz C-Class',
            year:2020,
            price:'Ksh 4,550,000'
        },
        {
            image: 'Hyundai Elantra.jpg',
            model:'Hyundai Elantra',
            year:2021,
            price:'Ksh 2,470,000'
        },
        {
            image: 'Nissan Altima.jpg',
            model:'Nissan Altima',
            year:2020,
            price:'Ksh 2,860,000'
        },
        {
            image: 'Subaru Outback.jpg',
            model:'Subaru Outback',
            year:2019,
            price:'Ksh 3,120,000'
        },
        {
            image: 'Volkswagen Passat.jpg',
            model:'Volkswagen Passat',
            year:2020,
            price:'Ksh 3,380,000'
        },
        {
            image: 'Ford Mustang.jpg',
            model:'Ford Mustang',
            year:2021,
            price:'Ksh 3,900,000'
        },
        {
            image: 'Kia Optima.jpg',
            model:'Kia Optima',
            year:2021,
            price:'Ksh 2,730,000'
        },
        {
            image: 'Honda Accord.jpg',
            model:'Honda Accord',
            year:2018,
            price:'Ksh 2,665,000'
        },
        {
            image: 'Ford Fusion.jpg',
            model:'Ford Fusion',
            year:2019,
            price:'Ksh 2,990,000'
        },
        {
            image: 'Chevrolet Malibu.jpg',
            model:'Chevrolet Malibu',
            year:2020,
            price:'Ksh 2,925,000'
        },
        {
            image: 'Toyota Camry.jpg',
            model:'Toyota Camry',
            year:2021,
            price:'Ksh 3,185,000'
        },
        {
            image: 'Hyundai Sonata.jpg',
            model:'Hyundai Sonata',
            year:2020,
            price:'Ksh 3,055,000'
        },
        {
            image: 'Nissan Maxima.jpg',
            model:'Nissan Maxima',
            year:2019,
            price:'Ksh 3,705,000'
        }
    ];
};

async function searchCars() {
    const query = document.getElementById('search').value.toLowerCase();
    try {
        const response = await fetch('http://localhost:3000/api/cars');
        const cars = await response.json();

        const results = cars.filter(car => 
        car.make.toLowerCase().includes(query) || 
        car.model.toLowerCase().includes(query) ||
        car.year.toString().includes(query) ||
        car.price.toLowerCase().includes(query)
    );

    displayResults(results);
    } catch (error) {
        console.error('Error fetching data:',error);
    }
}

function displayResults(results) {
    const carList = document.querySelector('#search-results .car-list');
    carList.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        carList.innerHTML = '<p>No cars found.</p>';
        return;
    }

    results.forEach(car => {
        const carItem = document.createElement('div');
        carItem.classList.add('car-item');

        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.make} ${car.model}">
            <h3>${car.make} ${car.model}</h3>
            <p>Year: ${car.year}</p>
            <p>Price: ${car.price}</p>
        `;

        carList.appendChild(carItem);
    });
}
