// Define the AngularJS application module
var app = angular.module('authApp', []);

// Main Controller for Authentication
app.controller('AuthController', function ($scope, $http) {
  $scope.user = {};
  $scope.isLoggedIn = !!localStorage.getItem('loggedInUser'); // Check if the user is logged in

  // Register function
  $scope.register = function () {
    if ($scope.user.name && $scope.user.email && $scope.user.password && $scope.user.role) {
      $http.post('http://localhost:3001/users', $scope.user)
        .then(function (response) {
          alert('Registration successful!');
          window.location.href = 'login.html'; // Redirect to login page
        })
        .catch(function (error) {
          alert('Error during registration.');
        });
    } else {
      alert('All fields are required.');
    }
  };

  // Login function
  $scope.login = function () {
    if ($scope.user.email && $scope.user.password) {
      $http.get('http://localhost:3001/users')
        .then(function (response) {
          const user = response.data.find(
            (u) => u.email === $scope.user.email && u.password === $scope.user.password
          );
          if (user) {
            alert('Login successful!');
            localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save user info
            $scope.isLoggedIn = true; // Update login state
            window.location.href = 'dashboard.html'; // Redirect to dashboard
          } else {
            alert('Invalid email or password.');
          }
        })
        .catch(function (error) {
          alert('Error during login.');
        });
    } else {
      alert('Email and password are required.');
    }
  };

  // Logout function
  $scope.logout = function () {
    localStorage.removeItem('loggedInUser'); // Clear user data
    $scope.isLoggedIn = false; // Update login state
    alert('Logged out successfully.');
    window.location.href = 'login.html'; // Redirect to login page
  };
});

// Controller for the Dashboard
app.controller('DashboardController', function ($scope) {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (loggedInUser) {
    $scope.loggedInUser = JSON.parse(loggedInUser); // Parse logged-in user details
  } else {
    alert('Please log in first.');
    window.location.href = 'login.html'; // Redirect to login if not logged in
  }

  // Logout function
  $scope.logout = function () {
    localStorage.removeItem('loggedInUser'); // Clear user data
    alert('Logged out successfully.');
    window.location.href = 'login.html'; // Redirect to login page
  };

  // Redirect to homepage
  $scope.goHome = function () {
    window.location.href = 'index.html'; // Redirect to homepage
  };
});

// Main Controller for Homepage
app.controller('MainController', function ($scope) {
  // Check login state when the app starts
  $scope.isLoggedIn = !!localStorage.getItem('loggedInUser');

  // Redirect to login page
  $scope.goToLogin = function () {
    window.location.href = 'login.html';
  };

  // Logout function
  $scope.logout = function () {
    localStorage.removeItem('loggedInUser'); // Clear local storage
    $scope.isLoggedIn = false; // Update login state
    alert('You have been logged out.');
    window.location.reload(); // Reload the page to update UI
  };
});
