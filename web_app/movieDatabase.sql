Drop database movieDatabase;
CREATE Database movieDataBase;
USE movieDatabase;
DROP TABLE if exists Users;
DROP TABLE if exists Actor;
DROP TABLE if exists Movie;
DROP TABLE if exists Room;
DROP TABLE if exists participate;
DROP TABLE if exists broadcast;

CREATE TABLE Users (
        id_user int auto_increment primary key,
        user_created datetime,
        user_name varchar(100) unique,
        email varchar(100) unique,
        user_role varchar(100),
        password varchar(100)
);
CREATE TABLE Actor(
        id_actor    int auto_increment,
        name        VARCHAR(50) NOT NULL,
        rewards     VARCHAR(50),
        birthdate   DATE        NOT NULL,
        nationality VARCHAR(50) NOT NULL,
        PRIMARY KEY (id_actor)
);

CREATE TABLE Movie(
        id_movie          int auto_increment,
        movie_title       VARCHAR(50),
        gender            VARCHAR(50),
        summary           VARCHAR(200),
        grade             DECIMAL(3, 1),
        age_require       INT,
        languages         CHAR(50),
        production_price  DECIMAL(15, 2),
        duration          TIME,
        projection_format VARCHAR(50),
        PRIMARY KEY (id_movie)
);

CREATE TABLE Room(
        id_room int auto_increment,
        cinema_name    VARCHAR(50) NOT NULL,
        floor          INT         NOT NULL,
        area           INT         NOT NULL,
        capacity       INT         NOT NULL,
        format_screen  VARCHAR(50) NOT NULL,
        PRIMARY KEY (id_room)
);

CREATE TABLE partcipate(
        id_actor INT,
        id_movie INT,
        PRIMARY KEY (id_actor, id_movie),
        FOREIGN KEY (id_actor) REFERENCES Actor (id_actor),
        FOREIGN KEY (id_movie) REFERENCES Movie (id_movie),
        id INT;
        role VARCHAR(50)
);

CREATE TABLE broadcast(
        id_movie INT,
        id_room INT,
        PRIMARY KEY (id_movie, id_room),
        FOREIGN KEY (id_movie) REFERENCES Movie (id_movie),
        FOREIGN KEY (id_room) REFERENCES Room (id_room)
);