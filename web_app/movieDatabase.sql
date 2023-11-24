CREATE Database if not exists movieDataBase;
USE movieDatabase;

DROP TABLE if exists Actor;
DROP TABLE if exists Movie;
DROP TABLE if exists cinema_room;
DROP TABLE if exists participate;
DROP TABLE if exists broadcast;
CREATE TABLE Actor(
   id_actor int auto_increment,
   name VARCHAR(50) NOT NULL,
   role VARCHAR(50),
   rewards VARCHAR(50),
   birthdate DATE NOT NULL,
   nationality VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_actor)
);

CREATE TABLE Movie(
   id_movie int auto_increment,
   title VARCHAR(50) NOT NULL,
   gender VARCHAR(50) NOT NULL,
   summary VARCHAR(200),
   grade DECIMAL(3,1) NOT NULL,
   age_require INT,
   language_ VARCHAR(50) NOT NULL,
   production_price DECIMAL(15,2) NOT NULL,
   duration TIME NOT NULL,
   projection_format VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_movie)
);

CREATE TABLE cinema_room(
   id_cinema_room int auto_increment,
   cinema_name VARCHAR(50) NOT NULL,
   floor_ INT NOT NULL,
   number INT NOT NULL,
   capacity INT NOT NULL,
   format_screen VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_cinema_room)
);

CREATE TABLE partcipate(
   id_actor INT,
   id_movie INT,
   PRIMARY KEY(id_actor, id_movie),
   FOREIGN KEY(id_actor) REFERENCES Actor(id_actor),
   FOREIGN KEY(id_movie) REFERENCES Movie(id_movie)
);

CREATE TABLE broadcast(
   id_movie INT,
   id_cinema_room INT,
   PRIMARY KEY(id_movie, id_cinema_room),
   FOREIGN KEY(id_movie) REFERENCES Movie(id_movie),
   FOREIGN KEY(id_cinema_room) REFERENCES cinema_room(id_cinema_room)
);
