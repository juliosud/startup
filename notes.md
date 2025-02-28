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