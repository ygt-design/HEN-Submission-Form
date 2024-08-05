
# Are.na Channel Creation Form

This project allows users to create a new Are.na channel with a description, tags, location, URL, and a hero image. The form is designed to fetch available tags from the Are.na channels and let users select or add their own tags. It also uploads the hero image to Imgur and uses the image URL to create a block in the Are.na channel.

## Features

- Create a new Are.na channel with a specified name and description.
- Fetch and display available tags from Are.na channels.
- Allow users to select existing tags or add custom tags.
- Include a location and a URL in the channel.
- Upload a hero image to Imgur and add it to the Are.na channel as a block.
- Display a loading screen while fetching tags.

## Technologies Used

- HTML
- CSS
- JavaScript
- Are.na API
- Imgur API

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/ygt-design/HENArchives.git
    cd HENArchives
    ```

2. Open `index.html` in your preferred web browser.

## Files

- `index.html`: The main HTML file containing the form structure.
- `style.css`: The CSS file for styling the form and the loading screen.
- `script.js`: The JavaScript file for handling form submission, API requests, and loading screen management.

## Usage

1. Open `index.html` in a web browser.
2. Fill in the form with the required details:
    - **Name**: The name of the Are.na channel.
    - **Description**: The description of the Are.na channel.
    - **Tags**: Select from the available tags or add custom tags.
    - **Location**: Specify the location.
    - **URL**: Provide a valid URL.
    - **Hero Image**: Upload an image file (will be uploaded to Imgur).
3. Click on "Create Channel" to create the Are.na channel with the provided details.

## Dependencies

- Fetch API: Used for making HTTP requests to Are.na and Imgur APIs.

## License

This project is licensed under the MIT License.
