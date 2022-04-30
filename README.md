# Introduction
Hello! My name is Samuel Bernal and I am an aspiring software developer currently wrapping up my second year of college at the University of Delaware. I major in computer science, and as my curriculum has become more focused on practical development, I have also become more curious about what development actually looks like in the real world. What are the standards? What tools are professionals using? How much is a piece of software actually capable of? These are the questions that drove me to search for an internship this summer, and the IGN Code Foo program seems like the perfect place to fulfill my curiosity.

As for what drove me to IGN specifically, it probably comes as no surprise that IGN had a big role in my childhood through the video games that I loved to play. Looking through reviews and articles to find the next new adventure, and (sometimes embarrassingly) having to look up guides when I hit a roadblock in my journey. All the new experiences that IGN opened up to me will forever be cherished. Being able to take part in the legacy of a company as pivotal to gaming as IGN would truly be an honor, and I can’t think of a more exciting internship.

So, why should you pick me? I’ve had experience creating partially dynamic websites in a team for years through various after school clubs and programs, and more recently I’ve been delving into full blown web apps and programs through my college courses. That’s mostly the reason that I decided to go with the backend project for my application; My backend experience is probably my weakest point as a software developer. Before starting this project I had never really interacted with sql databases, establishing connections, or responding to user requests, so most of what you see here is the application of new knowledge for me. In creating this project, I applied skills of quick learning and problem solving, pulling on my previous experience with javascript, to create something with functionality and utility. That is the kind of effort you can expect from me going into this program.

Additionally, my skills as a student and worker extend beyond just coding. Teamwork has been a consistent characteristic of my time in schools and activities, so I know how to navigate a collaborative environment. I also have a good deal of experience in graphic design, clerical work, and even research. I have a lot to draw upon from my past endeavors, and I’m fully committed to bringing anything that is needed to the table this summer. 

If all this sounds like a good fit, you can be sure that you’ll have my best effort for this program.

# Hisui’s New Power Plant
Here's my plan for creating Jubilife village's new power plant:
1. Establish the electricity needs of Jubilife village - What is probably the first step in creating any power plant (Pokemon powered or not) is finding the demand of electricity that needs to be fulfilled. Getting this information will require a few steps:<br>
    a. Draw upon currently existing knowledge of Jubilife’s energy usage, whether it be from the library, energy companies, etc.<br>
    b. If the data from step A is not sufficient to draw conclusions, conduct a study into how much the citizens of the village need.<br>
    c. Use the data collected to find a minimum value of megawatts needed for both current and future energy needs.

2. Look into the energy generation of Voltorbs - This will also come in a few steps:<br>
    a. If a couple Voltorbs aren’t on hand, a few need to be caught for testing purposes.<br>
    b. Look into the factors that affect how much energy Voltorbs produce, such as energy collection method, what kind of food they’re given, etc. Whatever the most practical method is will be the baseline for how much energy a Voltorb will be expected to produce.

3. Catch your Voltorbs - With the energy needs of Jubilife village established, as well as how much each Voltorb produces, all that’s left to do is to catch the right number and hook them up to the grid.

# Back End API Project
For my application I have created a simple API with the Express Node.js framework, utilizing the internal database capabilities of sqlite. The main function of the app is to unpack the given csv file into an sql script, execute the script on the internal database, and read out the data back to the user via HTTP requests. The data the user receives comes in the form of a stringified JSON, so as to make the data as organized and usable as possible. In terms of how the data is sanitized and stored, the npm package csv-to-sql-script reformats the lines of the csv so that each media item is a row in a given database table, making retrieval and repackaging simple. The data is indexed alphabetically by title, and includes all of its information as in the original file.

## Using the Program:
As a prerequisite, the npm file management system needs to be installed in order to build the project.

Once downloaded, open the main project folder in some terminal, and run the command:
npm install
This should install all of the needed dependencies and build the App. To run the program:
		node src
The App should now be listening for a request on http://localhost:3000/. This should be accessible from any browser.


## Endpoint Documentation
By default, simply requesting localhost should return the user an array of every title and id in the database. This is to give the user a quick initial idea of the data that the api provides.

#### ‘full’ Endpoint:
Gives JSON objects with all of their initial fields, if a user wants to access the totality of the data.

/full - Array of every item in the database with every field.

/full/id/(id of desired item) - Retrieves a single item by its id. For example, http://localhost:3000/full/id/200 should return information on the game “Need for Speed Heat”.

/full/score - Returns every item in the database sorted by its review score in ascending order.

/full/type - Returns every item sorted by media type.

/full/genre/(desired genre) - Returns every item of a certain genre. Examples include http://localhost:3000/full/genre/Action or http://localhost:3000/full/genre/RPG.

#### ‘info’ Endpoint:
Gives JSON objects with only the fields not pertaining to the review of the media, for if a user wants information solely on the works included in the database.

/info - Array of every item in the database with non-review fields.

/info/id/(id of desired item) - Retrieves a single item by its id. For example, http://localhost:3000/info/id/200 should return information on the game “Need for Speed Heat”.

/info/score - Returns every item in the database sorted by its review score in ascending order.

/info/type - Returns every item sorted by media type.

/info/genre/(desired genre) - Returns every item of a certain genre. Examples include http://localhost:3000/info/genre/Action or http://localhost:3000/info/genre/RPG.

## Notes
-The rewriting of data may take a few seconds, so the program may initially not return anything. Once the data is loaded, however, simply resending the request should fix the issue.<br>
-A possible point of failure for the program is the use of fs.watchFile() function, which is not compatible with every platform. It’s necessary to make sure that the dbinfo.sql has been loaded with commands before it is executed by sqlite.
