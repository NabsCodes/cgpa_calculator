# CGPA Calculator

A comprehensive CGPA (Cumulative Grade Point Average) calculator web application available in two versions:

- **Django Version**: The original implementation (details below)
- **NextJS Version (v2)**: A modern, optimized version with enhanced UI/UX

## Table of Contents

1. [Features](#features)
<<<<<<< HEAD
2. [Versions](#versions)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)
=======
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
>>>>>>> refs/remotes/origin/main

## Features

- Calculates CGPA for students based on their course grades and credit hours
- Responsive design that works on both desktop and mobile devices
- Customizable grade scale
- User-friendly interface with easy input and clear results
- GPA Goal Planning for mapping academic targets
- Export functionality for saving your data

## Versions

### Django Version (Original)

The original implementation built with Django, offering a straightforward and reliable CGPA calculator.

### NextJS Version (v2)

A completely redesigned version built with NextJS, React, TypeScript, and TailwindCSS offering:

- Modern, responsive UI with elegant animations
- Enhanced user experience with keyboard navigation
- Dark/light mode support
- Improved performance with client-side processing
- Goal planning features for achieving target CGPAs
- Academic honors reference guide
- No database required - runs entirely in the browser

## Requirements

### Django Version

- Python 3.6 or higher
- Django 3.2 or higher

### NextJS Version

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

### Django Version

1. Clone this repository:

```
git clone https://github.com/NabsCodes/cgpa_calculator.git
```

2. Install dependencies:

```
pip install -r requirements.txt
```

3. Run the Django development server:

```
python manage.py runserver
```

### NextJS Version

1. Navigate to the NextJS project directory:

```
cd cgpa_calculator/cgpa-calculator-nextjs
```

2. Install dependencies:

```
pnpm install
```

3. Run the development server:

```
pnpm run dev
```

## Usage

### Django Version

1. Open your browser and go to `http://localhost:8000/`.
2. Input your current CGPA and total credits earned.
3. Add your courses, their credit hours, and grades.
4. The app will automatically calculate your CGPA and display the results.

### NextJS Version

1. Open your browser and go to `http://localhost:3000/`.
2. Choose between the CGPA Calculator or GPA Goal Planner.
3. For the calculator: add your courses with credit hours and grades.
4. For the goal planner: set your current status and target GPA.
5. View results in real-time as you interact with the app.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or report issues.
