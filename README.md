
# 👩‍🚀 Senior Front-End Engineer Take-Home Project
## 🚀 Image Grid with Angular

Hello! 👋

You are tasked with building an image grid using Angular. The site should display a grid of images, and allow the user to click on an image to view it in full screen. The user can also assign an image to a Task. Once an image is assigned to a task, it can be viewed and browsed through in a separate tab. The image should also no longer appear in the main image grid once it has been assigned to a task.

Your application needs to only support a single task. Note that multiple images can be assigned to the task. 

There should be in total 2 main routes: one for the images, and the other for images assigned to a task. All routing should be done within the Angular application.

The images are provided in the form of `.png` files in an S3 bucket. Within the S3 bucket, there is a `.txt` file containing the full list of S3 paths for the images. This `.txt` file will be provided to you by our HR separately.

Since there are a lot of images and each image is large, you might want to consider paginating the images.


📝 You will be assessed on:

1. 💨 How performant the site is. Take time to consider how to load the images in a way that allows the user to have a seamless experience when browsing the images.
2. 🌸 The general design of the site with the use of CSS. You may use external design libraries as well (`tailwind`, `shadcn`, etc.) as you're comfortable with.
3. 🐞 The correctness of the site, i.e. no bugs, no broken links, etc.

Action steps:
- Fork this repository, and commit to your own repo. Once completed, share with us your forked Github URL.

All the best, and we hope this gives you a flavour of what you'll be doing here! 🔥
