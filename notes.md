# CS 260 Notes

[My startup](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)


## HTML Notes
index.html - serves as a default entry point for my app. Users automatically are redirected to that page

Deploy process - I have to use a POSIX compliant console and I also have to have the deployFile.sh in my folder. HEre is the code I use to run it ./deployFiles.sh -k "/c/Users/juliosud/OneDrive - Church of Jesus Christ/Desktop/Winter 2025/CS 260/production.pem" -h smarteats.click -s startup

VS code live server - great tool to debug my code. short cut is ctrl L+O

## CSS Notes

Box containers - I wanted my app to have that look of mobile app, and this usually is achieved by wrapping some elements in boxes. Well, it ends up that it is much easier to do that, because not only can yo give a nice look to your app, but also you can create different classes to edit the styling for that given box

Looking for inspiration - In class we discussed some debugging tools, and I was able to use the dev tool to see what other websites use for their styling and then gain inspiration from their work.

## REACT - Phase 1

Structure - the importance of properly structuring the directories. Public for static files, and src for the files that run the heart of my react app (components, styles, lofic etc)

Using HTML inside JS - instead of just vanila html, react lets me use JSX to write HTML like syntax inside js.

## REACT - Phase 2

Data Persistence in react - used userState and useEffect to dynamically update componets, persist meal data in localStorage

Lift state up in react by ensuring that shared data (like the user auth) was managed at higher level component.

## SERVICE

AWS server - I know this may be simple for everyone else, but it took me some time to understand the the server in AWS is basically just a virtual machine that you can do what you want with it. So, if the case that I needed to use open ai keys to make a third party call, I needed to install in AWS the requirements for everything, like python for example.

Also, I learned about using middleware to control access, authenticate, and properly handle valid users.

## db

This time I learned how to manage my dependencies. I know this can be something simple for people, but I was struggling to understand files like package-lokc.json.

I also had to learn the differences between data bases like SQL and Mongodb, and how to properly represent my data in the different databases. 

## ws

Studying the chat code and simon really helped me understand the backend and frontend needed to use ws. The most important thing I needed to understand was how to send messages and receive messages.

I also learned that you can stabilish a HTTPS connection, and upgrate it to WSS, but once you upgrade you can still keep the functionalities of your HTTPS server