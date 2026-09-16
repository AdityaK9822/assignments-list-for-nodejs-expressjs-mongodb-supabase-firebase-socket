const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.json());

const requestLogger = (request, response, next) => {
    console.log(
        "Request URL :-", request.url,
        "Request Method :-", request.method,
        "Date :-", new Date().toLocaleString()
    );
    next();
};

app.use(requestLogger);

passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);

    if (!user) {
        return done(null, false, { message: "User not found" });
    }
    if (user.password != password) {
        return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
}));

app.use(passport.initialize());

const isAuthenticated = passport.authenticate("local", { session: false });

let users = [
    {
        id: 1,
        username: "admin",
        password: "admin123"
    }
];

let hotels = [
    {
        id: 1,
        name: "Hotel Sunshine",
        location: "New York",
        rating: 4.5,
        pricePerNight: 150
    },
    {
        id: 2,
        name: "Hotel Paradise",
        location: "Los Angeles",
        rating: 4.0,
        pricePerNight: 120
    },
    {
        id: 3,
        name: "Hotel Serenity",
        location: "Miami",
        rating: 4.8,
        pricePerNight: 200
    }
]
app.post("/register", (request, response) => {
    try {
        const newUser = {
            id: users.length + 1,
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        }
        users.push(newUser);
        response.status(200).json({ message: "User Registered Successfully." });
    } catch (error) {
        response.status(500).json(error);
    }
});

app.post("/login", isAuthenticated, (request, response) => {
    try {
        response.status(200).json({ message: "User Logged In Successfully." });
    } catch (error) {
        response.status(500).json(error);
    }
});

app.get("/hotels", (request, response) => {
    try {
        response.status(200).json(hotels);
    } catch (error) {
        response.status(500).json(error);
    }
});
app.get("/hotels/:id", (request, response) => {
    try {
        const hotel = hotels.find((h) => h.id == request.params.id);
        if (!hotel) {
            return response.status(404).json({ message: "Hotel not found" });
        }
        else {
            response.status(200).json(hotel);
        }
    } catch (error) {
        response.status(500).json(error)
    }
});

app.post("/hotels", isAuthenticated, (request, response) => {
    try {
        const newHotel = {
            id: hotels.length + 1,
            name: request.body.name,
            location: request.body.location,
            rating: request.body.rating,
            pricePerNight: request.body.pricePerNight
        }
        hotels.push(newHotel);
        response.status(200).json({ message: "Hotel Added Succesfully." });
    } catch (error) {
        response.status(500).json(error);
    }
});

app.put("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        let hotel = hotels.find((h) => h.id == request.params.id);
        if (!hotel) {
            return response.status(404).json({ message: "Hotel not found" });
        }
        else {
            hotel.name = request.body.name || hotel.name;
            hotel.location = request.body.location || hotel.location;
            hotel.rating = request.body.rating || hotel.rating;
            hotel.pricePerNight = request.body.pricePerNight || hotel.pricePerNight;
            response.status(200).json({ message: "Hotel Updated Successfully." });
        }
    } catch (error) {
        response.status(500).json(error);
    }
});

app.delete("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        const index = hotels.findIndex((h) => h.id == request.params.id);
        if (index === -1) {
            return response.status(404).json({ message: "Hotel not found" });
        }
        hotels.splice(index, 1);
        response.status(200).json({ message: "Hotel Deleted Successfully." });
    } catch (error) {
        response.status(500).json(error);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});