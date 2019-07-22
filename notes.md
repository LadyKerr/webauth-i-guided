#Authentication vs Authorization

- Authentication is about who you are. You must prove to the api who you are. It's about **identity**

- Authorization is about the things you can do based on your identity. It is about **access**


##Hashing
Hashing occurs in the database. How it works:

- [password] + [secret]  => (hashing function) => Hashed String => stored in the db

