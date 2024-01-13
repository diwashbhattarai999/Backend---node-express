## MVC

- Separation of concerns i.e making sure that different parts of our code do different things
- Stands for Models Views Conrollers

### Models

- They are basically objects or is a part of our code that is responsible for representing your data
- Allows to work with our data ( e.g. save, fetch)
- Doesn't matter if we manage data in memory, files, databases
- Contains data-related logic

### Views

- Responsible for what users sees
- Decoupled from our application code
- Shouldn't contain too much logic

### Controllers

- Connecting our models and views
- Contains the "in-between" logic
- Should only make sure that the two can communicate ( in both directions )
